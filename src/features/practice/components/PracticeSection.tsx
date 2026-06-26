import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { keymap, EditorView } from "@codemirror/view";
import { Prec } from "@codemirror/state";

const BOILERPLATES = {
  "two-sum": `function twoSum(nums, target) {
  // Write your code here

}`,
  "reverse-list": `function reverseList(head) {
  // Write your code here

}`,
  "find-max": `function findMax(arr) {
  // Write your code here

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

interface PracticeSectionProps {
  activeLesson: string | null;
}

export function PracticeSection({ activeLesson }: PracticeSectionProps) {
  const [selectedTab, setSelectedTab] = useState<
    "two-sum" | "reverse-list" | "find-max"
  >("two-sum");
  const [code, setCode] = useState(BOILERPLATES["two-sum"]);
  const [summary, setSummary] = useState("");
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [compileError, setCompileError] = useState<string | null>(null);
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

          const results = [];
          for (const tc of testCases) {
            let realArgs = tc.input;
            if (functionName === 'reverseList') {
              realArgs = [arrayToList(tc.input[0])];
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
              error
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
      } else if (data.type === "error") {
        setCompileError(data.error);
        setSummary("Tests Failed");
        const errorResults = testCases.map((tc: TestCase) => ({
          input: tc.input,
          expected: tc.expected,
          actual: null,
          error: data.error,
          passed: false,
        }));
        setTestResults(errorResults);
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

  // Keep the latest handler in a ref so the CodeMirror keymap (created once)
  // always invokes the current closure.
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
    [],
  );

  const handleCodeChange = useCallback((value: string) => {
    setCode(value);
  }, []);

  return (
    <div className="space-y-6">
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

      {/* Editor Panel */}
      <div className="flex flex-col gap-4">
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
              height="240px"
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
      </div>

      {/* Test Results Drawer */}
      <div
        id="test-results-drawer"
        className="border border-charcoal/10 rounded-2xl bg-paper-dark p-6 max-h-[350px] overflow-y-auto font-mono text-base shadow-inner"
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
          <div className="space-y-4">
            {testResults.map((tc, idx) => {
              const isPassed = tc.passed;
              return (
                <div
                  key={idx}
                  data-test-status={isPassed ? "passed" : "failed"}
                  className={`p-4 rounded-xl border transition-all ${
                    isPassed
                      ? "bg-green-500/5 border-green-500/20 text-green-700"
                      : "bg-red-500/5 border-red-500/20 text-red-700"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold mb-2">
                    <span>Test Case {idx + 1}</span>
                    <span
                      className={`text-base px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isPassed
                          ? "bg-green-500/10 text-green-700"
                          : "bg-red-500/10 text-red-700"
                      }`}
                    >
                      {isPassed ? "Passed" : "Failed"}
                    </span>
                  </div>
                  <div className="space-y-1 text-charcoal font-mono text-base">
                    <div>
                      <span className="font-semibold text-charcoal">
                        Input:
                      </span>{" "}
                      {safeStringify(tc.input)}
                    </div>
                    <div>
                      <span className="font-semibold text-charcoal">
                        Expected:
                      </span>{" "}
                      {safeStringify(tc.expected)}
                    </div>
                    <div>
                      <span className="font-semibold text-charcoal">
                        Actual:
                      </span>{" "}
                      {tc.error ? "Error" : safeStringify(tc.actual)}
                    </div>
                    {tc.error && (
                      <div className="text-red-500 mt-1 font-semibold">
                        Error: {tc.error}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
