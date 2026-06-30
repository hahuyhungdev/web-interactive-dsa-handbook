import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { keymap, EditorView } from "@codemirror/view";
import { Prec } from "@codemirror/state";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, CheckCircle, XCircle, Info, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Switch } from "@mantine/core";
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from "react-resizable-panels";
import { useMediaQuery } from "@mantine/hooks";
import { CHAPTERS } from "@/shared/constants/chapters";

const BOILERPLATES = {
  "two-sum": `function twoSum(nums, target) {
  // Write your code here
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
}`,
  "reverse-list": `function reverseList(head) {
  // Write your code here
  let prev = null;
  let curr = head;
  while (curr !== null) {
    let nextTemp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
  }
  return prev;
}`,
  "find-max": `function findMax(arr) {
  // Write your code here
  if (arr.length === 0) return null;
  let maxVal = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > maxVal) {
      maxVal = arr[i];
    }
  }
  return maxVal;
}`,
  "binary-search": `function binarySearch(arr, target) {
  // Write your code here
  let low = 0;
  let high = arr.length - 1;
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    let val = arr[mid];
    if (val === target) {
      return mid;
    } else if (val < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return -1;
}`,
  "valid-parentheses": `function isValid(s) {
  // Write your code here
  const stack = [];
  const mapping = {
    ")": "(",
    "}": "{",
    "]": "["
  };
  for (let i = 0; i < s.length; i++) {
    let char = s[i];
    if (char === "(" || char === "{" || char === "[") {
      stack.push(char);
    } else {
      let top = stack.pop();
      if (top !== mapping[char]) {
        return false;
      }
    }
  }
  return stack.length === 0;
}`,
  "remove-duplicates": `function removeDuplicates(nums) {
  // Write your code here
  if (nums.length === 0) return 0;
  let i = 0;
  for (let j = 1; j < nums.length; j++) {
    if (nums[j] !== nums[i]) {
      i++;
      nums[i] = nums[j];
    }
  }
  return i + 1;
}`,
  "merge-sorted-array": `function merge(nums1, m, nums2, n) {
  // Write your code here
  let i = m - 1;
  let j = n - 1;
  let k = m + n - 1;
  while (j >= 0) {
    if (i >= 0 && nums1[i] > nums2[j]) {
      nums1[k] = nums1[i];
      i--;
    } else {
      nums1[k] = nums2[j];
      j--;
    }
    k--;
  }
}`,
  "max-subarray": `function maxSubArray(nums) {
  // Write your code here
  let maxSoFar = nums[0];
  let currMax = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currMax = Math.max(nums[i], currMax + nums[i]);
    maxSoFar = Math.max(maxSoFar, currMax);
  }
  return maxSoFar;
}`,
  "sort-colors": `function sortColors(nums) {
  // Write your code here
  let low = 0, mid = 0, high = nums.length - 1;
  while (mid <= high) {
    if (nums[mid] === 0) {
      let temp = nums[low];
      nums[low] = nums[mid];
      nums[mid] = temp;
      low++;
      mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      let temp = nums[mid];
      nums[mid] = nums[high];
      nums[high] = temp;
      high--;
    }
  }
}`,
  "kth-largest": `function findKthLargest(nums, k) {
  // Write your code here
  nums.sort((a, b) => b - a);
  return nums[k - 1];
}`,
  "top-k-frequent": `function topKFrequent(nums, k) {
  // Write your code here
  const count = {};
  for (const num of nums) {
    count[num] = (count[num] || 0) + 1;
  }
  const unique = Object.keys(count).map(Number);
  unique.sort((a, b) => count[b] - count[a]);
  return unique.slice(0, k);
}`,
  "intersection-arrays": `function intersection(nums1, nums2) {
  // Write your code here
  const set1 = new Set(nums1);
  const result = [];
  for (const num of nums2) {
    if (set1.has(num)) {
      result.push(num);
      set1.delete(num);
    }
  }
  return result;
}`,
  "merge-two-lists": `function mergeTwoLists(list1, list2) {
  // Write your code here
  let dummy = { val: 0, next: null };
  let curr = dummy;
  while (list1 !== null && list2 !== null) {
    if (list1.val <= list2.val) {
      curr.next = list1;
      list1 = list1.next;
    } else {
      curr.next = list2;
      list2 = list2.next;
    }
    curr = curr.next;
  }
  curr.next = list1 !== null ? list1 : list2;
  return dummy.next;
}`,
  "linked-list-cycle": `function hasCycle(head) {
  // Write your code here
  if (!head || !head.next) return false;
  let slow = head;
  let fast = head.next;
  while (slow !== fast) {
    if (!fast || !fast.next) return false;
    slow = slow.next;
    fast = fast.next.next;
  }
  return true;
}`,
  "middle-list": `function middleNode(head) {
  // Write your code here
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}`,
  "remove-nth-node": `function removeNthFromEnd(head, n) {
  // Write your code here
  let dummy = { val: 0, next: head };
  let first = dummy;
  let second = dummy;
  for (let i = 1; i <= n + 1; i++) {
    first = first.next;
  }
  while (first !== null) {
    first = first.next;
    second = second.next;
  }
  second.next = second.next.next;
  return dummy.next;
}`,
  "queue-using-stacks": `// Implement the MyQueue class below:
class MyQueue {
  constructor() {
    this.stack1 = [];
    this.stack2 = [];
  }
  push(x) {
    this.stack1.push(x);
  }
  pop() {
    if (this.stack2.length === 0) {
      while (this.stack1.length > 0) {
        this.stack2.push(this.stack1.pop());
      }
    }
    return this.stack2.pop();
  }
  peek() {
    if (this.stack2.length === 0) {
      while (this.stack1.length > 0) {
        this.stack2.push(this.stack1.pop());
      }
    }
    return this.stack2[this.stack2.length - 1];
  }
  empty() {
    return this.stack1.length === 0 && this.stack2.length === 0;
  }
}

// Do not modify the test function below:
function runQueue(ops, vals) {
  const q = new MyQueue();
  const result = [null];
  for (let i = 1; i < ops.length; i++) {
    const op = ops[i];
    const val = vals[i];
    if (op === "push") {
      q.push(val[0]);
      result.push(null);
    } else if (op === "pop") {
      result.push(q.pop());
    } else if (op === "peek") {
      result.push(q.peek());
    } else if (op === "empty") {
      result.push(q.empty());
    }
  }
  return result;
}`,
  "min-stack": `// Implement the MinStack class below:
class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = [];
  }
  push(val) {
    this.stack.push(val);
    if (this.minStack.length === 0 || val <= this.minStack[this.minStack.length - 1]) {
      this.minStack.push(val);
    }
  }
  pop() {
    const val = this.stack.pop();
    if (val === this.minStack[this.minStack.length - 1]) {
      this.minStack.pop();
    }
    return val;
  }
  top() {
    return this.stack[this.stack.length - 1];
  }
  getMin() {
    return this.minStack[this.minStack.length - 1];
  }
}

// Do not modify the test function below:
function runMinStack(ops, vals) {
  const s = new MinStack();
  const result = [null];
  for (let i = 1; i < ops.length; i++) {
    const op = ops[i];
    const val = vals[i];
    if (op === "push") {
      s.push(val[0]);
      result.push(null);
    } else if (op === "pop") {
      s.pop();
      result.push(null);
    } else if (op === "top") {
      result.push(s.top());
    } else if (op === "getMin") {
      result.push(s.getMin());
    }
  }
  return result;
}`,
  "evaluate-rpn": `function evalRPN(tokens) {
  // Write your code here
  const stack = [];
  for (const token of tokens) {
    if (["+", "-", "*", "/"].includes(token)) {
      const b = stack.pop();
      const a = stack.pop();
      if (token === "+") stack.push(a + b);
      else if (token === "-") stack.push(a - b);
      else if (token === "*") stack.push(a * b);
      else if (token === "/") stack.push(Math.trunc(a / b));
    } else {
      stack.push(Number(token));
    }
  }
  return stack[0];
}`,
  "next-greater-element": `function nextGreaterElement(nums1, nums2) {
  // Write your code here
  const stack = [];
  const map = new Map();
  for (const num of nums2) {
    while (stack.length > 0 && stack[stack.length - 1] < num) {
      map.set(stack.pop(), num);
    }
    stack.push(num);
  }
  return nums1.map(num => map.has(num) ? map.get(num) : -1);
}`,
  "invert-tree": `function invertTree(root) {
  // Write your code here
  if (root === null) return null;
  let temp = root.left;
  root.left = invertTree(root.right);
  root.right = invertTree(temp);
  return root;
}`,
  "contains-duplicate": `function containsDuplicate(nums) {
  // Write your code here
  const set = new Set();
  for (const num of nums) {
    if (set.has(num)) return true;
    set.add(num);
  }
  return false;
}`,
  "find-center": `function findCenter(edges) {
  // Write your code here
  const [u1, v1] = edges[0];
  const [u2, v2] = edges[1];
  return (u1 === u2 || u1 === v2) ? u1 : v1;
}`,
};

interface TestCase {
  input: any[];
  expected: any;
}

interface TestResult {
  input: any[];
  expected: any;
  actual: any;
  error: string | null;
  passed?: boolean;
  steps?: any[];
}

const STEP_META: Record<
  string,
  { label: string; badgeClass: string; dotClass: string }
> = {
  access: {
    label: "Array read",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
    dotClass: "bg-amber-400",
  },
  binary_window: {
    label: "Choose mid",
    badgeClass: "bg-charcoal/5 text-charcoal border-charcoal/10",
    dotClass: "bg-charcoal/40",
  },
  binary_decision: {
    label: "Narrow range",
    badgeClass: "bg-coral/10 text-coral border-coral/20",
    dotClass: "bg-coral",
  },
  get_next: {
    label: "Pointer read",
    badgeClass: "bg-charcoal/5 text-charcoal border-charcoal/10",
    dotClass: "bg-charcoal/45",
  },
  set_next: {
    label: "Pointer write",
    badgeClass: "bg-coral/10 text-coral border-coral/20",
    dotClass: "bg-coral",
  },
  string_access: {
    label: "Character read",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
    dotClass: "bg-amber-400",
  },
  stack_push: {
    label: "Stack push",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
    dotClass: "bg-emerald-500",
  },
  stack_pop: {
    label: "Stack pop",
    badgeClass: "bg-coral/10 text-coral border-coral/20",
    dotClass: "bg-coral",
  },
};

const DEFAULT_STEP_META = {
  label: "Operation",
  badgeClass: "bg-charcoal/5 text-charcoal/70 border-charcoal/10",
  dotClass: "bg-charcoal/35",
};

const SANDBOX_LEGENDS: Record<
  string,
  Array<{ label: string; dotClass: string }>
> = {
  "two-sum": [
    { label: "Read", dotClass: "bg-amber-400" },
    { label: "Solution", dotClass: "bg-emerald-600" },
  ],
  "find-max": [
    { label: "Current", dotClass: "bg-amber-400" },
    { label: "Maximum", dotClass: "bg-emerald-600" },
  ],
  "reverse-list": [
    { label: "Active node", dotClass: "bg-coral" },
    { label: "Pointer", dotClass: "bg-charcoal/35" },
  ],
  "binary-search": [
    { label: "Window", dotClass: "bg-paper border border-charcoal/25" },
    { label: "Mid", dotClass: "bg-amber-400" },
    { label: "Found", dotClass: "bg-emerald-600" },
  ],
  "valid-parentheses": [
    { label: "Current char", dotClass: "bg-coral" },
    { label: "Stack item", dotClass: "bg-emerald-600" },
  ],
  "remove-duplicates": [
    { label: "Access", dotClass: "bg-amber-400" },
  ],
  "merge-sorted-array": [
    { label: "Access", dotClass: "bg-amber-400" },
  ],
  "max-subarray": [
    { label: "Access", dotClass: "bg-amber-400" },
  ],
  "sort-colors": [
    { label: "Access", dotClass: "bg-amber-400" },
  ],
  "kth-largest": [
    { label: "Access", dotClass: "bg-amber-400" },
  ],
  "top-k-frequent": [
    { label: "Access", dotClass: "bg-amber-400" },
  ],
  "intersection-arrays": [
    { label: "Access", dotClass: "bg-amber-400" },
  ],
  "merge-two-lists": [
    { label: "Active node", dotClass: "bg-coral" },
    { label: "Pointer", dotClass: "bg-charcoal/35" },
  ],
  "linked-list-cycle": [
    { label: "Active node", dotClass: "bg-coral" },
    { label: "Pointer", dotClass: "bg-charcoal/35" },
  ],
  "middle-list": [
    { label: "Active node", dotClass: "bg-coral" },
    { label: "Pointer", dotClass: "bg-charcoal/35" },
  ],
  "remove-nth-node": [
    { label: "Active node", dotClass: "bg-coral" },
    { label: "Pointer", dotClass: "bg-charcoal/35" },
  ],
};

function getStepMeta(type: string | undefined) {
  return type ? STEP_META[type] ?? DEFAULT_STEP_META : DEFAULT_STEP_META;
}

function buildDisplaySteps(challenge: string, rawSteps: any[]) {
  if (challenge !== "binary-search") return rawSteps;

  return rawSteps.flatMap((step, sourceIndex) => {
    if (step.type !== "access") return [{ ...step, sourceIndex }];

    return [
      { ...step, type: "binary_window", sourceIndex },
      { ...step, sourceIndex },
      { ...step, type: "binary_decision", sourceIndex },
    ];
  });
}

const TEST_CASES: Record<string, TestCase[]> = {
  "two-sum": [
    { input: [[1, 10, 3, 4, 20, 6], 30], expected: [1, 4] },
    { input: [[3, 2, 4], 6], expected: [1, 2] },
    { input: [[3, 3], 6], expected: [0, 1] },
  ],
  "reverse-list": [
    { input: [[1, 2, 3, 4, 5, 6, 7, 8]], expected: [8, 7, 6, 5, 4, 3, 2, 1] },
    { input: [[42]], expected: [42] },
    { input: [[]], expected: [] },
  ],
  "find-max": [
    { input: [[1, 2, 3, 4, 5, 6, 7, 8]], expected: 8 },
    { input: [[-10, -5, -3, -9, -2]], expected: -2 },
    { input: [[42]], expected: 42 },
  ],
  "binary-search": [
    { input: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], 31], expected: 30 },
    { input: [[1, 3, 5, 7, 9, 11, 13], 9], expected: 4 },
    { input: [[1, 3, 5, 7, 9, 11, 13], 2], expected: -1 },
  ],
  "valid-parentheses": [
    { input: ["({[]})[]{}"], expected: true },
    { input: ["([)]"], expected: false },
    { input: ["{[]}"], expected: true },
  ],
  "remove-duplicates": [
    { input: [[1, 1, 2]], expected: 2 },
    { input: [[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]], expected: 5 },
    { input: [[1, 2, 3]], expected: 3 },
  ],
  "merge-sorted-array": [
    { input: [[1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3], expected: [1, 2, 2, 3, 5, 6] },
    { input: [[1], 1, [], 0], expected: [1] },
    { input: [[0], 0, [1], 1], expected: [1] },
  ],
  "max-subarray": [
    { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
    { input: [[1]], expected: 1 },
    { input: [[5, 4, -1, 7, 8]], expected: 23 },
  ],
  "sort-colors": [
    { input: [[2, 0, 2, 1, 1, 0]], expected: [0, 0, 1, 1, 2, 2] },
    { input: [[2, 0, 1]], expected: [0, 1, 2] },
  ],
  "kth-largest": [
    { input: [[3, 2, 1, 5, 6, 4], 2], expected: 5 },
    { input: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], expected: 4 },
  ],
  "top-k-frequent": [
    { input: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2] },
    { input: [[1], 1], expected: [1] },
  ],
  "intersection-arrays": [
    { input: [[1, 2, 2, 1], [2, 2]], expected: [2] },
    { input: [[4, 9, 5], [9, 4, 9, 8, 4]], expected: [9, 4] },
  ],
  "merge-two-lists": [
    { input: [[1, 2, 4], [1, 3, 4]], expected: [1, 1, 2, 3, 4, 4] },
    { input: [[], []], expected: [] },
    { input: [[], [0]], expected: [0] },
  ],
  "linked-list-cycle": [
    { input: [[3, 2, 0, -4]], expected: false },
  ],
  "middle-list": [
    { input: [[1, 2, 3, 4, 5]], expected: [3, 4, 5] },
    { input: [[1, 2, 3, 4, 5, 6]], expected: [4, 5, 6] },
  ],
  "remove-nth-node": [
    { input: [[1, 2, 3, 4, 5], 2], expected: [1, 2, 3, 5] },
    { input: [[1], 1], expected: [] },
    { input: [[1, 2], 1], expected: [1] },
  ],
  "queue-using-stacks": [
    {
      input: [
        ["MyQueue", "push", "push", "peek", "pop", "empty"],
        [[], [1], [2], [], [], []]
      ],
      expected: [null, null, null, 1, 1, false]
    },
    {
      input: [
        ["MyQueue", "push", "empty", "push", "pop", "empty"],
        [[], [10], [], [20], [], []]
      ],
      expected: [null, null, false, null, 10, false]
    }
  ],
  "min-stack": [
    {
      input: [
        ["MinStack", "push", "push", "push", "getMin", "pop", "top", "getMin"],
        [[], [-2], [0], [-3], [], [], [], []]
      ],
      expected: [null, null, null, null, -3, null, 0, -2]
    },
    {
      input: [
        ["MinStack", "push", "push", "top", "getMin"],
        [[], [5], [3], [], []]
      ],
      expected: [null, null, null, 3, 3]
    }
  ],
  "evaluate-rpn": [
    { input: [["2", "1", "+", "3", "*"]], expected: 9 },
    { input: [["4", "13", "5", "/", "+"]], expected: 6 },
    { input: [["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]], expected: 22 }
  ],
  "next-greater-element": [
    { input: [[4, 1, 2], [1, 3, 4, 2]], expected: [-1, 3, -1] },
    { input: [[2, 4], [1, 2, 3, 4]], expected: [3, -1] }
  ],
  "invert-tree": [
    { input: [[4, 2, 7, 1, 3, 6, 9]], expected: [4, 7, 2, 9, 6, 3, 1] },
    { input: [[2, 1, 3]], expected: [2, 3, 1] },
    { input: [[]], expected: [] },
  ],
  "contains-duplicate": [
    { input: [[1, 2, 3, 1]], expected: true },
    { input: [[1, 2, 3, 4]], expected: false },
    { input: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], expected: true },
  ],
  "find-center": [
    { input: [[[1, 2], [2, 3], [4, 2]]], expected: 2 },
    { input: [[[1, 2], [5, 1], [1, 3], [1, 4]]], expected: 1 },
  ],
};

function isEqual(actual: any, expected: any, challenge: string): boolean {
  if (expected === null || expected === undefined) return true;
  if (challenge === "two-sum") {
    if (!Array.isArray(actual) || actual.length !== 2) return false;
    const sortedActual = [...actual].sort((a, b) => a - b);
    const sortedExpected = [...expected].sort((a, b) => a - b);
    return (
      sortedActual[0] === sortedExpected[0] &&
      sortedActual[1] === sortedExpected[1]
    );
  }
  if (challenge === "intersection-arrays") {
    if (!Array.isArray(actual) || !Array.isArray(expected)) return false;
    const sortedActual = [...actual].sort((a, b) => a - b);
    const sortedExpected = [...expected].sort((a, b) => a - b);
    if (sortedActual.length !== sortedExpected.length) return false;
    return sortedActual.every((val, idx) => val === sortedExpected[idx]);
  }
  if (
    challenge === "reverse-list" ||
    challenge === "merge-sorted-array" ||
    challenge === "sort-colors" ||
    challenge === "top-k-frequent" ||
    challenge === "merge-two-lists" ||
    challenge === "middle-list" ||
    challenge === "remove-nth-node" ||
    challenge === "queue-using-stacks" ||
    challenge === "min-stack" ||
    challenge === "next-greater-element" ||
    challenge === "invert-tree"
  ) {
    if (!Array.isArray(actual) || !Array.isArray(expected)) return false;
    if (actual.length !== expected.length) return false;
    for (let i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }
    return true;
  }
  if (
    challenge === "find-max" ||
    challenge === "binary-search" ||
    challenge === "valid-parentheses" ||
    challenge === "remove-duplicates" ||
    challenge === "max-subarray" ||
    challenge === "kth-largest" ||
    challenge === "linked-list-cycle" ||
    challenge === "evaluate-rpn" ||
    challenge === "contains-duplicate" ||
    challenge === "find-center"
  ) {
    return actual === expected;
  }
  return false;
}

function safeStringify(val: any): string {
  try {
    return JSON.stringify(val);
  } catch (e) {
    return "Error: Circular or non-serializable structure";
  }
}

// ─── Challenge Visualizers ──────────────────────────────────────────────────

function ArrayVisualizer({
  values,
  activeIndex,
  successIndices,
}: {
  values: number[];
  activeIndex: number | null;
  successIndices?: number[];
}) {
  return (
    <div className="flex gap-2.5 justify-center py-4 px-4 bg-paper-dark/50 rounded-2xl border border-charcoal/5 shadow-inner my-1 overflow-x-auto w-full">
      {values.map((val, idx) => {
        const isActive = idx === activeIndex;
        const isSuccess = successIndices?.includes(idx);

        let bgClass = "bg-paper border-charcoal/10 text-charcoal font-black";
        if (isActive) {
          bgClass = "bg-gradient-to-br from-amber-400 to-amber-300 border-amber-500 text-charcoal font-black shadow-md scale-105";
        } else if (isSuccess) {
          bgClass = "bg-gradient-to-br from-emerald-600 to-emerald-400 border-emerald-700 text-paper font-black shadow-md scale-105";
        }

        return (
          <motion.div key={idx} layout className="flex flex-col items-center gap-1.5 min-w-[3rem]">
            <span className="font-mono text-[11px] text-charcoal/50 font-black">[{idx}]</span>
            <div
              className={`w-12 h-12 rounded-xl border flex items-center justify-center font-mono text-[14px] font-black transition-all duration-200 ${bgClass}`}
            >
              {val}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function LinkedListVisualizer({
  values,
  listPointers,
  activeNode,
  activeTarget,
}: {
  values: number[];
  listPointers: Map<number, number | null>;
  activeNode: number | null;
  activeTarget: number | null;
  activeType: "get" | "set" | null;
}) {
  const nodeRadius = 18;
  const positions = new Map<number, { x: number; y: number }>();
  values.forEach((val, idx) => {
    positions.set(val, { x: idx * 85 + 40, y: 55 });
  });

  const svgWidth = Math.max(380, values.length * 85 + 10);

  return (
    <div className="w-full overflow-x-auto py-2 flex justify-start sm:justify-center">
      <svg
        viewBox={`0 0 ${svgWidth} 140`}
        style={{ width: `${svgWidth}px`, height: "130px" }}
        className="bg-paper-dark/35 rounded-xl border border-charcoal/10 shadow-inner shrink-0"
      >
        <defs>
          <marker
            id="arrow-act"
            viewBox="0 0 10 10"
            refX="23"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#e05342" />
          </marker>
          <marker
            id="arrow-def"
            viewBox="0 0 10 10"
            refX="23"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(45,45,45,0.3)" />
          </marker>
        </defs>

        {/* Draw pointers */}
        {values.map((val) => {
          const nextVal = listPointers.get(val);
          if (nextVal === undefined || nextVal === null) {
            const from = positions.get(val);
            if (!from) return null;
            const isAct = val === activeNode && activeTarget === null;
            return (
              <g key={`null-${val}`}>
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={from.x}
                  y2={from.y + 35}
                  stroke={isAct ? "#e05342" : "rgba(45,45,45,0.25)"}
                  strokeWidth={isAct ? 2.5 : 1.5}
                  markerEnd={isAct ? "url(#arrow-act)" : "url(#arrow-def)"}
                />
                <text
                  x={from.x}
                  y={from.y + 48}
                  textAnchor="middle"
                  fontSize="9.5"
                  fontWeight="900"
                  fill={isAct ? "#e05342" : "rgba(45,45,45,0.5)"}
                >
                  null
                </text>
              </g>
            );
          }

          const from = positions.get(val);
          const to = positions.get(nextVal);
          if (!from || !to) return null;

          const isAct = val === activeNode && nextVal === activeTarget;
          const isBackward = to.x < from.x;

          return (
            <path
              key={`line-${val}-${nextVal}`}
              d={
                isBackward
                  ? `M ${from.x} ${from.y} C ${(from.x + to.x) / 2} ${from.y - 25}, ${(from.x + to.x) / 2} ${to.y - 25}, ${to.x} ${to.y}`
                  : `M ${from.x} ${from.y} L ${to.x} ${to.y}`
              }
              fill="none"
              stroke={isAct ? "#e05342" : "rgba(45,45,45,0.3)"}
              strokeWidth={isAct ? 2.8 : 1.5}
              markerEnd={isAct ? "url(#arrow-act)" : "url(#arrow-def)"}
            />
          );
        })}

        {/* Draw node circles */}
        {values.map((val) => {
          const pos = positions.get(val);
          if (!pos) return null;
          const isActive = val === activeNode;
          return (
            <g key={val}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={nodeRadius}
                fill={isActive ? "#e05342" : "#fdfbf7"}
                stroke={isActive ? "#b83b2c" : "rgba(45,45,45,0.2)"}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="11.5"
                fontWeight="900"
                fill={isActive ? "#fdfbf7" : "#2d2d2d"}
              >
                {val}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

interface BinarySearchVisualizerProps {
  values: number[];
  low: number;
  high: number;
  mid: number | null;
  foundIndex: number | null;
  target: number;
}

function BinarySearchVisualizer({
  values,
  low,
  high,
  mid,
  foundIndex,
  target,
}: BinarySearchVisualizerProps) {
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Target search label */}
      <div className="text-[13px] font-sans text-charcoal/70 bg-paper-dark border border-charcoal/5 px-4 py-1.5 rounded-full font-black uppercase tracking-wider">
        Searching for target: <span className="text-coral font-mono">{target}</span>
      </div>

      <div className="flex gap-2.5 justify-center py-4 px-4 bg-paper-dark/50 rounded-2xl border border-charcoal/5 shadow-inner w-full overflow-x-auto">
        {values.map((val, idx) => {
          const isMid = idx === mid;
          const isFound = idx === foundIndex;
          const inRange = idx >= low && idx <= high;

          let bgClass = "";
          let labelText = "";

          if (isFound) {
            bgClass = "bg-gradient-to-br from-emerald-600 to-emerald-400 border-emerald-700 text-paper shadow-md scale-105 font-black";
          } else if (isMid) {
            bgClass = "bg-gradient-to-br from-amber-400 to-amber-300 border-amber-500 text-charcoal shadow-md scale-105 font-black";
          } else if (inRange) {
            bgClass = "bg-paper border-charcoal/10 text-charcoal font-black";
          } else {
            bgClass = "bg-paper/35 border-charcoal/5 text-charcoal/30 opacity-40 font-light";
          }

          if (idx === low && idx === high) {
            labelText = "L, H";
          } else if (idx === low) {
            labelText = "low";
          } else if (idx === high) {
            labelText = "high";
          }

          return (
            <div key={idx} className="flex flex-col items-center gap-1.5 min-w-[3rem]">
              <span className="font-mono text-[11px] text-charcoal/50 font-black">[{idx}]</span>
              <div
                className={`w-12 h-12 rounded-xl border flex items-center justify-center font-mono text-[14px] font-black transition-all duration-200 ${bgClass}`}
              >
                {val}
              </div>
              <span className="h-4 font-mono text-[11px] font-black text-coral uppercase tracking-wide">
                {labelText}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface StackParenthesesVisualizerProps {
  inputString: string;
  charIndex: number | null;
  stackState: string[];
}

function StackParenthesesVisualizer({
  inputString,
  charIndex,
  stackState,
}: StackParenthesesVisualizerProps) {
  return (
    <div className="flex flex-col items-center gap-4 w-full py-1">
      {/* Input String Traversal */}
      <div className="flex flex-col items-center gap-1.5 w-full">
        <span className="text-[10px] font-sans text-charcoal/50 uppercase tracking-widest font-black">
          Input String
        </span>
        <div className="flex gap-1 bg-paper-dark border border-charcoal/5 p-1.5 rounded-lg shadow-inner overflow-x-auto max-w-full">
          {inputString.split("").map((char, idx) => {
            const isActive = idx === charIndex;
            return (
              <div
                key={idx}
                className={`w-8 h-8 rounded-md flex items-center justify-center font-mono text-[14px] font-black transition-all ${
                  isActive
                    ? "bg-coral text-paper scale-105 shadow-sm font-black"
                    : "bg-paper text-charcoal/60 font-black border border-charcoal/5"
                }`}
              >
                {char}
              </div>
            );
          })}
        </div>
      </div>

      {/* Physical Stack Representation */}
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-[10px] font-sans text-charcoal/50 uppercase tracking-widest font-black">
          Stack
        </span>
        <div className="relative w-28 h-36 border-b-4 border-x-4 border-charcoal/30 rounded-b-xl flex flex-col-reverse items-center justify-start gap-1 p-2 bg-paper-dark/30 shadow-inner">
          <AnimatePresence>
            {stackState.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-center p-2">
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-charcoal/35 italic select-none">Empty Stack</span>
              </div>
            ) : (
              stackState.map((char, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: -15, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                  className="w-20 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 border border-emerald-700 text-paper font-black rounded-lg flex items-center justify-center font-mono text-base shadow-[0_2px_6px_rgba(16,185,129,0.2)]"
                >
                  {char}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

interface DualStackVisualizerProps {
  stack1Name: string;
  stack2Name: string;
  stack1State: any[];
  stack2State: any[];
}

function DualStackVisualizer({
  stack1Name,
  stack2Name,
  stack1State,
  stack2State,
}: DualStackVisualizerProps) {
  return (
    <div className="flex gap-12 justify-center py-5 px-6 bg-paper-dark/30 border border-charcoal/5 rounded-2xl shadow-inner w-full min-h-[220px] my-1">
      {/* Stack 1 */}
      <div className="flex flex-col items-center gap-2 w-32">
        <span className="text-[10px] font-sans text-charcoal/55 uppercase tracking-widest font-black">
          {stack1Name}
        </span>
        <div className="relative w-full h-44 border-b-4 border-x-4 border-charcoal/30 rounded-b-xl flex flex-col-reverse items-center justify-start gap-1 p-2 bg-paper shadow-inner overflow-y-auto">
          <AnimatePresence>
            {stack1State.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-center p-2">
                <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-charcoal/35 italic select-none">Empty</span>
              </div>
            ) : (
              stack1State.map((val, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: -15, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                  className="w-full py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 border border-emerald-700 text-paper font-black rounded-lg flex items-center justify-center font-mono text-xs shadow-sm"
                >
                  {val}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Stack 2 */}
      <div className="flex flex-col items-center gap-2 w-32">
        <span className="text-[10px] font-sans text-charcoal/55 uppercase tracking-widest font-black">
          {stack2Name}
        </span>
        <div className="relative w-full h-44 border-b-4 border-x-4 border-charcoal/30 rounded-b-xl flex flex-col-reverse items-center justify-start gap-1 p-2 bg-paper shadow-inner overflow-y-auto">
          <AnimatePresence>
            {stack2State.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-center p-2">
                <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-charcoal/35 italic select-none">Empty</span>
              </div>
            ) : (
              stack2State.map((val, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: -15, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                  className="w-full py-1.5 bg-gradient-to-r from-coral/95 to-coral border border-coral-dark text-paper font-black rounded-lg flex items-center justify-center font-mono text-xs shadow-sm"
                >
                  {val}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

interface SingleStackVisualizerProps {
  stackState: any[];
  stackName?: string;
  inputArray?: any[];
  activeIndex?: number | null;
  inputLabel?: string;
}

function SingleStackVisualizer({
  stackState,
  stackName = "Stack",
  inputArray,
  activeIndex,
  inputLabel = "Input Tokens",
}: SingleStackVisualizerProps) {
  return (
    <div className="flex flex-col items-center gap-4 w-full py-1">
      {inputArray && (
        <div className="flex flex-col items-center gap-1.5 w-full">
          <span className="text-[10px] font-sans text-charcoal/50 uppercase tracking-widest font-black">
            {inputLabel}
          </span>
          <div className="flex gap-1 bg-paper-dark border border-charcoal/5 p-1.5 rounded-lg shadow-inner overflow-x-auto max-w-full">
            {inputArray.map((token, idx) => {
              const isActive = idx === activeIndex;
              return (
                <div
                  key={idx}
                  className={`px-3 h-8 rounded-md flex items-center justify-center font-mono text-[13px] font-black transition-all ${
                    isActive
                      ? "bg-coral text-paper scale-105 shadow-sm font-black"
                      : "bg-paper text-charcoal/60 font-black border border-charcoal/5"
                  }`}
                >
                  {token}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-1.5">
        <span className="text-[10px] font-sans text-charcoal/50 uppercase tracking-widest font-black">
          {stackName}
        </span>
        <div className="relative w-32 h-44 border-b-4 border-x-4 border-charcoal/30 rounded-b-xl flex flex-col-reverse items-center justify-start gap-1 p-2 bg-paper shadow-inner overflow-y-auto">
          <AnimatePresence>
            {stackState.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-center p-2">
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-charcoal/35 italic select-none">Empty Stack</span>
              </div>
            ) : (
              stackState.map((val, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: -15, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                  className="w-24 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 border border-emerald-700 text-paper font-black rounded-lg flex items-center justify-center font-mono text-xs shadow-[0_2px_6px_rgba(16,185,129,0.15)]"
                >
                  {val}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── Playback Visualizer Panel ──────────────────────────────────────────────

interface CodeVisualizerProps {
  challenge: string;
  testResult: TestResult | undefined;
  userCode: string;
}

function CodeVisualizer({ challenge, testResult, userCode }: CodeVisualizerProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(600);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const codeViewerRef = useRef<HTMLDivElement | null>(null);
  const traceListRef = useRef<HTMLDivElement | null>(null);

  const rawSteps = testResult?.steps || [];
  const steps = useMemo(
    () => buildDisplaySteps(challenge, rawSteps),
    [challenge, rawSteps],
  );
  const totalSteps = steps.length;

  // Reset steps on test result change
  useEffect(() => {
    setStepIndex(0);
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [testResult]);

  const handleStepForward = useCallback(() => {
    setStepIndex((prev) => (prev < totalSteps ? prev + 1 : prev));
  }, [totalSteps]);

  const handleStepBackward = useCallback(() => {
    setStepIndex((prev) => (prev > 0 ? prev - 1 : 0));
  }, []);

  const handlePlayToggle = useCallback(() => {
    setIsPlaying((prev) => {
      const nextPlaying = !prev;
      if (nextPlaying) {
        setStepIndex((curr) => (curr >= totalSteps ? 0 : curr));
      }
      return nextPlaying;
    });
  }, [totalSteps]);

  // Validation to verify if testResult corresponds to current challenge
  const isValidResultForChallenge = useMemo(() => {
    if (!testResult) return false;
    const isArrayAndNumber = [
      "two-sum", "binary-search", "kth-largest", "top-k-frequent", "remove-nth-node"
    ].includes(challenge);
    if (isArrayAndNumber) {
      return Array.isArray(testResult.input[0]) && typeof testResult.input[1] === "number";
    }

    const isSingleArray = [
      "find-max", "reverse-list", "remove-duplicates", "max-subarray", 
      "sort-colors", "linked-list-cycle", "middle-list", "evaluate-rpn"
    ].includes(challenge);
    if (isSingleArray) {
      return Array.isArray(testResult.input[0]);
    }

    if (challenge === "merge-sorted-array") {
      return Array.isArray(testResult.input[0]) && typeof testResult.input[1] === "number" && Array.isArray(testResult.input[2]) && typeof testResult.input[3] === "number";
    }

    if (
      challenge === "intersection-arrays" ||
      challenge === "merge-two-lists" ||
      challenge === "queue-using-stacks" ||
      challenge === "min-stack" ||
      challenge === "next-greater-element"
    ) {
      return Array.isArray(testResult.input[0]) && Array.isArray(testResult.input[1]);
    }

    if (challenge === "valid-parentheses") {
      return typeof testResult.input[0] === "string";
    }
    return false;
  }, [challenge, testResult]);

  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setStepIndex((prev) => {
          if (prev < totalSteps) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, speedMs);
      timerRef.current = timer;
      return () => {
        clearInterval(timer);
      };
    }
  }, [isPlaying, totalSteps, speedMs]);

  // Keyboard shortcut listener for scrubbing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if targeting input or editor
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        document.activeElement?.closest("#code-editor")
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        handlePlayToggle();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        handleStepBackward();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        handleStepForward();
      } else if (e.code === "KeyR") {
        e.preventDefault();
        setStepIndex(0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePlayToggle, handleStepBackward, handleStepForward]);

  // Extract lines of code for Code Viewer
  const codeLines = useMemo(() => {
    if (!userCode) return [];
    return userCode.split("\n");
  }, [userCode]);

  // Active step values
  const currentStep = steps[stepIndex] || steps[steps.length - 1] || null;
  const activeLine = currentStep ? currentStep.line : null;
  const isFinalStep = stepIndex === totalSteps;
  const stepMeta = getStepMeta(currentStep?.type);
  const operationLabel = currentStep
    ? stepMeta.label
    : isFinalStep
      ? "Complete"
      : "Idle";
  const activeLineLabel = activeLine ?? "None";
  const sandboxLegend = SANDBOX_LEGENDS[challenge] ?? [];

  // Auto-scroll active code line into view
  useEffect(() => {
    if (activeLine && codeViewerRef.current) {
      const activeEl = codeViewerRef.current.querySelector(`[data-line="${activeLine}"]`);
      if (activeEl) {
        codeViewerRef.current.scrollTop = activeEl.offsetTop - codeViewerRef.current.offsetTop - (codeViewerRef.current.clientHeight / 2);
      }
    }
  }, [activeLine]);

  // Auto-scroll active trace list item into view
  useEffect(() => {
    if (traceListRef.current) {
      const activeEl = traceListRef.current.children[stepIndex] as HTMLElement;
      if (activeEl && typeof activeEl.offsetTop === "number") {
        traceListRef.current.scrollTo({
          top: activeEl.offsetTop - traceListRef.current.offsetTop - 10,
          behavior: "smooth",
        });
      }
    }
  }, [stepIndex]);

  if (!testResult || !isValidResultForChallenge) {
    return (
      <div
        data-testid="execution-visualizer-panel"
        className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-paper border border-charcoal/10 rounded-3xl h-full shadow-sm min-h-[350px]"
      >
        <div className="text-charcoal/60 italic text-base">
          Run code to visualize execution timeline, sandbox state, and trace flow.
        </div>
      </div>
    );
  }

  // Compute visual components
  let visualizerNode: JSX.Element | null = null;
  let statusText = "Ready to start.";

  if (challenge === "two-sum") {
    const nums = testResult.input[0] || [];
    let activeIdx: number | null = null;
    let successIndices: number[] = [];

    if (currentStep && currentStep.type === "access") {
      activeIdx = currentStep.index;
      statusText = `nums[${activeIdx}] read: ${currentStep.value}`;
    }

    if (isFinalStep && testResult.passed) {
      successIndices = testResult.actual;
      statusText = `Solution found! Indices: [${successIndices.join(", ")}]`;
    } else if (isFinalStep) {
      statusText = "Execution finished — target not found.";
    }

    visualizerNode = (
      <ArrayVisualizer
        values={nums}
        activeIndex={activeIdx}
        successIndices={successIndices}
      />
    );
  } else if (challenge === "find-max") {
    const arr = testResult.input[0] || [];
    let activeIdx: number | null = null;
    let maxIdx: number[] = [];

    if (currentStep && currentStep.type === "access") {
      activeIdx = currentStep.index;
      const runningMax = Math.max(
        ...steps.slice(0, stepIndex + 1).map((s) => s.value)
      );
      statusText = `Read arr[${activeIdx}] = ${currentStep.value}. Max so far: ${runningMax}`;
    }

    if (isFinalStep && testResult.passed) {
      const maxVal = testResult.actual;
      const maxPos = arr.indexOf(maxVal);
      if (maxPos !== -1) maxIdx = [maxPos];
      statusText = `Traversal complete. Max value: ${maxVal}`;
    } else if (isFinalStep) {
      statusText = "Execution complete.";
    }

    visualizerNode = (
      <ArrayVisualizer
        values={arr}
        activeIndex={activeIdx}
        successIndices={maxIdx}
      />
    );
  } else if (challenge === "reverse-list") {
    const initialValues = testResult.input[0] || [];
    const listPointers = new Map<number, number | null>();

    // Initial setup
    initialValues.forEach((val: number, idx: number) => {
      listPointers.set(
        val,
        idx < initialValues.length - 1 ? initialValues[idx + 1] : null
      );
    });

    let activeNode: number | null = null;
    let activeTarget: number | null = null;
    let activeType: "get" | "set" | null = null;

    // Apply steps up to stepIndex
    steps.slice(0, stepIndex).forEach((step) => {
      if (step.type === "set_next") {
        listPointers.set(step.node, step.nextNode);
      }
    });

    if (currentStep) {
      if (currentStep.type === "set_next") {
        listPointers.set(currentStep.node, currentStep.nextNode);
        activeNode = currentStep.node;
        activeTarget = currentStep.nextNode;
        activeType = "set";
        statusText = `Set: node ${activeNode}.next → ${activeTarget !== null ? activeTarget : "null"}`;
      } else if (currentStep.type === "get_next") {
        activeNode = currentStep.node;
        activeTarget = currentStep.nextNode;
        activeType = "get";
        statusText = `Read: node ${activeNode}.next points to ${activeTarget !== null ? activeTarget : "null"}`;
      }
    }

    if (isFinalStep) {
      statusText = "Execution complete. Linked list reversed.";
    }

    visualizerNode = (
      <LinkedListVisualizer
        values={initialValues}
        listPointers={listPointers}
        activeNode={activeNode}
        activeTarget={activeTarget}
        activeType={activeType}
      />
    );
  } else if (challenge === "binary-search") {
    const arr = testResult.input[0] || [];
    const target = testResult.input[1];
    let low = 0;
    let high = arr.length - 1;
    let mid: number | null = null;
    let foundIndex: number | null = null;
    const currentSourceIndex =
      typeof currentStep?.sourceIndex === "number"
        ? currentStep.sourceIndex
        : Math.min(stepIndex, rawSteps.length - 1);

    const applyBinaryAccess = (step: any) => {
      if (step.type === "access") {
        const val = step.value;
        const m = step.index;
        if (val === target) {
          foundIndex = m;
        } else if (val < target) {
          low = m + 1;
        } else {
          high = m - 1;
        }
      }
    };

    rawSteps.slice(0, Math.max(0, currentSourceIndex)).forEach(applyBinaryAccess);

    if (
      currentStep &&
      (currentStep.type === "binary_window" ||
        currentStep.type === "access" ||
        currentStep.type === "binary_decision")
    ) {
      mid = currentStep.index;
      const val = currentStep.value;

      if (currentStep.type === "binary_window") {
        statusText = `Choose midpoint index ${mid} inside [${low}, ${high}].`;
      } else if (currentStep.type === "access") {
        statusText = `Read arr[${mid}] = ${val}; compare with target ${target}.`;
      } else {
        if (val === target) {
          statusText = `Target matched. Return index ${mid}.`;
        } else if (val < target) {
          statusText = `${val} is too small; move low to ${mid + 1}.`;
        } else {
          statusText = `${val} is too large; move high to ${mid - 1}.`;
        }
        applyBinaryAccess(currentStep);
      }
    }

    if (isFinalStep) {
      if (testResult.passed && typeof testResult.actual === "number" && testResult.actual !== -1) {
        foundIndex = testResult.actual;
        mid = foundIndex;
      }
      statusText =
        testResult.actual !== -1
          ? `Traversal complete. Target found at index ${testResult.actual}!`
          : `Traversal complete. Target not found.`;
    }

    visualizerNode = (
      <BinarySearchVisualizer
        values={arr}
        low={low}
        high={high}
        mid={mid}
        foundIndex={foundIndex}
        target={target}
      />
    );
  } else if (challenge === "valid-parentheses") {
    const inputString = testResult.input[0] || "";
    let charIndex: number | null = null;
    let stackState: string[] = [];

    steps.slice(0, stepIndex).forEach((step) => {
      if (step.type === "string_access") {
        charIndex = step.index;
      } else if (step.type === "stack_push" || step.type === "stack_pop") {
        stackState = step.stackState;
      }
    });

    if (currentStep) {
      if (currentStep.type === "string_access") {
        charIndex = currentStep.index;
        statusText = `Read character '${currentStep.value}' at index ${currentStep.index}`;
      } else if (currentStep.type === "stack_push") {
        stackState = currentStep.stackState;
        statusText = `Pushed '${currentStep.value}' onto stack`;
      } else if (currentStep.type === "stack_pop") {
        stackState = currentStep.stackState;
        statusText = `Popped '${currentStep.value}' from stack to match`;
      }
    }

    if (isFinalStep) {
      statusText = testResult.passed
        ? "Execution complete. Valid parentheses structure!"
        : "Execution complete. Invalid parentheses structure.";
    }

    visualizerNode = (
      <StackParenthesesVisualizer
        inputString={inputString}
        charIndex={charIndex}
        stackState={stackState}
      />
    );
  } else if (challenge === "queue-using-stacks") {
    let stack1State: any[] = [];
    let stack2State: any[] = [];

    steps.slice(0, stepIndex).forEach((step) => {
      if (step.type === "stack_push" || step.type === "stack_pop") {
        if (step.arrayId === 1) stack1State = step.stackState;
        if (step.arrayId === 2) stack2State = step.stackState;
      }
    });

    if (currentStep && (currentStep.type === "stack_push" || currentStep.type === "stack_pop")) {
      if (currentStep.arrayId === 1) {
        stack1State = currentStep.stackState;
        statusText = currentStep.type === "stack_push"
          ? `Pushed '${currentStep.value}' to Stack 1 (Input Stack)`
          : `Popped '${currentStep.value}' from Stack 1 (Input Stack)`;
      } else if (currentStep.arrayId === 2) {
        stack2State = currentStep.stackState;
        statusText = currentStep.type === "stack_push"
          ? `Pushed '${currentStep.value}' to Stack 2 (Output Stack)`
          : `Popped '${currentStep.value}' from Stack 2 (Output Stack)`;
      }
    }

    if (isFinalStep) {
      statusText = `Execution complete. Result: ${safeStringify(testResult.actual)}`;
    }

    visualizerNode = (
      <DualStackVisualizer
        stack1Name="Stack 1 (Push)"
        stack2Name="Stack 2 (Pop)"
        stack1State={stack1State}
        stack2State={stack2State}
      />
    );
  } else if (challenge === "min-stack") {
    let stackState: any[] = [];
    let minStackState: any[] = [];

    steps.slice(0, stepIndex).forEach((step) => {
      if (step.type === "stack_push" || step.type === "stack_pop") {
        if (step.arrayId === 1) stackState = step.stackState;
        if (step.arrayId === 2) minStackState = step.stackState;
      }
    });

    if (currentStep && (currentStep.type === "stack_push" || currentStep.type === "stack_pop")) {
      if (currentStep.arrayId === 1) {
        stackState = currentStep.stackState;
        statusText = currentStep.type === "stack_push"
          ? `Pushed '${currentStep.value}' to Main Stack`
          : `Popped '${currentStep.value}' from Main Stack`;
      } else if (currentStep.arrayId === 2) {
        minStackState = currentStep.stackState;
        statusText = currentStep.type === "stack_push"
          ? `Pushed '${currentStep.value}' to Min Stack`
          : `Popped '${currentStep.value}' from Min Stack`;
      }
    }

    if (isFinalStep) {
      statusText = `Execution complete. Result: ${safeStringify(testResult.actual)}`;
    }

    visualizerNode = (
      <DualStackVisualizer
        stack1Name="Main Stack"
        stack2Name="Min Stack"
        stack1State={stackState}
        stack2State={minStackState}
      />
    );
  } else if (challenge === "evaluate-rpn") {
    const tokens = testResult.input[0] || [];
    let stackState: any[] = [];
    let activeTokenIndex: number | null = null;

    steps.slice(0, stepIndex).forEach((step) => {
      if (step.type === "access") {
        activeTokenIndex = step.index;
      } else if (step.type === "stack_push" || step.type === "stack_pop") {
        stackState = step.stackState;
      }
    });

    if (currentStep) {
      if (currentStep.type === "access") {
        activeTokenIndex = currentStep.index;
        statusText = `Read token '${currentStep.value}' at index ${currentStep.index}`;
      } else if (currentStep.type === "stack_push") {
        stackState = currentStep.stackState;
        statusText = `Pushed '${currentStep.value}' onto evaluation stack`;
      } else if (currentStep.type === "stack_pop") {
        stackState = currentStep.stackState;
        statusText = `Popped '${currentStep.value}' from stack for computation`;
      }
    }

    if (isFinalStep) {
      statusText = `Evaluation complete. Final result: ${testResult.actual}`;
    }

    visualizerNode = (
      <SingleStackVisualizer
        stackState={stackState}
        stackName="Evaluation Stack"
        inputArray={tokens}
        activeIndex={activeTokenIndex}
        inputLabel="RPN Tokens"
      />
    );
  } else if (challenge === "next-greater-element") {
    const nums1 = testResult.input[0] || [];
    const nums2 = testResult.input[1] || [];
    let stackState: any[] = [];
    let activeElementIndex: number | null = null;

    steps.slice(0, stepIndex).forEach((step) => {
      if (step.type === "access") {
        activeElementIndex = step.index;
      } else if (step.type === "stack_push" || step.type === "stack_pop") {
        stackState = step.stackState;
      }
    });

    if (currentStep) {
      if (currentStep.type === "access") {
        activeElementIndex = currentStep.index;
        statusText = `Read element '${currentStep.value}' at index ${currentStep.index} from nums2`;
      } else if (currentStep.type === "stack_push") {
        stackState = currentStep.stackState;
        statusText = `Pushed element index or value '${currentStep.value}' onto stack`;
      } else if (currentStep.type === "stack_pop") {
        stackState = currentStep.stackState;
        statusText = `Popped element '${currentStep.value}' from stack`;
      }
    }

    if (isFinalStep) {
      statusText = `Execution complete. Output NGE: ${safeStringify(testResult.actual)}`;
    }

    visualizerNode = (
      <SingleStackVisualizer
        stackState={stackState}
        stackName="Monotonic Stack"
        inputArray={nums2}
        activeIndex={activeElementIndex}
        inputLabel="nums2 (Traversal Array)"
      />
    );
  } else {
    // Check if linked list challenge
    const isLinkedListChallenge = [
      "reverse-list", "merge-two-lists", "linked-list-cycle", "middle-list", "remove-nth-node"
    ].includes(challenge);

    if (isLinkedListChallenge) {
      const isTwoLists = challenge === "merge-two-lists";
      const initialValues = isTwoLists
        ? [...(testResult.input[0] || []), ...(testResult.input[1] || [])]
        : (testResult.input[0] || []);

      const listPointers = new Map<number, number | null>();

      if (isTwoLists) {
        const list1 = testResult.input[0] || [];
        const list2 = testResult.input[1] || [];
        list1.forEach((val: number, idx: number) => {
          listPointers.set(val, idx < list1.length - 1 ? list1[idx + 1] : null);
        });
        list2.forEach((val: number, idx: number) => {
          listPointers.set(val, idx < list2.length - 1 ? list2[idx + 1] : null);
        });
      } else {
        initialValues.forEach((val: number, idx: number) => {
          listPointers.set(
            val,
            idx < initialValues.length - 1 ? initialValues[idx + 1] : null
          );
        });
      }

      let activeNode: number | null = null;
      let activeTarget: number | null = null;
      let activeType: "get" | "set" | null = null;

      steps.slice(0, stepIndex).forEach((step) => {
        if (step.type === "set_next") {
          listPointers.set(step.node, step.nextNode);
        }
      });

      if (currentStep) {
        if (currentStep.type === "set_next") {
          listPointers.set(currentStep.node, currentStep.nextNode);
          activeNode = currentStep.node;
          activeTarget = currentStep.nextNode;
          activeType = "set";
          statusText = `Set: node ${activeNode}.next → ${activeTarget !== null ? activeTarget : "null"}`;
        } else if (currentStep.type === "get_next") {
          activeNode = currentStep.node;
          activeTarget = currentStep.nextNode;
          activeType = "get";
          statusText = `Read: node ${activeNode}.next points to ${activeTarget !== null ? activeTarget : "null"}`;
        }
      }

      if (isFinalStep) {
        statusText = `Execution complete. Output: ${safeStringify(testResult.actual)}`;
      }

      visualizerNode = (
        <LinkedListVisualizer
          values={initialValues}
          listPointers={listPointers}
          activeNode={activeNode}
          activeTarget={activeTarget}
          activeType={activeType}
        />
      );
    } else {
      // Array challenge
      const arr = testResult.input[0] || [];
      let activeIdx: number | null = null;

      if (currentStep && currentStep.type === "access") {
        activeIdx = currentStep.index;
        statusText = `Read index ${activeIdx}: ${currentStep.value}`;
      }

      if (isFinalStep) {
        statusText = `Execution complete. Output: ${safeStringify(testResult.actual)}`;
      }

      visualizerNode = (
        <ArrayVisualizer
          values={arr}
          activeIndex={activeIdx}
        />
      );
    }
  }

  return (
    <section
      data-testid="execution-visualizer-panel"
      aria-label="Execution visualizer"
      className="flex-1 flex flex-col justify-between gap-3 bg-paper border border-charcoal/10 rounded-2xl p-5 shadow-sm h-full w-full overflow-hidden"
    >
      {/* Top Header & KPIs */}
      <div className="flex shrink-0 flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-editorial text-2xl font-extrabold text-charcoal leading-tight">
              Execution Visualizer
            </h3>
          </div>
          <span
            className={`mr-10 inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1 text-xs font-sans font-extrabold uppercase tracking-wider sm:mr-0 ${
              testResult.passed
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                testResult.passed ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
            {testResult.passed ? "Passed" : "Failed"}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Step KPI */}
          <div
            data-testid="execution-kpi-step"
            className="rounded-xl border border-charcoal/10 bg-paper-dark/55 px-2.5 py-1.5 shadow-inner"
          >
            <span className="block text-[10px] font-sans font-black uppercase tracking-widest text-charcoal/45">
              Step
            </span>
            <span className="mt-0.5 block font-mono text-[13px] font-black text-charcoal tabular-nums">
              {stepIndex} / {totalSteps}
            </span>
          </div>
          {/* Line KPI */}
          <div
            data-testid="execution-kpi-line"
            className="rounded-xl border border-charcoal/10 bg-paper-dark/55 px-2.5 py-1.5 shadow-inner"
          >
            <span className="block text-[10px] font-sans font-black uppercase tracking-widest text-charcoal/45">
              Line
            </span>
            <span className="mt-0.5 block font-mono text-[13px] font-black text-charcoal tabular-nums">
              {activeLineLabel}
            </span>
          </div>
          {/* Operation KPI */}
          <div
            data-testid="execution-kpi-operation"
            className="rounded-xl border border-charcoal/10 bg-paper-dark/55 px-2.5 py-1.5 shadow-inner"
          >
            <span className="block text-[10px] font-sans font-black uppercase tracking-widest text-charcoal/45">
              Operation
            </span>
            <span className="mt-0.5 flex items-center gap-1 font-mono text-[12px] font-black text-charcoal truncate">
              <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${stepMeta.dotClass}`} />
              {operationLabel}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Executing Code Viewer Panel */}
      <div className="border border-charcoal/10 rounded-xl bg-paper-dark/20 overflow-hidden flex flex-col h-[170px] shrink-0 shadow-inner">
        <div className="bg-paper-light border-b border-charcoal/5 px-3 py-1 flex items-center justify-between gap-3">
          <span className="text-[12px] font-sans font-extrabold text-charcoal/50 uppercase tracking-wider">
            Executing Code
          </span>
          {activeLine !== null && (
            <span className="text-[11px] font-mono text-coral font-black uppercase tracking-wider">
              Line {activeLine}
            </span>
          )}
        </div>
        <div
          ref={codeViewerRef}
          className="p-3 overflow-y-auto space-y-0.5 flex-1 font-mono text-[13px] leading-relaxed select-none"
        >
          {codeLines.map((line, idx) => {
            const lineNum = idx + 1;
            const isActive = lineNum === activeLine;
            return (
              <div
                key={lineNum}
                data-line={lineNum}
                className={`flex items-start -mx-3 px-3 py-0.5 transition-all duration-150 ${
                  isActive
                    ? "bg-coral/10 border-l-2 border-coral text-charcoal font-bold"
                    : "text-charcoal/60 hover:text-charcoal/80"
                }`}
              >
                <span className="w-6 shrink-0 text-right pr-2 text-charcoal/30 select-none font-mono text-[11px]">
                  {lineNum}
                </span>
                <span className="whitespace-pre font-mono">{line}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Visual Sandbox Panel */}
      <div
        data-testid="visual-sandbox-panel"
        aria-label="Visual sandbox"
        className="border border-charcoal/10 rounded-xl bg-paper p-3 shadow-sm flex flex-col flex-1 min-h-[180px] overflow-hidden"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2 shrink-0">
          <span className="text-[12px] font-sans font-extrabold text-charcoal/55 uppercase tracking-wider">
            Visual Sandbox
          </span>
          {sandboxLegend.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              {sandboxLegend.map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-1 rounded-full border border-charcoal/10 bg-paper-dark/50 px-1.5 py-0.5 text-[8px] font-sans font-bold uppercase tracking-wider text-charcoal/65"
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${item.dotClass}`} />
                  {item.label}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col items-center justify-start pt-2 min-h-0 overflow-y-auto w-full">
          {visualizerNode}
        </div>
      </div>

      {/* 4. Trace Log list */}
      {totalSteps > 0 && (
        <div
          data-testid="execution-flow-trace"
          aria-label="Execution flow trace"
          className="border border-charcoal/10 rounded-xl bg-paper-dark/30 overflow-hidden flex flex-col h-[110px] shrink-0 shadow-inner"
        >
          <div className="bg-paper-light border-b border-charcoal/5 px-3 py-1 flex items-center justify-between gap-3">
            <span className="text-[11px] font-sans font-black uppercase tracking-wider text-charcoal/55">
              Trace Log
            </span>
            <span className="text-[10px] font-mono font-extrabold text-charcoal/55">
              {totalSteps} steps
            </span>
          </div>
          <div ref={traceListRef} className="p-1.5 overflow-y-auto space-y-1 flex-1">
            {steps.map((step: any, idx: number) => {
              const isActive = idx === stepIndex;
              const itemMeta = getStepMeta(step.type);
              let description = "";

              if (step.type === "access") {
                if (challenge === "evaluate-rpn") {
                  description = `Read token '${step.value}' at index ${step.index}`;
                } else if (challenge === "next-greater-element") {
                  description = `Read element '${step.value}' at index ${step.index}`;
                } else {
                  description = `Read index ${step.index} (value: ${step.value})`;
                }
              } else if (step.type === "binary_window") {
                description = `Choose mid index ${step.index}`;
              } else if (step.type === "binary_decision") {
                const target = testResult.input[1];
                description =
                  step.value === target
                    ? `Return index ${step.index}`
                    : step.value < target
                      ? `Low → ${step.index + 1}`
                      : `High → ${step.index - 1}`;
              } else if (step.type === "get_next") {
                description = `Read node ${step.node}.next → ${step.nextNode ?? "null"}`;
              } else if (step.type === "set_next") {
                description = `Set node ${step.node}.next → ${step.nextNode ?? "null"}`;
              } else if (step.type === "string_access") {
                description = `Read char '${step.value}' at index ${step.index}`;
              } else if (step.type === "stack_push") {
                description = `Push '${step.value}'`;
              } else if (step.type === "stack_pop") {
                description = `Pop '${step.value}'`;
              }

              const lineLabel = step.line ? ` (L${step.line})` : "";

              return (
                <button
                  key={idx}
                  data-testid="execution-flow-item"
                  onClick={() => setStepIndex(idx)}
                  aria-label={`Jump to step ${idx + 1}`}
                  className={`w-full min-h-8 text-left font-mono text-[12.5px] px-3 py-1.5 rounded-lg border transition-all flex items-center justify-between gap-2 focus:outline-none focus-visible:ring-1 focus-visible:ring-coral/50 ${
                    isActive
                      ? "bg-coral text-paper border-coral shadow-sm font-black"
                      : "bg-paper/55 hover:bg-paper text-charcoal border-charcoal/10 font-bold"
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-1.5">
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                        isActive ? "bg-paper" : itemMeta.dotClass
                      }`}
                    />
                    <span className="truncate">
                      {idx + 1}. {description}{lineLabel}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Playback Controls & Scrubber */}
      <div className="flex shrink-0 flex-col gap-2 bg-paper-dark/30 border border-charcoal/10 rounded-xl p-2.5">
        {/* Step details message */}
        <div className="flex items-center gap-2 font-mono text-[11px] leading-snug text-charcoal truncate">
          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${stepMeta.dotClass}`} />
          <span className="truncate">{statusText}</span>
        </div>

        {/* Playback Controls & Scrubber */}
        {totalSteps > 0 && (
          <div className="flex flex-col gap-1.5 pt-1.5 border-t border-charcoal/5">
            <div className="flex items-center gap-2">
              <input
                type="range"
                aria-label="Execution timeline scrubber"
                min={0}
                max={totalSteps}
                value={stepIndex}
                onChange={(e) => setStepIndex(Number(e.target.value))}
                className="flex-1 accent-coral h-1 bg-charcoal/10 rounded-lg cursor-pointer transition-all hover:bg-charcoal/15"
              />
              <span className="text-[10px] font-mono text-charcoal/50 min-w-[40px] text-right font-bold">
                {stepIndex} / {totalSteps}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 mt-0.5">
              <div className="flex items-center gap-1">
                <button
                  id="btn-reset"
                  type="button"
                  onClick={() => setStepIndex(0)}
                  disabled={stepIndex === 0}
                  className="h-7 w-7 rounded-lg border border-charcoal/15 bg-paper hover:bg-charcoal/5 disabled:opacity-30 disabled:pointer-events-none text-charcoal shadow-sm flex items-center justify-center"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={handleStepBackward}
                  disabled={stepIndex === 0}
                  className="h-7 w-7 rounded-lg border border-charcoal/15 bg-paper hover:bg-charcoal/5 disabled:opacity-30 disabled:pointer-events-none text-charcoal shadow-sm flex items-center justify-center"
                >
                  <SkipBack className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={handlePlayToggle}
                  className="h-7 px-2.5 rounded-lg bg-coral text-paper font-sans text-[9px] font-bold uppercase tracking-wider hover:bg-coral-dark shadow-sm flex items-center gap-1"
                >
                  {isPlaying ? <Pause className="w-2.5 h-2.5 fill-current" /> : <Play className="w-2.5 h-2.5 fill-current" />}
                  <span>{isPlaying ? "Pause" : "Play"}</span>
                </button>
                <button
                  id="btn-step-forward"
                  type="button"
                  onClick={handleStepForward}
                  disabled={stepIndex === totalSteps}
                  className="h-7 w-7 rounded-lg border border-charcoal/15 bg-paper hover:bg-charcoal/5 disabled:opacity-30 disabled:pointer-events-none text-charcoal shadow-sm flex items-center justify-center"
                >
                  <SkipForward className="w-3 h-3" />
                </button>
              </div>

              {/* Speed controls */}
              <div className="flex items-center gap-1.5 border border-charcoal/10 rounded-lg bg-paper px-2 py-0.5 shadow-sm">
                <span className="text-[8px] font-sans text-charcoal/45 uppercase tracking-wider font-bold">Speed:</span>
                <input
                  type="range"
                  aria-label="Execution speed"
                  min={100}
                  max={1500}
                  step={100}
                  value={1600 - speedMs}
                  onChange={(e) => setSpeedMs(1600 - Number(e.target.value))}
                  className="w-10 accent-coral h-1 bg-charcoal/10 rounded-lg cursor-pointer"
                />
                <span className="text-[8px] font-mono font-bold text-charcoal/70 min-w-[20px] text-right">
                  {Math.round((600 / speedMs) * 10) / 10}x
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

interface PracticeSectionProps {
  activeLesson: string | null;
}

type TabId =
  | "two-sum"
  | "reverse-list"
  | "find-max"
  | "binary-search"
  | "valid-parentheses"
  | "queue-using-stacks"
  | "min-stack"
  | "evaluate-rpn"
  | "next-greater-element"
  | "remove-duplicates"
  | "merge-sorted-array"
  | "max-subarray"
  | "sort-colors"
  | "kth-largest"
  | "top-k-frequent"
  | "intersection-arrays"
  | "merge-two-lists"
  | "linked-list-cycle"
  | "middle-list"
  | "remove-nth-node";

const LESSON_TO_TAB: Record<string, TabId> = {
  "Challenge: Two Sum": "two-sum",
  "Challenge: Max Value in Array": "find-max",
  "Challenge: Reverse Linked List": "reverse-list",
  "Challenge: Binary Search": "binary-search",
  "Challenge: Valid Parentheses": "valid-parentheses",
  "Challenge: Implement Queue using Stacks": "queue-using-stacks",
  "Challenge: Min Stack": "min-stack",
  "Challenge: Evaluate Reverse Polish Notation": "evaluate-rpn",
  "Challenge: Next Greater Element I": "next-greater-element",
  "Challenge: Remove Duplicates": "remove-duplicates",
  "Challenge: Merge Sorted Array": "merge-sorted-array",
  "Challenge: Maximum Subarray": "max-subarray",
  "Challenge: Sort Colors": "sort-colors",
  "Challenge: Kth Largest Element": "kth-largest",
  "Challenge: Top K Frequent Elements": "top-k-frequent",
  "Challenge: Intersection of Two Arrays": "intersection-arrays",
  "Challenge: Merge Two Sorted Lists": "merge-two-lists",
  "Challenge: Linked List Cycle": "linked-list-cycle",
  "Challenge: Middle of the Linked List": "middle-list",
  "Challenge: Remove Nth Node From End": "remove-nth-node",
};

const ALL_CHALLENGES: Array<{ value: TabId; label: string }> = [
  // Chapter 1 (Arrays)
  { value: "two-sum", label: "Two Sum" },
  { value: "binary-search", label: "Binary Search" },
  { value: "remove-duplicates", label: "Remove Duplicates" },
  { value: "merge-sorted-array", label: "Merge Sorted Array" },
  { value: "max-subarray", label: "Maximum Subarray" },
  // Chapter 2 (Sorting)
  { value: "find-max", label: "Max Value in Array" },
  { value: "sort-colors", label: "Sort Colors" },
  { value: "kth-largest", label: "Kth Largest Element" },
  { value: "top-k-frequent", label: "Top K Frequent Elements" },
  { value: "intersection-arrays", label: "Intersection of Two Arrays" },
  // Chapter 3 (Linked Lists)
  { value: "reverse-list", label: "Reverse Linked List" },
  { value: "merge-two-lists", label: "Merge Two Sorted Lists" },
  { value: "linked-list-cycle", label: "Linked List Cycle" },
  { value: "middle-list", label: "Middle of the Linked List" },
  { value: "remove-nth-node", label: "Remove Nth Node From End" },
  // Chapter 4 (Stacks & Queues)
  { value: "valid-parentheses", label: "Valid Parentheses" },
  { value: "queue-using-stacks", label: "Implement Queue using Stacks" },
  { value: "min-stack", label: "Min Stack" },
  { value: "evaluate-rpn", label: "Evaluate Reverse Polish Notation" },
  { value: "next-greater-element", label: "Next Greater Element I" },
];

const CHALLENGE_CHAPTERS: Record<TabId, string> = {
  "two-sum": "arrays",
  "binary-search": "arrays",
  "remove-duplicates": "arrays",
  "merge-sorted-array": "arrays",
  "max-subarray": "arrays",
  "find-max": "sorting",
  "sort-colors": "sorting",
  "kth-largest": "sorting",
  "top-k-frequent": "sorting",
  "intersection-arrays": "sorting",
  "reverse-list": "linked-lists",
  "merge-two-lists": "linked-lists",
  "linked-list-cycle": "linked-lists",
  "middle-list": "linked-lists",
  "remove-nth-node": "linked-lists",
  "valid-parentheses": "stack-queue",
  "queue-using-stacks": "stack-queue",
  "min-stack": "stack-queue",
  "evaluate-rpn": "stack-queue",
  "next-greater-element": "stack-queue",
};

export function PracticeSection({ activeLesson }: PracticeSectionProps) {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [selectedTab, setSelectedTab] = useState<TabId>("two-sum");
  const [code, setCode] = useState(BOILERPLATES["two-sum"]);
  const [lastSubmittedCode, setLastSubmittedCode] = useState(BOILERPLATES["two-sum"]);
  const [summary, setSummary] = useState("");
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [activeTC, setActiveTC] = useState(0);
  const [consoleTab, setConsoleTab] = useState<"testcases" | "results">("testcases");

  const [useCustomInput, setUseCustomInput] = useState(false);
  const [customInputArray, setCustomInputArray] = useState("[2, 7, 11, 15]");
  const [customInputTarget, setCustomInputTarget] = useState("9");
  const [customInputString, setCustomInputString] = useState("()[]{}");

  const workerRef = useRef<Worker | null>(null);
  const runRef = useRef<() => void>(() => {});

  const activeChId = CHALLENGE_CHAPTERS[selectedTab];
  const filteredChallenges = ALL_CHALLENGES.filter(
    (item) => CHALLENGE_CHAPTERS[item.value] === activeChId
  );

  // Sync activeLesson prop to selectedTab
  useEffect(() => {
    if (activeLesson) {
      const tab = LESSON_TO_TAB[activeLesson];
      if (tab) {
        setSelectedTab(tab);
      }
    }
  }, [activeLesson]);

  // Load boilerplate on tab change
  useEffect(() => {
    setCode(BOILERPLATES[selectedTab]);
    setLastSubmittedCode(BOILERPLATES[selectedTab]);
    setSummary("");
    setTestResults([]);
    setCompileError(null);
    setActiveTC(0);
    setUseCustomInput(false);
    setConsoleTab("testcases");

    const isLinkedList = ["reverse-list", "merge-two-lists", "linked-list-cycle", "middle-list", "remove-nth-node"].includes(selectedTab);
    const isArrayOnly = ["find-max", "remove-duplicates", "max-subarray", "sort-colors"].includes(selectedTab);

    if (selectedTab === "two-sum") {
      setCustomInputArray("[1, 10, 3, 4, 20, 6]");
      setCustomInputTarget("30");
    } else if (selectedTab === "binary-search") {
      setCustomInputArray("[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]");
      setCustomInputTarget("31");
    } else if (isLinkedList) {
      setCustomInputArray("[1, 2, 3, 4, 5, 6, 7, 8]");
    } else if (isArrayOnly) {
      setCustomInputArray("[1, 2, 3, 4, 5, 6, 7, 8]");
    } else if (selectedTab === "valid-parentheses") {
      setCustomInputString("({[]})[]{}");
    } else if (selectedTab === "kth-largest" || selectedTab === "top-k-frequent") {
      setCustomInputArray("[3, 2, 1, 5, 6, 4]");
      setCustomInputTarget("2");
    } else if (selectedTab === "intersection-arrays" || selectedTab === "next-greater-element") {
      setCustomInputArray("[1, 2, 2, 1]");
      setCustomInputTarget("[2, 2]"); // For intersection/NGE, we hijack customInputTarget to store the second array!
    } else if (selectedTab === "remove-nth-node") {
      setCustomInputArray("[1, 2, 3, 4, 5]");
      setCustomInputTarget("2");
    } else if (selectedTab === "queue-using-stacks") {
      setCustomInputArray('["MyQueue", "push", "push", "peek", "pop", "empty"]');
      setCustomInputTarget("[[], [1], [2], [], [], []]");
    } else if (selectedTab === "min-stack") {
      setCustomInputArray('["MinStack", "push", "push", "push", "getMin", "pop", "top", "getMin"]');
      setCustomInputTarget("[[], [-2], [0], [-3], [], [], [], []]");
    } else if (selectedTab === "evaluate-rpn") {
      setCustomInputArray('["2", "1", "+", "3", "*"]');
    }
  }, [selectedTab]);

  const handleTabClick = (tab: TabId) => {
    const chId = CHALLENGE_CHAPTERS[tab];
    navigate(`/chapters/${chId}/practice/${tab}`);
  };

  const handleRunCode = () => {
    setConsoleTab("results");
    if (workerRef.current) {
      workerRef.current.terminate();
    }
    setCompileError(null);
    const trimmedCode = code.trim();
    if (!trimmedCode) {
      setSummary("Empty submission");
      setTestResults([]);
      return;
    }
    setLastSubmittedCode(trimmedCode);

    const currentTab = selectedTab;
    let testCases = TEST_CASES[currentTab];

    if (useCustomInput) {
      try {
        if (currentTab === "valid-parentheses") {
          testCases = [{ input: [customInputString], expected: null }];
        } else if (currentTab === "queue-using-stacks" || currentTab === "min-stack") {
          const ops = JSON.parse(customInputArray);
          const vals = JSON.parse(customInputTarget);
          if (!Array.isArray(ops) || !Array.isArray(vals)) {
            throw new Error("Inputs must be valid JSON arrays");
          }
          testCases = [{ input: [ops, vals], expected: null }];
        } else if (currentTab === "evaluate-rpn") {
          const tokens = JSON.parse(customInputArray);
          if (!Array.isArray(tokens)) {
            throw new Error("Input must be a valid JSON array of strings");
          }
          testCases = [{ input: [tokens], expected: null }];
        } else {
          // Parse first array
          const parsedArray = JSON.parse(customInputArray);
          if (!Array.isArray(parsedArray)) {
            throw new Error("First input must be a valid JSON array");
          }
          if (parsedArray.some((x) => typeof x !== "number")) {
            throw new Error("Array must contain numbers only");
          }

          const isArrayAndNumber = [
            "two-sum", "binary-search", "kth-largest", "top-k-frequent", "remove-nth-node"
          ].includes(currentTab);

          const isTwoArrays = [
            "intersection-arrays", "merge-two-lists", "next-greater-element"
          ].includes(currentTab);

          if (isArrayAndNumber) {
            const targetNum = Number(customInputTarget);
            if (isNaN(targetNum)) {
              throw new Error("Target must be a valid number");
            }
            testCases = [{ input: [parsedArray, targetNum], expected: null }];
          } else if (isTwoArrays) {
            const parsedArray2 = JSON.parse(customInputTarget);
            if (!Array.isArray(parsedArray2)) {
              throw new Error("Second input must be a valid JSON array");
            }
            if (parsedArray2.some((x) => typeof x !== "number")) {
              throw new Error("Second array must contain numbers only");
            }
            testCases = [{ input: [parsedArray, parsedArray2], expected: null }];
          } else if (currentTab === "merge-sorted-array") {
            const parsedArray2 = JSON.parse(customInputTarget);
            if (!Array.isArray(parsedArray2)) {
              throw new Error("Second input must be a valid JSON array");
            }
            const m = parsedArray.length;
            const n = parsedArray2.length;
            const nums1 = [...parsedArray, ...Array(n).fill(0)];
            testCases = [{ input: [nums1, m, parsedArray2, n], expected: null }];
          } else {
            testCases = [{ input: [parsedArray], expected: null }];
          }
        }
      } catch (err: any) {
        setCompileError(`Invalid custom input: ${err.message}`);
        setSummary("Tests Failed");
        setTestResults([]);
        return;
      }
    }

    let functionName = "twoSum";
    if (currentTab === "reverse-list") {
      functionName = "reverseList";
    } else if (currentTab === "find-max") {
      functionName = "findMax";
    } else if (currentTab === "binary-search") {
      functionName = "binarySearch";
    } else if (currentTab === "valid-parentheses") {
      functionName = "isValid";
    } else if (currentTab === "remove-duplicates") {
      functionName = "removeDuplicates";
    } else if (currentTab === "merge-sorted-array") {
      functionName = "merge";
    } else if (currentTab === "max-subarray") {
      functionName = "maxSubArray";
    } else if (currentTab === "sort-colors") {
      functionName = "sortColors";
    } else if (currentTab === "kth-largest") {
      functionName = "findKthLargest";
    } else if (currentTab === "top-k-frequent") {
      functionName = "topKFrequent";
    } else if (currentTab === "intersection-arrays") {
      functionName = "intersection";
    } else if (currentTab === "merge-two-lists") {
      functionName = "mergeTwoLists";
    } else if (currentTab === "linked-list-cycle") {
      functionName = "hasCycle";
    } else if (currentTab === "middle-list") {
      functionName = "middleNode";
    } else if (currentTab === "remove-nth-node") {
      functionName = "removeNthFromEnd";
    } else if (currentTab === "queue-using-stacks") {
      functionName = "runQueue";
    } else if (currentTab === "min-stack") {
      functionName = "runMinStack";
    } else if (currentTab === "evaluate-rpn") {
      functionName = "evalRPN";
    } else if (currentTab === "next-greater-element") {
      functionName = "nextGreaterElement";
    } else if (currentTab === "invert-tree") {
      functionName = "invertTree";
    } else if (currentTab === "contains-duplicate") {
      functionName = "containsDuplicate";
    } else if (currentTab === "find-center") {
      functionName = "findCenter";
    }

    const workerCode = `
      try {
        self.eval = undefined;
      } catch (e) {}

      self.onmessage = function(e) {
        const { code, functionName, testCases } = e.data;

        const shadowedGlobals = [
          'self', 'location', 'fetch', 'XMLHttpRequest', 'WebSocket',
          'Worker', 'postMessage', 'importScripts'
        ];

        try {
          const mockGlobalThis = {};

          const secureFunction = function(...args) {
            const body = args[args.length - 1];
            const params = args.slice(0, -1);
            const fn = new self.Function(
              ...shadowedGlobals,
              'Function',
              'globalThis',
              ...params,
              '"use strict";\\n' + body
            );
            return function(...callArgs) {
              const shadowArgs = shadowedGlobals.map(() => undefined);
              shadowArgs.push(secureFunction);
              shadowArgs.push(mockGlobalThis);
              return fn.apply(undefined, [...shadowArgs, ...callArgs]);
            };
          };
          secureFunction.prototype = self.Function.prototype;

          try {
            Object.defineProperty(self.Function.prototype, 'constructor', {
              value: secureFunction,
              writable: false,
              configurable: false
            });
          } catch (e) {}

          // Override Array.prototype.push and Array.prototype.pop for Stack tracking
          const originalPush = self.Array.prototype.push;
          const originalPop = self.Array.prototype.pop;
          let arrayCounter = 0;

          self.Array.prototype.push = function(...args) {
            if (self.isTracking) {
              self.isTracking = false; // Pause tracking to prevent recursive stack overflow
              if (this._id === undefined) {
                this._id = ++arrayCounter;
              }
              tracker.push({
                type: 'stack_push',
                value: args[0],
                arrayId: this._id,
                stackState: [...this, ...args]
              });
              self.isTracking = true; // Resume tracking
            }
            return originalPush.apply(this, args);
          };

          self.Array.prototype.pop = function() {
            if (self.isTracking) {
              self.isTracking = false; // Pause tracking
              if (this._id === undefined) {
                this._id = ++arrayCounter;
              }
              const poppedVal = this[this.length - 1];
              const nextState = this.slice(0, -1);
              const res = originalPop.apply(this);
              tracker.push({
                type: 'stack_pop',
                value: poppedVal,
                arrayId: this._id,
                stackState: nextState
              });
              self.isTracking = true; // Resume tracking
              return res;
            }
            return originalPop.apply(this);
          };

          [Object, Array, Function, String, Number, Boolean, RegExp, Date, Map, Set, Promise, Error].forEach(ctor => {
            try {
              if (ctor && ctor.prototype) {
                Object.freeze(ctor.prototype);
                Object.freeze(ctor);
              }
            } catch (e) {}
          });

          const userFnCompiler = secureFunction(
            \`
              \${code}
              return \${functionName};
            \`
          );

          const userFn = userFnCompiler();

          if (typeof userFn !== 'function') {
            throw new ReferenceError(functionName + ' is not defined');
          }

          function arrayToList(arr) {
            let head = null;
            for (let i = arr.length - 1; i >= 0; i--) {
              head = { val: arr[i], next: head };
            }
            return head;
          }
          function listToArray(head) {
            const arr = [];
            let curr = head;
            while (curr) {
              if (curr && typeof curr === 'object' && 'val' in curr) {
                arr.push(curr.val);
              } else {
                break;
              }
              curr = curr.next;
            }
            return arr;
          }
          function arrayToTree(arr) {
            if (!arr || arr.length === 0) return null;
            let root = { val: arr[0], left: null, right: null };
            let queue = [root];
            let i = 1;
            while (i < arr.length) {
              let curr = queue.shift();
              if (arr[i] !== null && arr[i] !== undefined) {
                curr.left = { val: arr[i], left: null, right: null };
                queue.push(curr.left);
              }
              i++;
              if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
                curr.right = { val: arr[i], left: null, right: null };
                queue.push(curr.right);
              }
              i++;
            }
            return root;
          }
          function treeToArray(root) {
            if (!root) return [];
            let result = [];
            let queue = [root];
            while (queue.length > 0) {
              let curr = queue.shift();
              if (curr) {
                result.push(curr.val);
                queue.push(curr.left);
                queue.push(curr.right);
              } else {
                result.push(null);
              }
            }
            while (result.length > 0 && result[result.length - 1] === null) {
              result.pop();
            }
            return result;
          }

          // ─── Instrument Access Proxies ───
          const steps = [];
          const proxyMap = new Map();

          function getLineNumber() {
            const err = new Error();
            const stack = err.stack;
            if (!stack) return null;
            const lines = stack.split('\\n');
            for (let i = 1; i < lines.length; i++) {
              const line = lines[i];
              if (
                line.indexOf('getLineNumber') !== -1 ||
                line.indexOf('Object.push') !== -1 ||
                line.indexOf('tracker.push') !== -1 ||
                line.indexOf('Object.get') !== -1 ||
                line.indexOf('Object.set') !== -1 ||
                line.indexOf('Array.push') !== -1 ||
                line.indexOf('Array.pop') !== -1 ||
                line.indexOf('createArrayProxy') !== -1 ||
                line.indexOf('createStringProxy') !== -1 ||
                line.indexOf('wrapNode') !== -1
              ) {
                continue;
              }
              const match = line.match(/<anonymous>:(\\d+):/) || 
                            line.match(/eval:(\\d+):/);
              if (match) {
                const compiledLineNum = parseInt(match[1], 10);
                // Offset is 4 due to Function constructor wrapper and template format lines.
                return Math.max(1, compiledLineNum - 4);
              }
            }
            return null;
          }

          const tracker = {
            push(step) {
              if (steps.length < 500) {
                step.line = getLineNumber();
                originalPush.call(steps, step);
              }
            }
          };

          function wrapNode(node) {
            if (!node || typeof node !== 'object') return node;
            if (proxyMap.has(node)) return proxyMap.get(node);

            const proxy = new Proxy(node, {
              get(target, prop) {
                if (prop === '_rawNode') return target;
                if (prop === 'next') {
                  const nextVal = target[prop];
                  if (self.isTracking) {
                    tracker.push({
                      type: 'get_next',
                      node: target.val,
                      nextNode: nextVal ? nextVal.val : null
                    });
                  }
                  return wrapNode(nextVal);
                }
                return target[prop];
              },
              set(target, prop, value) {
                if (prop === 'next') {
                  const rawVal = value && value._rawNode ? value._rawNode : value;
                  target[prop] = rawVal;
                  if (self.isTracking) {
                    tracker.push({
                      type: 'set_next',
                      node: target.val,
                      nextNode: rawVal ? rawVal.val : null
                    });
                  }
                  return true;
                }
                target[prop] = value;
                return true;
              }
            });
            proxyMap.set(node, proxy);
            return proxy;
          }

          function createArrayProxy(arr) {
            return new Proxy(arr, {
              get(target, prop) {
                if (typeof prop === 'string' && !isNaN(Number(prop))) {
                  const idx = Number(prop);
                  if (self.isTracking) {
                    tracker.push({
                      type: 'access',
                      index: idx,
                      value: target[idx]
                    });
                  }
                }
                return target[prop];
              }
            });
          }

          function createStringProxy(str) {
            const strObj = new String(str);
            return new Proxy(strObj, {
              get(target, prop) {
                if (typeof prop === 'string' && !isNaN(Number(prop))) {
                  const idx = Number(prop);
                  if (self.isTracking) {
                    tracker.push({
                      type: 'string_access',
                      index: idx,
                      value: target.charAt(idx)
                    });
                  }
                }
                if (prop === 'charAt') {
                  return function(idx) {
                    if (self.isTracking) {
                      tracker.push({
                        type: 'string_access',
                        index: idx,
                        value: target.charAt(idx)
                      });
                    }
                    return target.charAt(idx);
                  }
                }
                const val = target[prop];
                if (typeof val === 'function') {
                  return val.bind(target);
                }
                return val;
              }
            });
          }

          const results = [];
          for (const tc of testCases) {
            steps.length = 0;
            proxyMap.clear();

            let realArgs = tc.input;
            if (functionName === 'twoSum' || functionName === 'binarySearch' || functionName === 'findKthLargest' || functionName === 'topKFrequent') {
              const arrayProxy = createArrayProxy(tc.input[0]);
              realArgs = [arrayProxy, tc.input[1]];
            } else if (functionName === 'findMax' || functionName === 'removeDuplicates' || functionName === 'maxSubArray' || functionName === 'sortColors') {
              const arrayProxy = createArrayProxy(tc.input[0]);
              realArgs = [arrayProxy];
            } else if (functionName === 'merge') {
              const arrayProxy1 = createArrayProxy(tc.input[0]);
              const arrayProxy2 = createArrayProxy(tc.input[2]);
              realArgs = [arrayProxy1, tc.input[1], arrayProxy2, tc.input[3]];
            } else if (functionName === 'intersection') {
              const arrayProxy1 = createArrayProxy(tc.input[0]);
              const arrayProxy2 = createArrayProxy(tc.input[1]);
              realArgs = [arrayProxy1, arrayProxy2];
            } else if (functionName === 'reverseList' || functionName === 'hasCycle' || functionName === 'middleNode') {
              const listHead = arrayToList(tc.input[0]);
              const listProxy = wrapNode(listHead);
              realArgs = [listProxy];
            } else if (functionName === 'mergeTwoLists') {
              const list1 = wrapNode(arrayToList(tc.input[0]));
              const list2 = wrapNode(arrayToList(tc.input[1]));
              realArgs = [list1, list2];
            } else if (functionName === 'removeNthFromEnd') {
              const listHead = arrayToList(tc.input[0]);
              const listProxy = wrapNode(listHead);
              realArgs = [listProxy, tc.input[1]];
            } else if (functionName === 'isValid') {
              const stringProxy = createStringProxy(tc.input[0]);
              realArgs = [stringProxy];
            } else if (functionName === 'evalRPN') {
              const arrayProxy = createArrayProxy(tc.input[0]);
              realArgs = [arrayProxy];
            } else if (functionName === 'nextGreaterElement') {
              const arrayProxy1 = createArrayProxy(tc.input[0]);
              const arrayProxy2 = createArrayProxy(tc.input[1]);
              realArgs = [arrayProxy1, arrayProxy2];
            } else if (functionName === 'invertTree') {
              const treeRoot = arrayToTree(tc.input[0]);
              realArgs = [treeRoot];
            } else if (functionName === 'containsDuplicate') {
              const arrayProxy = createArrayProxy(tc.input[0]);
              realArgs = [arrayProxy];
            } else if (functionName === 'findCenter') {
              const arrayProxy = createArrayProxy(tc.input[0]);
              realArgs = [arrayProxy];
            }

            let actual = null;
            let error = null;
            try {
              self.isTracking = true;
              if (functionName === 'merge') {
                userFn(...realArgs);
                actual = [...realArgs[0]]; // Clone elements to plain array
              } else if (functionName === 'sortColors') {
                userFn(...realArgs);
                actual = [...realArgs[0]]; // Clone elements to plain array
              } else {
                actual = userFn(...realArgs);
                if (self.Array.isArray(actual)) {
                  actual = [...actual]; // Convert proxy array to plain array
                }
              }
              self.isTracking = false;
              
              const isLinkedListOutput = ['reverseList', 'mergeTwoLists', 'middleNode', 'removeNthFromEnd'].includes(functionName);
              if (isLinkedListOutput) {
                actual = listToArray(actual);
              } else if (functionName === 'invertTree') {
                actual = treeToArray(actual);
              }
              JSON.stringify(actual);
            } catch (err) {
              self.isTracking = false;
              actual = null;
              error = err.toString();
            }

            results.push({
              input: tc.input,
              expected: tc.expected,
              actual,
              error,
              steps: [...steps]
            });
          }

          self.postMessage({ type: 'success', results });
        } catch (err) {
          self.postMessage({ type: 'error', error: err.toString() });
        }
      };
    `;

    const blob = new Blob([workerCode], { type: "application/javascript" });
    const worker = new Worker(URL.createObjectURL(blob));
    workerRef.current = worker;

    const timeoutId = setTimeout(() => {
      worker.terminate();
      setSummary("Timeout");
      const errorResults = testCases.map((tc: TestCase) => ({
        input: tc.input,
        expected: tc.expected,
        actual: null,
        error: "Execution timed out",
        passed: false,
        steps: [],
      }));
      setTestResults(errorResults);
    }, 1000);

    worker.onmessage = (e) => {
      clearTimeout(timeoutId);
      worker.terminate();
      const data = e.data;

      if (data.type === "success") {
        const processedResults = data.results.map((r: TestResult) => {
          const passed = !r.error && isEqual(r.actual, r.expected, currentTab);
          return { ...r, passed };
        });

        const allPassed = processedResults.every((r: TestResult) => r.passed);
        setSummary(allPassed ? "All Tests Passed" : "Tests Failed");
        setTestResults(processedResults);
        setActiveTC(0);
      } else if (data.type === "error") {
        setCompileError(data.error);
        setSummary("Tests Failed");
        const errorResults = testCases.map((tc: TestCase) => ({
          input: tc.input,
          expected: tc.expected,
          actual: null,
          error: data.error,
          passed: false,
          steps: [],
        }));
        setTestResults(errorResults);
        setActiveTC(0);
      }
    };

    worker.postMessage({
      code: trimmedCode,
      functionName,
      testCases,
    });
  };

  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  useEffect(() => {
    runRef.current = handleRunCode;
  });

  const cmExtensions = useMemo(
    () => [
      javascript(),
      EditorView.lineWrapping,
      EditorView.theme({
        "&": {
          backgroundColor: "#fdfbf7",
        },
        ".cm-scroller": {
          fontFamily: "var(--font-mono)",
          fontSize: "14px",
        },
        ".cm-gutters": {
          backgroundColor: "#f4f1ea",
          color: "rgba(45, 45, 45, 0.4)",
          borderRight: "1px solid rgba(45, 45, 45, 0.05)",
        },
        "&.cm-focused .cm-cursor": {
          borderLeftColor: "var(--color-coral)",
        },
        "&.cm-focused .cm-selectionBackground, ::selection": {
          backgroundColor: "rgba(224, 83, 66, 0.15) !important",
        },
        ".cm-activeLine": {
          backgroundColor: "rgba(45, 45, 45, 0.02)",
        },
        ".cm-activeLineGutter": {
          backgroundColor: "rgba(45, 45, 45, 0.04)",
          color: "var(--color-coral)",
        }
      }),
      Prec.highest(
        keymap.of([
          {
            key: "Mod-Enter",
            preventDefault: true,
            run: () => {
              runRef.current();
              return true;
            },
          },
        ]),
      ),
    ],
    [],
  );

  const handleCodeChange = useCallback((value: string) => {
    setCode(value);
  }, []);

  const leftColumnContent = (
    <div className="flex flex-col h-full border border-charcoal/10 rounded-2xl bg-paper overflow-hidden shadow-sm">
      {/* 1. Header with file name / tab name */}
      <div className="flex shrink-0 items-center justify-between border-b border-charcoal/5 px-4 py-2.5 bg-paper-light">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
        </div>
        <span className="text-xs font-sans font-bold text-charcoal/60 uppercase tracking-widest">
          {selectedTab === "two-sum"
            ? "twoSum.js"
            : selectedTab === "reverse-list"
              ? "reverseList.js"
              : selectedTab === "find-max"
                ? "findMax.js"
                : selectedTab === "binary-search"
                  ? "binarySearch.js"
                  : "isValid.js"}
        </span>
      </div>

      {/* 2. CodeMirror Editor */}
      <div id="code-editor" className="flex-1 min-h-0 bg-paper overflow-hidden">
        <CodeMirror
          value={code}
          height="100%"
          theme="light"
          extensions={cmExtensions}
          onChange={handleCodeChange}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            indentOnInput: true,
            tabSize: 2,
          }}
          className="text-base font-mono h-full"
        />
      </div>

      {/* 3. Console/Drawer Area */}
      <div className="flex shrink-0 flex-col h-[280px] border-t border-charcoal/10 bg-paper-dark/30">
        {/* Drawer Tabs Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-charcoal/5 bg-paper-light px-3 h-[38px]">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setConsoleTab("testcases")}
              className={`px-3 py-1 text-xs font-sans font-extrabold uppercase tracking-wider rounded-lg transition-all ${
                consoleTab === "testcases"
                  ? "bg-coral/10 text-coral"
                  : "text-charcoal/55 hover:text-charcoal"
              }`}
            >
              Test Cases
            </button>
            <button
              type="button"
              onClick={() => setConsoleTab("results")}
              className={`px-3 py-1 text-xs font-sans font-extrabold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 ${
                consoleTab === "results"
                  ? "bg-coral/10 text-coral"
                  : "text-charcoal/55 hover:text-charcoal"
              }`}
            >
              Test Results
              {testResults.length > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-coral animate-ping" />
              )}
            </button>
          </div>
          <span className="text-[10px] font-sans text-charcoal/40 uppercase tracking-widest font-black">
            Console
          </span>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 font-sans">
          {consoleTab === "testcases" ? (
            <div className="flex flex-col gap-3 h-full">
              <div className="flex items-center justify-between pb-2 border-b border-charcoal/5">
                <Switch
                  checked={useCustomInput}
                  onChange={(e) => setUseCustomInput(e.currentTarget.checked)}
                  label="Use Custom Input"
                  size="xs"
                  styles={{
                    track: {
                      backgroundColor: useCustomInput ? 'var(--color-coral)' : undefined,
                      borderColor: useCustomInput ? 'var(--color-coral)' : undefined,
                      cursor: 'pointer',
                    },
                    label: {
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 800,
                      fontSize: '11px',
                      color: 'var(--color-charcoal)',
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }
                  }}
                />
                <span className="text-[10px] font-sans text-charcoal/40 uppercase tracking-wider font-extrabold">
                  {useCustomInput ? "Custom Mode" : "Default Mode"}
                </span>
              </div>

              <div className="flex-1 min-h-0">
                {useCustomInput ? (
                  <div className="flex flex-col gap-3">
                    {(selectedTab === "two-sum" ||
                      selectedTab === "binary-search" ||
                      selectedTab === "reverse-list" ||
                      selectedTab === "find-max") && (
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-charcoal/70 text-xs uppercase tracking-wide">
                          Array Items (JSON format):
                        </span>
                        <input
                          type="text"
                          value={customInputArray}
                          onChange={(e) => setCustomInputArray(e.target.value)}
                          placeholder="e.g. [2, 7, 11, 15]"
                          className="px-3 py-2 border border-charcoal/10 rounded-lg bg-paper font-mono text-sm focus:border-coral/50 focus:ring-1 focus:ring-coral/20 focus:outline-none w-full transition-all duration-200"
                        />
                      </div>
                    )}

                    {(selectedTab === "two-sum" || selectedTab === "binary-search") && (
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-charcoal/70 text-xs uppercase tracking-wide">
                          Target Number:
                        </span>
                        <input
                          type="number"
                          value={customInputTarget}
                          onChange={(e) => setCustomInputTarget(e.target.value)}
                          placeholder="e.g. 9"
                          className="px-3 py-2 border border-charcoal/10 rounded-lg bg-paper font-mono text-sm focus:border-coral/50 focus:ring-1 focus:ring-coral/20 focus:outline-none w-full transition-all duration-200"
                        />
                      </div>
                    )}

                    {selectedTab === "valid-parentheses" && (
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-charcoal/70 text-xs uppercase tracking-wide">
                          Parentheses String:
                        </span>
                        <input
                          type="text"
                          value={customInputString}
                          onChange={(e) => setCustomInputString(e.target.value)}
                          placeholder="e.g. ()[]{}"
                          className="px-3 py-2 border border-charcoal/10 rounded-lg bg-paper font-mono text-sm focus:border-coral/50 focus:ring-1 focus:ring-coral/20 focus:outline-none w-full transition-all duration-200"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] text-charcoal/40 font-bold uppercase tracking-wider mb-0.5">
                      Default Test Cases:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {TEST_CASES[selectedTab]?.map((tc, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-paper/50 border border-charcoal/5 flex flex-col gap-1">
                          <span className="text-[10px] font-sans font-bold text-charcoal/50">CASE {idx + 1}</span>
                          <span className="text-xs font-mono text-charcoal/80 truncate">In: {safeStringify(tc.input)}</span>
                          <span className="text-xs font-mono text-coral/80 truncate">Out: {safeStringify(tc.expected)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 h-full">
              {compileError && (
                <div className="text-red-500 font-mono text-sm font-semibold whitespace-pre-wrap bg-red-500/5 border border-red-500/10 rounded-xl p-3">
                  Error: {compileError}
                </div>
              )}
              {testResults.length === 0 ? (
                <div className="text-charcoal/45 italic text-sm py-8 text-center flex flex-col items-center justify-center gap-2">
                  <span>No test results yet. Write your code and click Run Code.</span>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {testResults.map((tc, idx) => {
                    const isPassed = tc.passed;
                    const isActive = idx === activeTC;
                    return (
                      <div
                        key={idx}
                        onClick={() => setActiveTC(idx)}
                        role="button"
                        tabIndex={0}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isActive
                            ? "ring-1 ring-coral border-coral/30 bg-paper shadow-sm"
                            : "bg-paper/40 hover:bg-paper/80 border-charcoal/5"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {isPassed ? (
                            <CheckCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                          ) : (
                            <XCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <span className="font-sans text-xs font-extrabold text-charcoal block">
                              {useCustomInput ? "Custom Case" : `Test Case ${idx + 1}`}
                            </span>
                            <span className="text-[10px] font-mono text-charcoal/50 block truncate">
                              Input: {safeStringify(tc.input)}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-sans border shrink-0 ${
                            isPassed
                              ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                              : "bg-red-500/10 text-red-700 border-red-500/20"
                          }`}
                        >
                          {useCustomInput ? (tc.error ? "Failed" : "Success") : (isPassed ? "Passed" : "Failed")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4. Action / Control Bar */}
      <div className="flex shrink-0 items-center justify-between border-t border-charcoal/10 bg-paper-light px-4 py-2.5 h-[56px]">
        <button
          id="btn-run-code"
          onClick={handleRunCode}
          title="Run code (⌘/Ctrl + Enter)"
          className="px-5 py-2 bg-coral text-paper rounded-xl font-sans text-sm font-bold uppercase tracking-wider shadow-sm transition-spring hover-spring active-spring cursor-pointer flex items-center gap-2"
        >
          <span>Run Code</span>
          <span className="font-mono text-[10px] opacity-70 border border-paper/30 px-1.5 py-0.5 rounded bg-paper/10">Ctrl+Enter</span>
        </button>

        <div
          id="test-summary"
          className={`font-sans text-xs font-extrabold tracking-wider uppercase px-3 py-1.5 rounded-full ${
            summary === "All Tests Passed"
              ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20"
              : summary === "Empty submission" ||
                  summary === "Timeout" ||
                  summary === "Tests Failed"
                ? "bg-red-500/10 text-red-700 border border-red-500/20"
                : "bg-charcoal/5 text-charcoal/60 border border-charcoal/5"
          }`}
        >
          {summary || "Ready"}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Select Dropdown Component */}
      <div className="flex flex-col gap-1 mb-1.5 select-none">
        <label className="font-sans text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/45">
          Select Coding Challenge
        </label>
        <div className="relative inline-block w-full sm:w-[280px]">
          <select
            value={selectedTab}
            onChange={(e) => handleTabClick(e.target.value as TabId)}
            className="w-full bg-paper-dark border border-charcoal/15 text-charcoal font-sans text-[13px] font-extrabold uppercase tracking-wider pl-4 pr-10 py-2 rounded-xl cursor-pointer appearance-none focus:outline-none focus:border-coral/50 focus:ring-2 focus:ring-coral/10 transition-all duration-200 shadow-sm"
          >
            {filteredChallenges.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-charcoal/55">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {isDesktop ? (
        <div className="h-[calc(100vh-85px)] min-h-[750px] max-h-[960px] w-full flex relative">
          <PanelGroup direction="horizontal" className="w-full gap-0 h-full items-stretch">
            <Panel defaultSize={40} minSize={25} className="flex flex-col min-w-0 pr-1 h-full">
              {leftColumnContent}
            </Panel>
            <PanelResizeHandle className="w-5 flex items-center justify-center cursor-col-resize group transition-all duration-200 self-stretch select-none mx-1.5 rounded-full">
              <div className="w-1 h-16 rounded-full bg-charcoal/10 group-hover:bg-coral group-active:bg-coral-dark transition-colors duration-200" />
            </PanelResizeHandle>
            <Panel defaultSize={60} minSize={35} className="flex flex-col min-w-0 pl-1 h-full">
              <CodeVisualizer challenge={selectedTab} testResult={testResults[activeTC]} userCode={lastSubmittedCode} />
            </Panel>
          </PanelGroup>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="flex-1 min-w-0 flex flex-col h-[700px]">
            {leftColumnContent}
          </div>
          <div className="flex-1 min-w-0 flex flex-col">
            <CodeVisualizer challenge={selectedTab} testResult={testResults[activeTC]} userCode={lastSubmittedCode} />
          </div>
        </div>
      )}
    </div>
  );
}
