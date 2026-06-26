import type { ArrayItem, VisualizerFrame } from '@/shared/types';

const DEFAULT_SORTING_ARRAY = [25, 40, 15, 55, 30, 20];

export function generateBubbleSortFrames(arr: number[]): VisualizerFrame[] {
  const frames: VisualizerFrame[] = [];
  const currentArray: ArrayItem[] = arr.map((val, idx) => ({ value: val, index: idx, status: 'default' }));

  const pushFrame = (array: ArrayItem[], marker: string, sortedIndices: number[] = []) => {
    frames.push({
      array: array.map((item, idx) => {
        let status = item.status;
        if (sortedIndices.includes(idx)) {
          status = 'sorted';
        }
        return { ...item, status };
      }),
      highlightedMarker: marker
    });
  };

  const n = currentArray.length;
  const sortedIndices: number[] = [];

  pushFrame(currentArray, '@outer-loop', sortedIndices);

  for (let i = 0; i < n; i++) {
    pushFrame(currentArray, '@outer-loop', sortedIndices);

    for (let j = 0; j < n - i - 1; j++) {
      pushFrame(currentArray, '@inner-loop', sortedIndices);

      currentArray[j].status = 'comparing';
      currentArray[j + 1].status = 'comparing';
      pushFrame(currentArray, '@compare', sortedIndices);

      if (currentArray[j].value > currentArray[j + 1].value) {
        currentArray[j].status = 'swapping';
        currentArray[j + 1].status = 'swapping';
        pushFrame(currentArray, '@swap', sortedIndices);

        const temp = currentArray[j];
        currentArray[j] = currentArray[j + 1];
        currentArray[j + 1] = temp;

        pushFrame(currentArray, '@swap', sortedIndices);
      }

      currentArray[j].status = 'default';
      currentArray[j + 1].status = 'default';
    }

    sortedIndices.push(n - i - 1);
    pushFrame(currentArray, '@outer-loop', sortedIndices);
  }

  const finalArray: ArrayItem[] = currentArray.map(item => ({ ...item, status: 'sorted' }));
  frames.push({ array: finalArray, highlightedMarker: '@outer-loop' });

  return frames;
}

export function generateSelectionSortFrames(arr: number[]): VisualizerFrame[] {
  const frames: VisualizerFrame[] = [];
  const currentArray: ArrayItem[] = arr.map((val, idx) => ({ value: val, index: idx, status: 'default' }));

  const pushFrame = (array: ArrayItem[], marker: string, sortedIndices: number[] = [], minIdx = -1, jIdx = -1) => {
    frames.push({
      array: array.map((item, idx) => {
        let status: 'default' | 'comparing' | 'swapping' | 'sorted' = 'default';
        if (sortedIndices.includes(idx)) {
          status = 'sorted';
        } else if (idx === minIdx || idx === jIdx) {
          status = 'comparing';
        }
        return { ...item, status };
      }),
      highlightedMarker: marker
    });
  };

  const n = currentArray.length;
  const sortedIndices: number[] = [];

  pushFrame(currentArray, '@outer-loop', sortedIndices);

  for (let i = 0; i < n; i++) {
    pushFrame(currentArray, '@outer-loop', sortedIndices);

    if (i === n - 1) {
      sortedIndices.push(i);
      pushFrame(currentArray, '@outer-loop', sortedIndices);
      break;
    }

    let minIdx = i;
    pushFrame(currentArray, '@init-min', sortedIndices, minIdx);

    for (let j = i + 1; j < n; j++) {
      pushFrame(currentArray, '@inner-loop', sortedIndices, minIdx, j);
      pushFrame(currentArray, '@compare', sortedIndices, minIdx, j);

      if (currentArray[j].value < currentArray[minIdx].value) {
        minIdx = j;
        pushFrame(currentArray, '@update-min', sortedIndices, minIdx);
      }
    }

    pushFrame(currentArray, '@outer-loop', sortedIndices, minIdx, i);

    if (minIdx !== i) {
      const swapArray: ArrayItem[] = currentArray.map((item, idx) => {
        let status: 'default' | 'comparing' | 'swapping' | 'sorted' = 'default';
        if (sortedIndices.includes(idx)) {
          status = 'sorted';
        } else if (idx === minIdx || idx === i) {
          status = 'swapping';
        }
        return { ...item, status };
      });
      frames.push({ array: swapArray, highlightedMarker: '@swap' });

      const temp = currentArray[i];
      currentArray[i] = currentArray[minIdx];
      currentArray[minIdx] = temp;

      const swapArray2: ArrayItem[] = currentArray.map((item, idx) => {
        let status: 'default' | 'comparing' | 'swapping' | 'sorted' = 'default';
        if (sortedIndices.includes(idx)) {
          status = 'sorted';
        } else if (idx === minIdx || idx === i) {
          status = 'swapping';
        }
        return { ...item, status };
      });
      frames.push({ array: swapArray2, highlightedMarker: '@swap' });
    }

    sortedIndices.push(i);
    pushFrame(currentArray, '@outer-loop', sortedIndices);
  }

  const finalArray: ArrayItem[] = currentArray.map(item => ({ ...item, status: 'sorted' }));
  frames.push({ array: finalArray, highlightedMarker: '@outer-loop' });

  return frames;
}

export { DEFAULT_SORTING_ARRAY };
