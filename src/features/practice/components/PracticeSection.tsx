import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { keymap, EditorView } from "@codemirror/view";
import { Prec } from "@codemirror/state";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, CheckCircle, XCircle } from "lucide-react";

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
};

function isEqual(actual: any, expected: any, challenge: string): boolean {
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
  if (challenge === "find-max") {
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
    <div className="flex gap-2.5 justify-center py-6 bg-paper-dark/50 rounded-2xl border border-charcoal/5 shadow-inner my-4">
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
          <div key={idx} className="flex flex-col items-center gap-1">
            <span className="font-mono text-[10px] text-charcoal/40 font-bold">[{idx}]</span>
            <div
              className={`w-12 h-12 rounded-xl border flex items-center justify-center font-mono text-sm font-bold transition-all duration-200 ${bgClass}`}
            >
              {val}
            </div>
          </div>
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
  activeType,
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
      className="w-full h-32 bg-paper-dark/50 rounded-2xl border border-charcoal/5 my-4"
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

// ─── Playback Visualizer Panel ──────────────────────────────────────────────

interface CodeVisualizerProps {
  challenge: string;
  testResult: TestResult | undefined;
}

function CodeVisualizer({ challenge, testResult }: CodeVisualizerProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
      }, 600);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, stepIndex, totalSteps]);

  if (!testResult) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-paper border border-charcoal/10 rounded-3xl h-full shadow-sm">
        <div className="text-charcoal/30 italic text-base">
          Run code to visualize execution timeline.
        </div>
      </div>
    );
  }

  // Active step values
  const currentStep = steps[stepIndex] || null;
  const isFinalStep = stepIndex === totalSteps;

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
  }

  return (
    <div className="flex-1 flex flex-col justify-between bg-paper border border-charcoal/10 rounded-3xl p-6 shadow-sm">
      <div>
        <h3 className="font-editorial text-xl font-bold text-charcoal mb-2">
          Execution Visualizer
        </h3>
        <p className="text-xs font-sans text-charcoal/50 uppercase tracking-wider mb-4">
          Visualizing Test Case {testResult.passed ? "✓ Passed" : "✗ Failed"}
        </p>

        {visualizerNode}
      </div>

      <div className="space-y-4">
        {/* Step details message */}
        <div className="bg-paper-dark border border-charcoal/5 rounded-xl px-4 py-3 min-h-[48px] flex items-center shadow-inner">
          <span className="font-bold text-coral mr-2">›</span>
          <span className="font-mono text-sm text-charcoal">{statusText}</span>
        </div>

        {/* Compact playback controls */}
        {totalSteps > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between font-mono text-xs text-charcoal/60 px-1">
              <span>Timeline Progress</span>
              <span>
                Step {stepIndex} / {totalSteps}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStepIndex(0)}
                disabled={stepIndex === 0}
                className="p-2 rounded-lg border border-charcoal/15 bg-paper hover:bg-charcoal/5 disabled:opacity-30 disabled:pointer-events-none text-charcoal"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleStepBackward}
                disabled={stepIndex === 0}
                className="p-2 rounded-lg border border-charcoal/15 bg-paper hover:bg-charcoal/5 disabled:opacity-30 disabled:pointer-events-none text-charcoal"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handlePlayToggle}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-coral text-paper font-sans text-xs font-bold uppercase tracking-wider hover:bg-coral-dark shadow-sm transition-all"
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
                className="p-2 rounded-lg border border-charcoal/15 bg-paper hover:bg-charcoal/5 disabled:opacity-30 disabled:pointer-events-none text-charcoal"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>
            <input
              type="range"
              min={0}
              max={totalSteps}
              value={stepIndex}
              onChange={(e) => setStepIndex(Number(e.target.value))}
              className="w-full accent-coral h-1 bg-charcoal/10 rounded-lg cursor-pointer my-2"
            />
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

export function PracticeSection({ activeLesson }: PracticeSectionProps) {
  const [selectedTab, setSelectedTab] = useState<"two-sum" | "reverse-list" | "find-max">("two-sum");
  const [code, setCode] = useState(BOILERPLATES["two-sum"]);
  const [summary, setSummary] = useState("");
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [activeTC, setActiveTC] = useState(0);

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
    }
  }, [activeLesson]);

  // Load boilerplate on tab change
  useEffect(() => {
    setCode(BOILERPLATES[selectedTab]);
    setSummary("");
    setTestResults([]);
    setCompileError(null);
    setActiveTC(0);
  }, [selectedTab]);

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

    const currentTab = selectedTab;
    const testCases = TEST_CASES[currentTab];
    const functionName =
      currentTab === "two-sum"
        ? "twoSum"
        : currentTab === "reverse-list"
          ? "reverseList"
          : "findMax";

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

          const tracker = {
            push(step) {
              if (steps.length < 500) {
                steps.push(step);
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
                  tracker.push({
                    type: 'get_next',
                    node: target.val,
                    nextNode: nextVal ? nextVal.val : null
                  });
                  return wrapNode(nextVal);
                }
                return target[prop];
              },
              set(target, prop, value) {
                if (prop === 'next') {
                  const rawVal = value && value._rawNode ? value._rawNode : value;
                  target[prop] = rawVal;
                  tracker.push({
                    type: 'set_next',
                    node: target.val,
                    nextNode: rawVal ? rawVal.val : null
                  });
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
                  tracker.push({
                    type: 'access',
                    index: idx,
                    value: target[idx]
                  });
                }
                return target[prop];
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
            }

            let actual = null;
            let error = null;
            try {
              actual = userFn(...realArgs);
              if (functionName === 'reverseList') {
                actual = listToArray(actual);
              }
              JSON.stringify(actual);
            } catch (err) {
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
    []
  );

  const handleCodeChange = useCallback((value: string) => {
    setCode(value);
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Tabs */}
      <div className="flex border-b border-charcoal/10 gap-4 pb-1">
        <button
          id="challenge-tab-two-sum"
          onClick={() => setSelectedTab("two-sum")}
          className={`pb-2 text-base font-sans font-bold tracking-wider uppercase border-b-2 transition-all ${
            selectedTab === "two-sum"
              ? "text-coral border-coral"
              : "text-charcoal border-transparent hover:text-charcoal"
          }`}
        >
          Two Sum
        </button>
        <button
          id="challenge-tab-reverse-list"
          onClick={() => setSelectedTab("reverse-list")}
          className={`pb-2 text-base font-sans font-bold tracking-wider uppercase border-b-2 transition-all ${
            selectedTab === "reverse-list"
              ? "text-coral border-coral"
              : "text-charcoal border-transparent hover:text-charcoal"
          }`}
        >
          Reverse List
        </button>
        <button
          id="challenge-tab-find-max"
          onClick={() => setSelectedTab("find-max")}
          className={`pb-2 text-base font-sans font-bold tracking-wider uppercase border-b-2 transition-all ${
            selectedTab === "find-max"
              ? "text-coral border-coral"
              : "text-charcoal border-transparent hover:text-charcoal"
          }`}
        >
          Find Max
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:items-stretch">
        {/* Left Column: Code Editor & Runner */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          <div className="relative border border-charcoal/10 rounded-2xl bg-paper-dark overflow-hidden font-mono text-base shadow-sm">
            <div className="flex items-center justify-between border-b border-charcoal/5 px-6 py-3 bg-paper-light">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
              </div>
              <span className="text-base text-charcoal tracking-wider">
                {selectedTab === "two-sum"
                  ? "twoSum.js"
                  : selectedTab === "reverse-list"
                    ? "reverseList.js"
                    : "findMax.js"}
              </span>
            </div>
            <div id="code-editor" className="bg-paper">
              <CodeMirror
                value={code}
                height="320px"
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

          {/* Action Controls */}
          <div className="flex items-center justify-between gap-4">
            <button
              id="btn-run-code"
              onClick={handleRunCode}
              title="Run code (⌘/Ctrl + Enter)"
              className="px-6 py-3 bg-coral text-paper hover:bg-coral-dark rounded-xl font-sans text-base font-bold uppercase tracking-wider shadow-sm transition-all duration-300"
            >
              Run Code{" "}
              <span className="hidden md:inline ml-2 font-mono text-xs opacity-80">
                ⌘↵
              </span>
            </button>

            <div
              id="test-summary"
              className={`font-sans text-base font-bold ${
                summary === "All Tests Passed"
                  ? "text-green-600"
                  : summary === "Empty submission" ||
                      summary === "Timeout" ||
                      summary === "Tests Failed"
                    ? "text-red-500"
                    : "text-charcoal"
              }`}
            >
              {summary || "Not Evaluated"}
            </div>
          </div>

          {/* Test Results Drawer */}
          <div
            id="test-results-drawer"
            className="border border-charcoal/10 rounded-2xl bg-paper-dark p-6 max-h-[300px] overflow-y-auto font-mono text-base shadow-inner"
          >
            {compileError && (
              <div className="text-red-500 font-semibold mb-4 whitespace-pre-wrap">
                Error: {compileError}
              </div>
            )}
            {testResults.length === 0 ? (
              <div className="text-charcoal italic">
                {summary === "Empty submission"
                  ? "Empty submission"
                  : "No results. Write your solution and click Run Code."}
              </div>
            ) : (
              <div className="space-y-3">
                {testResults.map((tc, idx) => {
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
                      <div className="flex items-center justify-between font-bold mb-1">
                        <span className="flex items-center gap-1.5">
                          {isPassed ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                          Test Case {idx + 1}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            isPassed
                              ? "bg-green-500/10 text-green-700"
                              : "bg-red-500/10 text-red-700"
                          }`}
                        >
                          {isPassed ? "Passed" : "Failed"}
                        </span>
                      </div>
                      <div className="text-charcoal font-mono text-xs truncate">
                        Input: {safeStringify(tc.input)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Visual Sandbox */}
        <div className="w-full lg:w-[480px] shrink-0 flex flex-col">
          <CodeVisualizer
            challenge={selectedTab}
            testResult={testResults[activeTC]}
          />
        </div>
      </div>
    </div>
  );
}
