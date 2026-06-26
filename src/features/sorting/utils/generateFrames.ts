import type { ArrayItem, VisualizerFrame } from "@/shared/types";

const DEFAULT_SORTING_ARRAY = [25, 40, 15, 55, 30, 20];

export function generateBubbleSortFrames(arr: number[]): VisualizerFrame[] {
  const frames: VisualizerFrame[] = [];
  const currentArray: ArrayItem[] = arr.map((val, idx) => ({
    value: val,
    index: idx,
    status: "default",
  }));

  const pushFrame = (
    array: ArrayItem[],
    marker: string,
    sortedIndices: number[] = [],
  ) => {
    frames.push({
      array: array.map((item, idx) => {
        let status = item.status;
        if (sortedIndices.includes(idx)) {
          status = "sorted";
        }
        return { ...item, status };
      }),
      highlightedMarker: marker,
    });
  };

  const n = currentArray.length;
  const sortedIndices: number[] = [];

  pushFrame(currentArray, "@outer-loop", sortedIndices);

  for (let i = 0; i < n; i++) {
    pushFrame(currentArray, "@outer-loop", sortedIndices);

    for (let j = 0; j < n - i - 1; j++) {
      pushFrame(currentArray, "@inner-loop", sortedIndices);

      currentArray[j].status = "comparing";
      currentArray[j + 1].status = "comparing";
      pushFrame(currentArray, "@compare", sortedIndices);

      if (currentArray[j].value > currentArray[j + 1].value) {
        currentArray[j].status = "swapping";
        currentArray[j + 1].status = "swapping";
        pushFrame(currentArray, "@swap", sortedIndices);

        const temp = currentArray[j];
        currentArray[j] = currentArray[j + 1];
        currentArray[j + 1] = temp;

        pushFrame(currentArray, "@swap", sortedIndices);
      }

      currentArray[j].status = "default";
      currentArray[j + 1].status = "default";
    }

    sortedIndices.push(n - i - 1);
    pushFrame(currentArray, "@outer-loop", sortedIndices);
  }

  const finalArray: ArrayItem[] = currentArray.map((item) => ({
    ...item,
    status: "sorted",
  }));
  frames.push({ array: finalArray, highlightedMarker: "@outer-loop" });

  return frames;
}

export function generateSelectionSortFrames(arr: number[]): VisualizerFrame[] {
  const frames: VisualizerFrame[] = [];
  const currentArray: ArrayItem[] = arr.map((val, idx) => ({
    value: val,
    index: idx,
    status: "default",
  }));

  const pushFrame = (
    array: ArrayItem[],
    marker: string,
    sortedIndices: number[] = [],
    minIdx = -1,
    jIdx = -1,
  ) => {
    frames.push({
      array: array.map((item, idx) => {
        let status: "default" | "comparing" | "swapping" | "sorted" = "default";
        if (sortedIndices.includes(idx)) {
          status = "sorted";
        } else if (idx === minIdx || idx === jIdx) {
          status = "comparing";
        }
        return { ...item, status };
      }),
      highlightedMarker: marker,
    });
  };

  const n = currentArray.length;
  const sortedIndices: number[] = [];

  pushFrame(currentArray, "@outer-loop", sortedIndices);

  for (let i = 0; i < n; i++) {
    pushFrame(currentArray, "@outer-loop", sortedIndices);

    if (i === n - 1) {
      sortedIndices.push(i);
      pushFrame(currentArray, "@outer-loop", sortedIndices);
      break;
    }

    let minIdx = i;
    pushFrame(currentArray, "@init-min", sortedIndices, minIdx);

    for (let j = i + 1; j < n; j++) {
      pushFrame(currentArray, "@inner-loop", sortedIndices, minIdx, j);
      pushFrame(currentArray, "@compare", sortedIndices, minIdx, j);

      if (currentArray[j].value < currentArray[minIdx].value) {
        minIdx = j;
        pushFrame(currentArray, "@update-min", sortedIndices, minIdx);
      }
    }

    pushFrame(currentArray, "@outer-loop", sortedIndices, minIdx, i);

    if (minIdx !== i) {
      const swapArray: ArrayItem[] = currentArray.map((item, idx) => {
        let status: "default" | "comparing" | "swapping" | "sorted" = "default";
        if (sortedIndices.includes(idx)) {
          status = "sorted";
        } else if (idx === minIdx || idx === i) {
          status = "swapping";
        }
        return { ...item, status };
      });
      frames.push({ array: swapArray, highlightedMarker: "@swap" });

      const temp = currentArray[i];
      currentArray[i] = currentArray[minIdx];
      currentArray[minIdx] = temp;

      const swapArray2: ArrayItem[] = currentArray.map((item, idx) => {
        let status: "default" | "comparing" | "swapping" | "sorted" = "default";
        if (sortedIndices.includes(idx)) {
          status = "sorted";
        } else if (idx === minIdx || idx === i) {
          status = "swapping";
        }
        return { ...item, status };
      });
      frames.push({ array: swapArray2, highlightedMarker: "@swap" });
    }

    sortedIndices.push(i);
    pushFrame(currentArray, "@outer-loop", sortedIndices);
  }

  const finalArray: ArrayItem[] = currentArray.map((item) => ({
    ...item,
    status: "sorted",
  }));
  frames.push({ array: finalArray, highlightedMarker: "@outer-loop" });

  return frames;
}

// --- Helpers shared by the newer generators ---------------------------------

type Highlight = {
  comparing?: number[];
  swapping?: number[];
  pivot?: number;
  sorted?: number[];
};

/** Build an immutable snapshot of `a` with per-index status overrides. */
function snapshot(
  a: ArrayItem[],
  marker: string,
  hl: Highlight = {},
): VisualizerFrame {
  const { comparing = [], swapping = [], pivot = -1, sorted = [] } = hl;
  return {
    array: a.map((item, idx) => {
      let status: ArrayItem["status"] = "default";
      if (sorted.includes(idx)) status = "sorted";
      if (idx === pivot) status = "pivot";
      if (comparing.includes(idx)) status = "comparing";
      if (swapping.includes(idx)) status = "swapping";
      return { ...item, status };
    }),
    highlightedMarker: marker,
  };
}

/** Inclusive..exclusive integer range [start, end). */
function range(start: number, end: number): number[] {
  const out: number[] = [];
  for (let i = start; i < end; i++) out.push(i);
  return out;
}

export function generateInsertionSortFrames(arr: number[]): VisualizerFrame[] {
  const frames: VisualizerFrame[] = [];
  const a: ArrayItem[] = arr.map((val, idx) => ({
    value: val,
    index: idx,
    status: "default",
  }));
  const n = a.length;

  frames.push(snapshot(a, "@outer-loop", { sorted: [0] }));

  for (let i = 1; i < n; i++) {
    const sortedPrefix = range(0, i);
    frames.push(snapshot(a, "@pick", { comparing: [i], sorted: sortedPrefix }));

    let j = i;
    while (j > 0 && a[j - 1].value > a[j].value) {
      frames.push(
        snapshot(a, "@compare", {
          comparing: [j, j - 1],
          sorted: sortedPrefix,
        }),
      );
      frames.push(
        snapshot(a, "@shift", { swapping: [j, j - 1], sorted: sortedPrefix }),
      );

      const tmp = a[j];
      a[j] = a[j - 1];
      a[j - 1] = tmp;

      frames.push(
        snapshot(a, "@shift", { swapping: [j, j - 1], sorted: sortedPrefix }),
      );
      j--;
    }

    frames.push(snapshot(a, "@outer-loop", { sorted: range(0, i + 1) }));
  }

  frames.push({
    array: a.map((item) => ({ ...item, status: "sorted" })),
    highlightedMarker: "@outer-loop",
  });
  return frames;
}

export function generateQuickSortFrames(arr: number[]): VisualizerFrame[] {
  const frames: VisualizerFrame[] = [];
  const a: ArrayItem[] = arr.map((val, idx) => ({
    value: val,
    index: idx,
    status: "default",
  }));
  const sorted = new Set<number>();

  const sortedList = () => Array.from(sorted);
  const swap = (i: number, j: number) => {
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  };

  const partition = (low: number, high: number): number => {
    const pivot = high;
    frames.push(snapshot(a, "@pivot", { pivot, sorted: sortedList() }));

    let i = low;
    for (let j = low; j < high; j++) {
      frames.push(
        snapshot(a, "@compare", {
          pivot,
          comparing: [j, i],
          sorted: sortedList(),
        }),
      );
      if (a[j].value < a[pivot].value) {
        if (i !== j) {
          frames.push(
            snapshot(a, "@swap", {
              pivot,
              swapping: [i, j],
              sorted: sortedList(),
            }),
          );
          swap(i, j);
          frames.push(
            snapshot(a, "@swap", {
              pivot,
              swapping: [i, j],
              sorted: sortedList(),
            }),
          );
        }
        i++;
      }
    }

    if (i !== high) {
      frames.push(
        snapshot(a, "@place", { swapping: [i, high], sorted: sortedList() }),
      );
      swap(i, high);
      frames.push(
        snapshot(a, "@place", { swapping: [i, high], sorted: sortedList() }),
      );
    }
    sorted.add(i);
    frames.push(snapshot(a, "@place", { sorted: sortedList() }));
    return i;
  };

  const sort = (low: number, high: number) => {
    if (low > high) return;
    if (low === high) {
      sorted.add(low);
      frames.push(snapshot(a, "@base", { sorted: sortedList() }));
      return;
    }
    const p = partition(low, high);
    sort(low, p - 1);
    sort(p + 1, high);
  };

  if (a.length > 0) {
    frames.push(snapshot(a, "@start"));
    sort(0, a.length - 1);
  }

  frames.push({
    array: a.map((item) => ({ ...item, status: "sorted" })),
    highlightedMarker: "@start",
  });
  return frames;
}

export function generateMergeSortFrames(arr: number[]): VisualizerFrame[] {
  const frames: VisualizerFrame[] = [];
  const a: ArrayItem[] = arr.map((val, idx) => ({
    value: val,
    index: idx,
    status: "default",
  }));

  const sortedRange = (lo: number, hi: number) => range(lo, hi + 1);

  // Merge by MOVING the element objects (not overwriting values), so every
  // element keeps a stable identity + height. Sorting then reads as pure
  // horizontal repositioning — no size morphing, no flicker.
  const merge = (low: number, mid: number, high: number) => {
    const left = a.slice(low, mid + 1);
    const right = a.slice(mid + 1, high + 1);
    const merged: ArrayItem[] = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
      // Both heads are still at their original positions until the final write.
      frames.push(
        snapshot(a, "@compare", { comparing: [low + i, mid + 1 + j] }),
      );
      if (left[i].value <= right[j].value) {
        merged.push(left[i]);
        i++;
      } else {
        merged.push(right[j]);
        j++;
      }
    }
    while (i < left.length) merged.push(left[i++]);
    while (j < right.length) merged.push(right[j++]);

    // Atomic reposition of the whole window (keeps keys unique mid-frame).
    for (let t = 0; t < merged.length; t++) a[low + t] = merged[t];
    frames.push(snapshot(a, "@write", { swapping: range(low, high + 1) }));
    frames.push(snapshot(a, "@merged", { sorted: sortedRange(low, high) }));
  };

  const sort = (low: number, high: number) => {
    if (low >= high) return;
    const mid = Math.floor((low + high) / 2);
    frames.push(snapshot(a, "@split", { comparing: range(low, high + 1) }));
    sort(low, mid);
    sort(mid + 1, high);
    merge(low, mid, high);
  };

  if (a.length > 0) {
    frames.push(snapshot(a, "@start"));
    sort(0, a.length - 1);
  }

  frames.push({
    array: a.map((item) => ({ ...item, status: "sorted" })),
    highlightedMarker: "@start",
  });
  return frames;
}

export { DEFAULT_SORTING_ARRAY };
