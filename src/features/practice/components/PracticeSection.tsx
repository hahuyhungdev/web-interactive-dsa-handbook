import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { keymap, EditorView } from "@codemirror/view";
import { Prec } from "@codemirror/state";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, CheckCircle, XCircle, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Switch } from "@mantine/core";
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from "react-resizable-panels";
import { useMediaQuery } from "@mantine/hooks";

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

const TEST_CASES: Record<string, TestCase[]> = {
  "two-sum": [
    { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
    { input: [[3, 2, 4], 6], expected: [1, 2] },
    { input: [[3, 3], 6], expected: [0, 1] },
  ],
  "reverse-list": [
    { input: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
    { input: [[42]], expected: [42] },
    { input: [[]], expected: [] },
  ],
  "find-max": [
    { input: [[1, 5, 3, 9, 2]], expected: 9 },
    { input: [[-10, -5, -3, -9, -2]], expected: -2 },
    { input: [[42]], expected: 42 },
  ],
  "binary-search": [
    { input: [[1, 3, 5, 7, 9, 11, 13], 7], expected: 3 },
    { input: [[1, 3, 5, 7, 9, 11, 13], 9], expected: 4 },
    { input: [[1, 3, 5, 7, 9, 11, 13], 2], expected: -1 },
  ],
  "valid-parentheses": [
    { input: ["()[]{}"], expected: true },
    { input: ["([)]"], expected: false },
    { input: ["{[]}"], expected: true },
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
  if (challenge === "reverse-list") {
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
    challenge === "valid-parentheses"
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
    <div className="flex gap-2 justify-center py-6 px-4 bg-paper-dark/50 rounded-2xl border border-charcoal/5 shadow-inner my-4 overflow-x-auto w-full">
      {values.map((val, idx) => {
        const isActive = idx === activeIndex;
        const isSuccess = successIndices?.includes(idx);

        let bgClass = "bg-paper border-charcoal/10 text-charcoal";
        if (isActive) {
          bgClass = "bg-amber-400 border-amber-500 text-charcoal shadow-md scale-105";
        } else if (isSuccess) {
          bgClass = "bg-emerald-600 border-emerald-700 text-paper shadow-md scale-105";
        }

        return (
          <motion.div key={idx} layout className="flex flex-col items-center gap-1 min-w-[2.5rem]">
            <span className="font-mono text-[9px] text-charcoal/40 font-bold">[{idx}]</span>
            <div
              className={`w-11 h-11 rounded-xl border flex items-center justify-center font-mono text-xs font-bold transition-all duration-200 ${bgClass}`}
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
  const nodeRadius = 16;
  const positions = new Map<number, { x: number; y: number }>();
  values.forEach((val, idx) => {
    positions.set(val, { x: idx * 80 + 35, y: 40 });
  });

  return (
    <svg
      viewBox={`0 0 390 140`}
      className="w-full h-36 bg-paper-dark/50 rounded-2xl border border-charcoal/5 my-4"
    >
      <defs>
        <marker
          id="arrow-act"
          viewBox="0 0 10 10"
          refX="20"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#e05342" />
        </marker>
        <marker
          id="arrow-def"
          viewBox="0 0 10 10"
          refX="20"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(45,45,45,0.25)" />
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
                strokeWidth={isAct ? 2 : 1.5}
                markerEnd={isAct ? "url(#arrow-act)" : "url(#arrow-def)"}
              />
              <text
                x={from.x}
                y={from.y + 45}
                textAnchor="middle"
                fontSize="8"
                fontWeight="bold"
                fill="rgba(45,45,45,0.4)"
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
            stroke={isAct ? "#e05342" : "rgba(45,45,45,0.25)"}
            strokeWidth={isAct ? 2.2 : 1.5}
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
              fontSize="9"
              fontWeight="bold"
              fill={isActive ? "#fdfbf7" : "#2d2d2d"}
            >
              {val}
            </text>
          </g>
        );
      })}
    </svg>
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
      <div className="text-sm font-sans text-charcoal/70 bg-paper-dark border border-charcoal/5 px-4 py-1.5 rounded-full font-bold">
        Searching for target: <span className="text-coral font-mono">{target}</span>
      </div>

      <div className="flex gap-2 justify-center py-6 px-4 bg-paper-dark/50 rounded-2xl border border-charcoal/5 shadow-inner w-full overflow-x-auto">
        {values.map((val, idx) => {
          const isMid = idx === mid;
          const isFound = idx === foundIndex;
          const inRange = idx >= low && idx <= high;

          let bgClass = "";
          let labelText = "";

          if (isFound) {
            bgClass = "bg-emerald-600 border-emerald-700 text-paper shadow-md scale-105";
          } else if (isMid) {
            bgClass = "bg-amber-400 border-amber-500 text-charcoal shadow-md scale-105";
          } else if (inRange) {
            bgClass = "bg-paper border-charcoal/10 text-charcoal";
          } else {
            bgClass = "bg-paper/30 border-charcoal/5 text-charcoal/30 opacity-40";
          }

          if (idx === low && idx === high) {
            labelText = "L, H";
          } else if (idx === low) {
            labelText = "low";
          } else if (idx === high) {
            labelText = "high";
          }

          return (
            <div key={idx} className="flex flex-col items-center gap-1 min-w-[2.5rem]">
              <span className="font-mono text-[9px] text-charcoal/40 font-bold">[{idx}]</span>
              <div
                className={`w-11 h-11 rounded-xl border flex items-center justify-center font-mono text-xs font-bold transition-all duration-200 ${bgClass}`}
              >
                {val}
              </div>
              <span className="h-4 font-mono text-[9px] font-bold text-coral uppercase tracking-wide">
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
    <div className="flex flex-col items-center gap-6 w-full py-2">
      {/* Input String Traversal */}
      <div className="flex flex-col items-center gap-1.5 w-full">
        <span className="text-[10px] font-sans text-charcoal/40 uppercase tracking-wider font-bold">
          Input String
        </span>
        <div className="flex gap-1.5 bg-paper-dark border border-charcoal/5 p-2 rounded-xl shadow-inner overflow-x-auto max-w-full">
          {inputString.split("").map((char, idx) => {
            const isActive = idx === charIndex;
            return (
              <div
                key={idx}
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-base font-bold transition-all ${
                  isActive
                    ? "bg-coral text-paper scale-110 shadow-sm"
                    : "bg-paper text-charcoal/60"
                }`}
              >
                {char}
              </div>
            );
          })}
        </div>
      </div>

      {/* Physical Stack Representation */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-[10px] font-sans text-charcoal/40 uppercase tracking-wider font-bold">
          Stack
        </span>
        <div className="relative w-28 h-48 border-b-4 border-x-4 border-charcoal/30 rounded-b-xl flex flex-col-reverse items-center justify-start gap-1.5 p-3 bg-paper-dark/30 shadow-inner">
          <AnimatePresence>
            {stackState.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-center p-4">
                <span className="text-[10px] font-mono text-charcoal/30 italic">Empty Stack</span>
              </div>
            ) : (
              stackState.map((char, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: -20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                  className="w-20 py-2.5 bg-emerald-600 border border-emerald-700 text-paper rounded-lg flex items-center justify-center font-mono text-base font-bold shadow-sm"
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

  const steps = testResult?.steps || [];
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
    setIsPlaying((prev) => !prev);
  }, []);

  // Validation to verify if testResult corresponds to current challenge
  const isValidResultForChallenge = useMemo(() => {
    if (!testResult) return false;
    if (challenge === "two-sum" || challenge === "binary-search") {
      return Array.isArray(testResult.input[0]) && typeof testResult.input[1] === "number";
    }
    if (challenge === "find-max" || challenge === "reverse-list") {
      return Array.isArray(testResult.input[0]);
    }
    if (challenge === "valid-parentheses") {
      return typeof testResult.input[0] === "string";
    }
    return false;
  }, [challenge, testResult]);

  useEffect(() => {
    if (isPlaying) {
      if (stepIndex >= totalSteps) {
        setStepIndex(0);
      }
      timerRef.current = setInterval(() => {
        setStepIndex((prev) => {
          if (prev < totalSteps) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return prev;
          }
        });
      }, speedMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, stepIndex, totalSteps, speedMs]);

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
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-paper border border-charcoal/10 rounded-3xl h-full shadow-sm min-h-[350px]">
        <div className="text-charcoal/30 italic text-base">
          Run code to visualize execution timeline.
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

    steps.slice(0, stepIndex).forEach((step) => {
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
    });

    if (currentStep && currentStep.type === "access") {
      mid = currentStep.index;
      const val = currentStep.value;
      statusText = `Check arr[${mid}] = ${val}. Target is ${target}. ${
        val === target
          ? "Target found!"
          : val < target
            ? `Too small, shifting low to ${mid + 1}.`
            : `Too large, shifting high to ${mid - 1}.`
      }`;

      if (val === target) {
        foundIndex = mid;
      } else if (val < target) {
        low = mid + 1;
      } else {
        high = mid - 1;
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
  }

  return (
    <div className="flex-1 flex flex-col justify-between gap-4 bg-paper border border-charcoal/10 rounded-3xl p-5 shadow-sm min-h-[550px] w-full">
      <div>
        <h3 className="font-editorial text-xl font-bold text-charcoal mb-1">
          Execution Visualizer
        </h3>
        <p className="text-xs font-sans text-charcoal/50 uppercase tracking-wider mb-3">
          Visualizing Test Case {testResult.passed ? "✓ Passed" : "✗ Failed"}
        </p>

        {/* Code Viewer Panel */}
        <div className="border border-charcoal/10 rounded-2xl bg-paper-dark/30 overflow-hidden flex flex-col max-h-[180px] shadow-inner mb-4">
          <div className="bg-paper-light border-b border-charcoal/5 px-4 py-2 flex items-center justify-between">
            <span className="text-[10px] font-sans font-bold text-charcoal/50 uppercase tracking-wider">
              Code Viewer
            </span>
            {activeLine !== null && (
              <span className="text-[9px] font-mono text-coral font-bold uppercase tracking-wider animate-pulse">
                Executing Line {activeLine}
              </span>
            )}
          </div>
          <div
            ref={codeViewerRef}
            className="p-3 overflow-y-auto space-y-0.5 flex-1 font-mono text-[11px] leading-relaxed select-none"
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
                  <span className="w-6 shrink-0 text-right pr-2 text-charcoal/30 select-none font-mono text-[10px]">
                    {lineNum}
                  </span>
                  <span className="whitespace-pre font-mono">{line}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Visual Sandbox Panel */}
        <div className="border border-charcoal/10 rounded-2xl bg-paper p-4 shadow-sm mb-1">
          <span className="text-[10px] font-sans font-bold text-charcoal/40 uppercase tracking-wider block mb-2">
            Visual Sandbox
          </span>
          {visualizerNode}
        </div>
      </div>

      <div className="space-y-3">
        {/* Step details message */}
        <div className="bg-paper-dark border border-charcoal/5 rounded-xl px-4 py-2.5 min-h-[44px] flex items-center shadow-inner">
          <span className="font-bold text-coral mr-2">›</span>
          <span className="font-mono text-[13px] text-charcoal">{statusText}</span>
        </div>

        {/* Step Flow List (Trace Timeline) */}
        {totalSteps > 0 && (
          <div className="border border-charcoal/10 rounded-2xl bg-paper-dark/30 overflow-hidden flex flex-col max-h-[150px] shadow-inner">
            <div className="bg-paper-light border-b border-charcoal/5 px-4 py-2 flex items-center justify-between">
              <span className="text-[9px] font-sans font-bold text-charcoal/50 uppercase tracking-wider">
                Execution Flow Trace
              </span>
              <span className="text-[9px] font-mono text-charcoal/50">
                {totalSteps} operations
              </span>
            </div>
            <div ref={traceListRef} className="p-1.5 overflow-y-auto space-y-1 flex-1">
              {steps.map((step: any, idx: number) => {
                const isActive = idx === stepIndex;
                let description = "";

                if (step.type === "access") {
                  description = `Read index ${step.index} (value: ${step.value})`;
                } else if (step.type === "get_next") {
                  description = `Traverse: node ${step.node}.next → ${step.nextNode ?? "null"}`;
                } else if (step.type === "set_next") {
                  description = `Mutate: node ${step.node}.next → ${step.nextNode ?? "null"}`;
                } else if (step.type === "string_access") {
                  description = `Read char '${step.value}' at index ${step.index}`;
                } else if (step.type === "stack_push") {
                  description = `Push '${step.value}' onto stack`;
                } else if (step.type === "stack_pop") {
                  description = `Pop '${step.value}' from stack`;
                }

                const lineLabel = step.line ? ` (Line ${step.line})` : "";

                return (
                  <button
                    key={idx}
                    onClick={() => setStepIndex(idx)}
                    className={`w-full text-left font-mono text-[11px] px-2.5 py-1.5 rounded-lg border transition-all flex items-center justify-between ${
                      isActive
                        ? "bg-coral text-paper border-coral shadow-sm font-bold"
                        : "bg-paper/40 hover:bg-paper/85 text-charcoal/70 border-transparent"
                    }`}
                  >
                    <span className="truncate">
                      {idx + 1}. {description}{lineLabel}
                    </span>
                    <span
                      className={`text-[8px] px-1.5 py-0.5 rounded-md ${
                        isActive ? "bg-paper/20 text-paper" : "bg-charcoal/5 text-charcoal/50"
                      }`}
                    >
                      {step.type.replace("_", " ")}
                    </span>
                  </button>
                );
              })}
              {isFinalStep && (
                <div className="text-center font-sans text-[10px] text-charcoal/40 italic py-1.5">
                  — End of Execution —
                </div>
              )}
            </div>
          </div>
        )}

        {/* Compact playback controls */}
        {totalSteps > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between font-mono text-xs text-charcoal/60 px-1">
              <span className="flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-charcoal/40" />
                <span className="text-[10px]">Arrow keys & Space control timeline</span>
              </span>
              <span>
                Step {stepIndex} / {totalSteps}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={totalSteps}
                value={stepIndex}
                onChange={(e) => setStepIndex(Number(e.target.value))}
                className="flex-1 accent-coral h-1.5 bg-charcoal/10 rounded-lg cursor-pointer transition-all hover:bg-charcoal/15"
              />
            </div>

            <div className="flex items-center justify-between gap-4 mt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStepIndex(0)}
                  disabled={stepIndex === 0}
                  title="Reset (R)"
                  className="p-2 rounded-lg border border-charcoal/15 bg-paper hover:bg-charcoal/5 disabled:opacity-30 disabled:pointer-events-none text-charcoal shadow-sm transition-all active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleStepBackward}
                  disabled={stepIndex === 0}
                  title="Step Backward (Left Arrow)"
                  className="p-2 rounded-lg border border-charcoal/15 bg-paper hover:bg-charcoal/5 disabled:opacity-30 disabled:pointer-events-none text-charcoal shadow-sm transition-all active:scale-95"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={handlePlayToggle}
                  className="w-28 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-coral text-paper font-sans text-xs font-bold uppercase tracking-wider hover:bg-coral-dark shadow-sm transition-all active:scale-98"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" /> Play
                    </>
                  )}
                </button>
                <button
                  onClick={handleStepForward}
                  disabled={stepIndex === totalSteps}
                  title="Step Forward (Right Arrow)"
                  className="p-2 rounded-lg border border-charcoal/15 bg-paper hover:bg-charcoal/5 disabled:opacity-30 disabled:pointer-events-none text-charcoal shadow-sm transition-all active:scale-95"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Speed Slider */}
              <div className="flex items-center gap-2 border border-charcoal/10 rounded-lg bg-paper px-2.5 py-1 shadow-sm">
                <span className="text-[10px] font-sans text-charcoal/45 uppercase tracking-wider font-bold">Speed:</span>
                <input
                  type="range"
                  min={100}
                  max={1500}
                  step={100}
                  value={1600 - speedMs}
                  onChange={(e) => setSpeedMs(1600 - Number(e.target.value))}
                  className="w-16 accent-coral h-1 bg-charcoal/10 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] font-mono font-bold text-charcoal/70 min-w-[20px] text-right">
                  {Math.round((600 / speedMs) * 10) / 10}x
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

interface PracticeSectionProps {
  activeLesson: string | null;
}

type TabId = "two-sum" | "reverse-list" | "find-max" | "binary-search" | "valid-parentheses";

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

  const [useCustomInput, setUseCustomInput] = useState(false);
  const [customInputArray, setCustomInputArray] = useState("[2, 7, 11, 15]");
  const [customInputTarget, setCustomInputTarget] = useState("9");
  const [customInputString, setCustomInputString] = useState("()[]{}");

  const workerRef = useRef<Worker | null>(null);
  const runRef = useRef<() => void>(() => {});

  // Sync activeLesson prop to selectedTab
  useEffect(() => {
    if (activeLesson === "Challenge: Two Sum") {
      setSelectedTab("two-sum");
    } else if (activeLesson === "Challenge: Max Value in Array") {
      setSelectedTab("find-max");
    } else if (activeLesson === "Challenge: Reverse Linked List") {
      setSelectedTab("reverse-list");
    } else if (activeLesson === "Challenge: Binary Search") {
      setSelectedTab("binary-search");
    } else if (activeLesson === "Challenge: Valid Parentheses") {
      setSelectedTab("valid-parentheses");
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

    if (selectedTab === "two-sum") {
      setCustomInputArray("[2, 7, 11, 15]");
      setCustomInputTarget("9");
    } else if (selectedTab === "binary-search") {
      setCustomInputArray("[1, 3, 5, 7, 9, 11, 13]");
      setCustomInputTarget("7");
    } else if (selectedTab === "reverse-list") {
      setCustomInputArray("[1, 2, 3, 4, 5]");
    } else if (selectedTab === "find-max") {
      setCustomInputArray("[1, 5, 3, 9, 2]");
    } else if (selectedTab === "valid-parentheses") {
      setCustomInputString("()[]{}");
    }
  }, [selectedTab]);

  const handleTabClick = (tab: TabId) => {
    navigate(`/practice/${tab}`);
  };

  const handleRunCode = () => {
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
        if (
          currentTab === "two-sum" ||
          currentTab === "binary-search" ||
          currentTab === "reverse-list" ||
          currentTab === "find-max"
        ) {
          const parsed = JSON.parse(customInputArray);
          if (!Array.isArray(parsed)) {
            throw new Error("Input must be a valid array (e.g. [1, 2, 3])");
          }
          if (parsed.some((x) => typeof x !== "number")) {
            throw new Error("Array must contain numbers only");
          }
          if (currentTab === "two-sum" || currentTab === "binary-search") {
            const targetNum = Number(customInputTarget);
            if (isNaN(targetNum)) {
              throw new Error("Target must be a valid number");
            }
            testCases = [{ input: [parsed, targetNum], expected: null }];
          } else {
            testCases = [{ input: [parsed], expected: null }];
          }
        } else if (currentTab === "valid-parentheses") {
          testCases = [{ input: [customInputString], expected: null }];
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

          self.Array.prototype.push = function(...args) {
            if (self.isTracking) {
              self.isTracking = false; // Pause tracking to prevent recursive stack overflow
              tracker.push({
                type: 'stack_push',
                value: args[0],
                stackState: [...this, ...args]
              });
              self.isTracking = true; // Resume tracking
            }
            return originalPush.apply(this, args);
          };

          self.Array.prototype.pop = function() {
            if (self.isTracking) {
              self.isTracking = false; // Pause tracking
              const poppedVal = this[this.length - 1];
              const nextState = this.slice(0, -1);
              const res = originalPop.apply(this);
              tracker.push({
                type: 'stack_pop',
                value: poppedVal,
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
              const match = line.match(/<anonymous>:(\\d+):/) || 
                            line.match(/eval:(\\d+):/);
              if (match) {
                const compiledLineNum = parseInt(match[1], 10);
                // Offset is 3 due to Function constructor wrapper lines.
                return Math.max(1, compiledLineNum - 3);
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
            if (functionName === 'twoSum') {
              const arrayProxy = createArrayProxy(tc.input[0]);
              realArgs = [arrayProxy, tc.input[1]];
            } else if (functionName === 'findMax') {
              const arrayProxy = createArrayProxy(tc.input[0]);
              realArgs = [arrayProxy];
            } else if (functionName === 'reverseList') {
              const listHead = arrayToList(tc.input[0]);
              const listProxy = wrapNode(listHead);
              realArgs = [listProxy];
            } else if (functionName === 'binarySearch') {
              const arrayProxy = createArrayProxy(tc.input[0]);
              realArgs = [arrayProxy, tc.input[1]];
            } else if (functionName === 'isValid') {
              const stringProxy = createStringProxy(tc.input[0]);
              realArgs = [stringProxy];
            }

            let actual = null;
            let error = null;
            try {
              self.isTracking = true;
              actual = userFn(...realArgs);
              self.isTracking = false;
              if (functionName === 'reverseList') {
                actual = listToArray(actual);
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
    <>
      <div className="relative border border-charcoal/10 rounded-2xl bg-paper-dark overflow-hidden font-mono text-base shadow-sm">
        <div className="flex items-center justify-between border-b border-charcoal/5 px-6 py-3 bg-paper-light">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
          </div>
          <span className="text-base text-charcoal/65 tracking-wider font-semibold">
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
        <div id="code-editor" className="bg-paper">
          <CodeMirror
            value={code}
            height="220px"
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
            className="text-base font-mono"
          />
        </div>
      </div>

      {/* Custom Input Configuration */}
      <div className="border border-charcoal/10 rounded-2xl bg-paper p-4 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Switch
            checked={useCustomInput}
            onChange={(e) => setUseCustomInput(e.currentTarget.checked)}
            label="Use Custom Test Case"
            size="sm"
            styles={{
              track: {
                backgroundColor: useCustomInput ? 'var(--color-coral)' : undefined,
                borderColor: useCustomInput ? 'var(--color-coral)' : undefined,
                cursor: 'pointer',
              },
              label: {
                fontFamily: 'var(--font-sans)',
                fontWeight: 800,
                fontSize: '13px',
                color: 'var(--color-charcoal)',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }
            }}
          />
          <span className="text-[10px] font-sans text-charcoal/40 uppercase tracking-wider font-bold">
            {useCustomInput ? "Custom Input Active" : "Using Default Test Cases"}
          </span>
        </div>

        {useCustomInput && (
          <div className="pt-3 border-t border-charcoal/5 flex flex-col gap-3 font-sans text-sm">
            {(selectedTab === "two-sum" ||
              selectedTab === "binary-search" ||
              selectedTab === "reverse-list" ||
              selectedTab === "find-max") && (
              <div className="flex flex-col gap-1.5">
                <span className="font-bold text-charcoal/70 text-xs uppercase tracking-wide">
                  Array / List Items:
                </span>
                <input
                  type="text"
                  value={customInputArray}
                  onChange={(e) => setCustomInputArray(e.target.value)}
                  placeholder="e.g. [2, 7, 11, 15]"
                  className="px-3 py-2 border border-charcoal/10 rounded-xl bg-paper-dark/40 font-mono text-xs focus:border-coral/50 focus:bg-paper focus:ring-2 focus:ring-coral/20 focus:outline-none w-full transition-all duration-200"
                />
                <span className="text-[10px] text-charcoal/40 font-mono">
                  Must be a valid JSON array of numbers.
                </span>
              </div>
            )}

            {(selectedTab === "two-sum" || selectedTab === "binary-search") && (
              <div className="flex flex-col gap-1.5">
                <span className="font-bold text-charcoal/70 text-xs uppercase tracking-wide">
                  Target Number:
                </span>
                <input
                  type="number"
                  value={customInputTarget}
                  onChange={(e) => setCustomInputTarget(e.target.value)}
                  placeholder="e.g. 9"
                  className="px-3 py-2 border border-charcoal/10 rounded-xl bg-paper-dark/40 font-mono text-xs focus:border-coral/50 focus:bg-paper focus:ring-2 focus:ring-coral/20 focus:outline-none w-full transition-all duration-200"
                />
              </div>
            )}

            {selectedTab === "valid-parentheses" && (
              <div className="flex flex-col gap-1.5">
                <span className="font-bold text-charcoal/70 text-xs uppercase tracking-wide">
                  Parentheses String:
                </span>
                <input
                  type="text"
                  value={customInputString}
                  onChange={(e) => setCustomInputString(e.target.value)}
                  placeholder="e.g. ()[]{}"
                  className="px-3 py-2 border border-charcoal/10 rounded-xl bg-paper-dark/40 font-mono text-xs focus:border-coral/50 focus:bg-paper focus:ring-2 focus:ring-coral/20 focus:outline-none w-full transition-all duration-200"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-between gap-4">
        <button
          id="btn-run-code"
          onClick={handleRunCode}
          title="Run code (⌘/Ctrl + Enter)"
          className="px-6 py-3 bg-coral text-paper rounded-xl font-sans text-base font-bold uppercase tracking-wider shadow-sm transition-spring hover-spring active-spring cursor-pointer"
        >
          Run Code{" "}
          <span className="hidden md:inline ml-2 font-mono text-xs opacity-80">⌘↵</span>
        </button>

        <div
          id="test-summary"
          className={`font-sans text-base font-bold tracking-wide uppercase px-3 py-1 rounded-full ${
            summary === "All Tests Passed"
              ? "bg-green-500/10 text-green-700 border border-green-500/20"
              : summary === "Empty submission" ||
                  summary === "Timeout" ||
                  summary === "Tests Failed"
                ? "bg-red-500/10 text-red-700 border border-red-500/20"
                : "bg-charcoal/5 text-charcoal/60 border border-transparent"
          }`}
        >
          {summary || "Not Evaluated"}
        </div>
      </div>

      {/* Test Results Drawer */}
      <div
        id="test-results-drawer"
        className="border border-charcoal/10 rounded-2xl bg-paper-dark p-5 max-h-[160px] overflow-y-auto font-mono text-base shadow-inner flex flex-col gap-3"
      >
        {compileError && (
          <div className="text-red-500 font-semibold mb-2 whitespace-pre-wrap">
            Error: {compileError}
          </div>
        )}
        {testResults.length === 0 ? (
          <div className="text-charcoal/50 italic text-sm py-4 text-center">
            {summary === "Empty submission"
              ? "Empty submission"
              : "No test results yet. Write your code and click Run Code."}
          </div>
        ) : (
          testResults.map((tc, idx) => {
            const isPassed = tc.passed;
            const isActive = idx === activeTC;
            return (
              <div
                key={idx}
                onClick={() => setActiveTC(idx)}
                role="button"
                tabIndex={0}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? "ring-2 ring-coral/50 shadow-md bg-paper border-charcoal/20"
                    : "bg-paper/40 hover:bg-paper/70 border-charcoal/10"
                }`}
              >
                <div className="flex items-center justify-between font-bold mb-2">
                  <span className="flex items-center gap-1.5 text-sm">
                    {isPassed ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    {useCustomInput ? "Custom Test Case" : `Test Case ${idx + 1}`}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-sans border ${
                      isPassed
                        ? "bg-green-500/10 text-green-700 border-green-500/20"
                        : "bg-red-500/10 text-red-700 border-red-500/20"
                    }`}
                  >
                    {useCustomInput ? (tc.error ? "Failed" : "Success") : (isPassed ? "Passed" : "Failed")}
                  </span>
                </div>
                <div className="text-charcoal/70 font-mono text-[11px] truncate">
                  Input: {safeStringify(tc.input)}
                </div>
                {tc.error && (
                  <div className="text-red-500 font-mono text-[11px] mt-1.5 whitespace-pre-wrap">
                    Error: {tc.error}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Tabs - Segmented Capsule style */}
      <div className="flex p-1 bg-paper-dark border border-charcoal/10 rounded-2xl w-full md:w-max overflow-x-auto scrollbar-none flex-nowrap mb-2 gap-1.5">
        {(
          [
            ["two-sum", "Two Sum"],
            ["binary-search", "Binary Search"],
            ["reverse-list", "Reverse List"],
            ["find-max", "Find Max"],
            ["valid-parentheses", "Valid Parentheses"],
          ] as const
        ).map(([tabId, label]) => {
          const isActive = selectedTab === tabId;
          return (
            <button
              key={tabId}
              id={`challenge-tab-${tabId}`}
              onClick={() => handleTabClick(tabId)}
              className={`px-4 py-2 rounded-xl font-sans text-xs sm:text-[13px] font-extrabold uppercase tracking-wider transition-all duration-200 shrink-0 select-none relative focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 ${
                isActive ? "text-paper font-black z-10 animate-fade-in" : "text-charcoal/60 hover:text-charcoal z-10"
              }`}
            >
              {label}
              {isActive && (
                <motion.div
                  layoutId="activeTabBackground"
                  className="absolute inset-0 bg-coral rounded-xl shadow-sm -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {isDesktop ? (
        <PanelGroup direction="horizontal" className="w-full lg:items-start gap-0">
          <Panel defaultSize={50} minSize={30} className="flex flex-col gap-4 min-w-0 pr-1">
            {leftColumnContent}
          </Panel>
          <PanelResizeHandle className="w-5 flex items-center justify-center cursor-col-resize group transition-all duration-200 self-stretch select-none mx-1.5 rounded-full">
            <div className="w-1 h-16 rounded-full bg-charcoal/10 group-hover:bg-coral group-active:bg-coral-dark transition-colors duration-200" />
          </PanelResizeHandle>
          <Panel defaultSize={50} minSize={30} className="flex flex-col min-w-0 pl-1">
            <CodeVisualizer challenge={selectedTab} testResult={testResults[activeTC]} userCode={lastSubmittedCode} />
          </Panel>
        </PanelGroup>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="flex-1 min-w-0 flex flex-col gap-4">
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
