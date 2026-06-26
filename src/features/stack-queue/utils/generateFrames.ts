export interface StackQueueFrame {
  elements: {
    value: number;
    status: "default" | "active" | "removing" | "added";
  }[];
  highlightedMarker: string;
  message: string;
  topPointer?: number;
  frontPointer?: number;
  rearPointer?: number;
}

/**
 * Demo sequence: push(10), push(20), push(30), peek, pop, push(40), pop, pop.
 */
export function generateStackPushPopFrames(): StackQueueFrame[] {
  const frames: StackQueueFrame[] = [];

  // Helper to create default elements
  const els = (values: number[]): StackQueueFrame["elements"] =>
    values.map((v) => ({ value: v, status: "default" as const }));

  // --- @init: empty stack ---
  frames.push({
    elements: [],
    highlightedMarker: "@init",
    message: "Stack initialized — empty.",
  });

  // --- push(10) ---
  frames.push({
    elements: [{ value: 10, status: "added" }],
    highlightedMarker: "@push",
    message: "push(10) — 10 is now the top of the stack.",
    topPointer: 0,
  });

  // settle
  frames.push({
    elements: els([10]),
    highlightedMarker: "@push",
    message: "Stack: [10]. Top → 10.",
    topPointer: 0,
  });

  // --- push(20) ---
  frames.push({
    elements: [
      { value: 10, status: "default" },
      { value: 20, status: "added" },
    ],
    highlightedMarker: "@push",
    message: "push(20) — 20 is placed on top.",
    topPointer: 1,
  });

  frames.push({
    elements: els([10, 20]),
    highlightedMarker: "@push",
    message: "Stack: [10, 20]. Top → 20.",
    topPointer: 1,
  });

  // --- push(30) ---
  frames.push({
    elements: [
      { value: 10, status: "default" },
      { value: 20, status: "default" },
      { value: 30, status: "added" },
    ],
    highlightedMarker: "@push",
    message: "push(30) — 30 is placed on top.",
    topPointer: 2,
  });

  frames.push({
    elements: els([10, 20, 30]),
    highlightedMarker: "@push",
    message: "Stack: [10, 20, 30]. Top → 30.",
    topPointer: 2,
  });

  // --- peek ---
  frames.push({
    elements: [
      { value: 10, status: "default" },
      { value: 20, status: "default" },
      { value: 30, status: "active" },
    ],
    highlightedMarker: "@peek",
    message: "peek() → 30. The top element is inspected without removal.",
    topPointer: 2,
  });

  // --- pop ---
  frames.push({
    elements: [
      { value: 10, status: "default" },
      { value: 20, status: "default" },
      { value: 30, status: "removing" },
    ],
    highlightedMarker: "@empty-check",
    message: "pop() — checking isEmpty() before removing…",
    topPointer: 2,
  });

  frames.push({
    elements: els([10, 20]),
    highlightedMarker: "@pop",
    message: "pop() → 30 removed. Stack: [10, 20]. Top → 20.",
    topPointer: 1,
  });

  // --- push(40) ---
  frames.push({
    elements: [
      { value: 10, status: "default" },
      { value: 20, status: "default" },
      { value: 40, status: "added" },
    ],
    highlightedMarker: "@push",
    message: "push(40) — 40 is placed on top.",
    topPointer: 2,
  });

  frames.push({
    elements: els([10, 20, 40]),
    highlightedMarker: "@push",
    message: "Stack: [10, 20, 40]. Top → 40.",
    topPointer: 2,
  });

  // --- pop ---
  frames.push({
    elements: [
      { value: 10, status: "default" },
      { value: 20, status: "default" },
      { value: 40, status: "removing" },
    ],
    highlightedMarker: "@empty-check",
    message: "pop() — checking isEmpty()…",
    topPointer: 2,
  });

  frames.push({
    elements: els([10, 20]),
    highlightedMarker: "@pop",
    message: "pop() → 40 removed. Stack: [10, 20]. Top → 20.",
    topPointer: 1,
  });

  // --- pop ---
  frames.push({
    elements: [
      { value: 10, status: "default" },
      { value: 20, status: "removing" },
    ],
    highlightedMarker: "@empty-check",
    message: "pop() — checking isEmpty()…",
    topPointer: 1,
  });

  frames.push({
    elements: els([10]),
    highlightedMarker: "@pop",
    message: "pop() → 20 removed. Stack: [10]. Top → 10.",
    topPointer: 0,
  });

  return frames;
}

/**
 * Demo sequence: enqueue(10), enqueue(20), enqueue(30), front, dequeue,
 * enqueue(40), dequeue, dequeue.
 */
export function generateQueueFrames(): StackQueueFrame[] {
  const frames: StackQueueFrame[] = [];

  const els = (values: number[]): StackQueueFrame["elements"] =>
    values.map((v) => ({ value: v, status: "default" as const }));

  // --- @init ---
  frames.push({
    elements: [],
    highlightedMarker: "@init",
    message: "Queue initialized — empty.",
  });

  // --- enqueue(10) ---
  frames.push({
    elements: [{ value: 10, status: "added" }],
    highlightedMarker: "@enqueue",
    message: "enqueue(10) — 10 enters the rear of the queue.",
    frontPointer: 0,
    rearPointer: 0,
  });

  frames.push({
    elements: els([10]),
    highlightedMarker: "@enqueue",
    message: "Queue: [10]. Front → 10, Rear → 10.",
    frontPointer: 0,
    rearPointer: 0,
  });

  // --- enqueue(20) ---
  frames.push({
    elements: [
      { value: 10, status: "default" },
      { value: 20, status: "added" },
    ],
    highlightedMarker: "@enqueue",
    message: "enqueue(20) — 20 enters the rear.",
    frontPointer: 0,
    rearPointer: 1,
  });

  frames.push({
    elements: els([10, 20]),
    highlightedMarker: "@enqueue",
    message: "Queue: [10, 20]. Front → 10, Rear → 20.",
    frontPointer: 0,
    rearPointer: 1,
  });

  // --- enqueue(30) ---
  frames.push({
    elements: [
      { value: 10, status: "default" },
      { value: 20, status: "default" },
      { value: 30, status: "added" },
    ],
    highlightedMarker: "@enqueue",
    message: "enqueue(30) — 30 enters the rear.",
    frontPointer: 0,
    rearPointer: 2,
  });

  frames.push({
    elements: els([10, 20, 30]),
    highlightedMarker: "@enqueue",
    message: "Queue: [10, 20, 30]. Front → 10, Rear → 30.",
    frontPointer: 0,
    rearPointer: 2,
  });

  // --- front ---
  frames.push({
    elements: [
      { value: 10, status: "active" },
      { value: 20, status: "default" },
      { value: 30, status: "default" },
    ],
    highlightedMarker: "@front",
    message: "front() → 10. The front element is inspected without removal.",
    frontPointer: 0,
    rearPointer: 2,
  });

  // --- dequeue ---
  frames.push({
    elements: [
      { value: 10, status: "removing" },
      { value: 20, status: "default" },
      { value: 30, status: "default" },
    ],
    highlightedMarker: "@empty-check",
    message: "dequeue() — checking isEmpty() before removing…",
    frontPointer: 0,
    rearPointer: 2,
  });

  frames.push({
    elements: els([20, 30]),
    highlightedMarker: "@dequeue",
    message: "dequeue() → 10 removed. Queue: [20, 30]. Front → 20.",
    frontPointer: 0,
    rearPointer: 1,
  });

  // --- enqueue(40) ---
  frames.push({
    elements: [
      { value: 20, status: "default" },
      { value: 30, status: "default" },
      { value: 40, status: "added" },
    ],
    highlightedMarker: "@enqueue",
    message: "enqueue(40) — 40 enters the rear.",
    frontPointer: 0,
    rearPointer: 2,
  });

  frames.push({
    elements: els([20, 30, 40]),
    highlightedMarker: "@enqueue",
    message: "Queue: [20, 30, 40]. Front → 20, Rear → 40.",
    frontPointer: 0,
    rearPointer: 2,
  });

  // --- dequeue ---
  frames.push({
    elements: [
      { value: 20, status: "removing" },
      { value: 30, status: "default" },
      { value: 40, status: "default" },
    ],
    highlightedMarker: "@empty-check",
    message: "dequeue() — checking isEmpty()…",
    frontPointer: 0,
    rearPointer: 2,
  });

  frames.push({
    elements: els([30, 40]),
    highlightedMarker: "@dequeue",
    message: "dequeue() → 20 removed. Queue: [30, 40]. Front → 30.",
    frontPointer: 0,
    rearPointer: 1,
  });

  // --- dequeue ---
  frames.push({
    elements: [
      { value: 30, status: "removing" },
      { value: 40, status: "default" },
    ],
    highlightedMarker: "@empty-check",
    message: "dequeue() — checking isEmpty()…",
    frontPointer: 0,
    rearPointer: 1,
  });

  frames.push({
    elements: els([40]),
    highlightedMarker: "@dequeue",
    message: "dequeue() → 30 removed. Queue: [40]. Front → 40, Rear → 40.",
    frontPointer: 0,
    rearPointer: 0,
  });

  return frames;
}
