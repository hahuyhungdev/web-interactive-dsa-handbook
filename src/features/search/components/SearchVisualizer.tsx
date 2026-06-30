import { useState, useEffect, useMemo } from "react";
import { CodeViewer } from "@/features/theory/components/CodeViewer";
import { PlaybackControls } from "@/shared/components/ui/PlaybackControls";
import { usePlayback } from "@/shared/hooks/usePlayback";
import { usePlaybackKeyboard } from "@/shared/hooks/usePlaybackKeyboard";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from "react-resizable-panels";
import { useMediaQuery } from "@mantine/hooks";

const MIN_SIZE = 3;
const MAX_SIZE = 15;
const MIN_VAL = 1;
const MAX_VAL = 99;

function randomSortedArray(size: number): number[] {
  const arr = Array.from(
    { length: size },
    () => Math.floor(Math.random() * (MAX_VAL - MIN_VAL + 1)) + MIN_VAL,
  );
  return arr.sort((a, b) => a - b);
}

function parseCustom(input: string): {
  values: number[] | null;
  error: string | null;
} {
  const tokens = input
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (tokens.length === 0)
    return { values: null, error: "Enter at least one number." };
  if (tokens.length < MIN_SIZE)
    return { values: null, error: `Need at least ${MIN_SIZE} numbers.` };
  if (tokens.length > MAX_SIZE)
    return { values: null, error: `Max ${MAX_SIZE} numbers.` };
  const values: number[] = [];
  for (const t of tokens) {
    const n = Number(t);
    if (!Number.isFinite(n) || !Number.isInteger(n)) {
      return { values: null, error: `"${t}" is not a whole number.` };
    }
    if (n < MIN_VAL || n > MAX_VAL) {
      return {
        values: null,
        error: `${n} is out of range (${MIN_VAL}–${MAX_VAL}).`,
      };
    }
    values.push(n);
  }
  return { values: values.sort((a, b) => a - b), error: null };
}

interface SearchArrayEditorProps {
  array: number[];
  onChange: (next: number[]) => void;
}

export function SearchArrayEditor({ array, onChange }: SearchArrayEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(array.join(", "));
  const [error, setError] = useState<string | null>(null);

  const size = array.length;

  const startEdit = () => {
    setDraft(array.join(", "));
    setError(null);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setError(null);
  };

  const applyEdit = () => {
    const { values, error: err } = parseCustom(draft);
    if (!values) {
      setError(err);
      return;
    }
    onChange(values);
    setIsEditing(false);
    setError(null);
  };

  const handleSize = (delta: number) => {
    const nextSize = Math.min(MAX_SIZE, Math.max(MIN_SIZE, size + delta));
    if (nextSize === size) return;
    if (nextSize > size) {
      const added = Array.from(
        { length: nextSize - size },
        () => Math.floor(Math.random() * (MAX_VAL - MIN_VAL + 1)) + MIN_VAL
      );
      onChange([...array, ...added].sort((a, b) => a - b));
    } else {
      onChange(array.slice(0, nextSize));
    }
  };

  return (
    <div className="flex flex-col gap-3.5 glass-panel rounded-2xl p-4 sm:p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            id="btn-search-array-random"
            type="button"
            onClick={() => onChange(randomSortedArray(size))}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-charcoal/15 bg-paper hover:bg-charcoal/5 text-charcoal rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-spring hover-spring active-spring"
          >
            Randomize Array
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-charcoal/50">
            Array Size
          </span>
          <button
            type="button"
            onClick={() => handleSize(-1)}
            disabled={size <= MIN_SIZE}
            className="w-7 h-7 rounded-lg border border-charcoal/15 hover:bg-charcoal/5 text-charcoal font-mono disabled:opacity-30 disabled:cursor-not-allowed transition-spring hover-spring active-spring"
            aria-label="Decrease array size"
          >
            −
          </button>
          <span className="font-mono text-base font-bold tabular-nums w-6 text-center">
            {size}
          </span>
          <button
            type="button"
            onClick={() => handleSize(1)}
            disabled={size >= MAX_SIZE}
            className="w-7 h-7 rounded-lg border border-charcoal/15 hover:bg-charcoal/5 text-charcoal font-mono disabled:opacity-30 disabled:cursor-not-allowed transition-spring hover-spring active-spring"
            aria-label="Increase array size"
          >
            +
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-2">
          <label
            htmlFor="input-search-array-custom"
            className="font-sans text-xs font-bold uppercase tracking-wider text-charcoal/50"
          >
            Custom search array (comma or space separated, will be sorted automatically)
          </label>
          <div className="flex gap-2">
            <input
              id="input-search-array-custom"
              type="text"
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyEdit();
                if (e.key === "Escape") cancelEdit();
              }}
              autoFocus
              className="flex-1 px-3 py-2 text-sm font-mono border border-charcoal/15 bg-paper rounded-xl focus:outline-none focus:ring-1 focus:ring-coral text-charcoal"
              placeholder="e.g. 12, 24, 35, 45, 52, 60, 75"
            />
            <button
              type="button"
              onClick={applyEdit}
              className="px-3 py-2 bg-coral hover:bg-coral-dark text-paper rounded-xl font-sans text-xs font-bold uppercase tracking-wider shadow-sm transition-spring hover-spring active-spring"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="px-3 py-2 border border-charcoal/15 hover:bg-charcoal/5 text-charcoal rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-spring hover-spring active-spring"
            >
              Cancel
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-xs font-sans font-semibold animate-pulse">
              {error}
            </p>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 border-t border-charcoal/5 pt-3.5">
          <div className="font-mono text-sm text-charcoal/70 truncate">
            <span className="font-bold text-charcoal mr-2">search array</span>[{" "}
            {array.join(", ")} ]
          </div>
          <button
            id="btn-search-array-edit"
            type="button"
            onClick={startEdit}
            className="px-3 py-1.5 border border-charcoal/15 hover:bg-charcoal/5 text-charcoal rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-spring hover-spring active-spring shrink-0"
          >
            Edit Array
          </button>
        </div>
      )}
    </div>
  );
}

interface SearchFrame {
  index: number;
  status: "default" | "comparing" | "found" | "excluded";
  pointers: string[];
}

interface VisualFrame {
  elements: SearchFrame[];
  highlightedMarker: string;
  message: string;
}

export function SearchVisualizer() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [activeTab, setActiveTab] = useState<"linear" | "binary">("linear");
  const [array, setArray] = useState<number[]>([12, 24, 35, 45, 52, 60, 75, 88, 93]);
  const [targetVal, setTargetVal] = useState<number | "">(75);
  const [speed, setSpeed] = useState<number | "">(1);

  // Generate linear search steps
  const linearSearchFrames = useMemo((): VisualFrame[] => {
    const arr = array;
    const target = typeof targetVal === "number" ? targetVal : 0;
    const frames: VisualFrame[] = [];

    frames.push({
      elements: arr.map((_val, idx) => ({
        index: idx,
        status: "default",
        pointers: [],
      })),
      highlightedMarker: "@loop",
      message: `Initial state: search target is ${target}`,
    });

    for (let i = 0; i < arr.length; i++) {
      frames.push({
        elements: arr.map((_val, idx) => ({
          index: idx,
          status: idx === i ? "comparing" : idx < i ? "excluded" : "default",
          pointers: idx === i ? ["i"] : [],
        })),
        highlightedMarker: "@loop",
        message: `Checking index i = ${i} (value ${arr[i]})`,
      });

      const isFound = arr[i] === target;
      frames.push({
        elements: arr.map((_val, idx) => ({
          index: idx,
          status:
            idx === i
              ? isFound
                ? "found"
                : "comparing"
              : idx < i
                ? "excluded"
                : "default",
          pointers: idx === i ? ["i"] : [],
        })),
        highlightedMarker: "@compare",
        message: `Comparing arr[${i}] = ${arr[i]} with target ${target}. ${isFound ? "Matches!" : "No match."}`,
      });

      if (isFound) {
        frames.push({
          elements: arr.map((_val, idx) => ({
            index: idx,
            status: idx === i ? "found" : idx < i ? "excluded" : "default",
            pointers: idx === i ? ["i"] : [],
          })),
          highlightedMarker: "@compare",
          message: `Target ${target} found at index ${i}!`,
        });
        return frames;
      }
    }

    frames.push({
      elements: arr.map((_val, idx) => ({
        index: idx,
        status: "excluded",
        pointers: [],
      })),
      highlightedMarker: "@notfound",
      message: `Target ${target} not found in array. Returning -1.`,
    });

    return frames;
  }, [targetVal, array]);

  // Generate binary search steps
  const binarySearchFrames = useMemo((): VisualFrame[] => {
    const arr = array;
    const target = typeof targetVal === "number" ? targetVal : 0;
    const frames: VisualFrame[] = [];

    let low = 0;
    let high = arr.length - 1;

    const getElements = (
      l: number,
      h: number,
      m: number = -1,
      statusOverride: Record<number, SearchFrame["status"]> = {},
    ) => {
      return arr.map((_val, idx) => {
        let status: SearchFrame["status"] = "default";
        if (idx < l || idx > h) {
          status = "excluded";
        } else if (idx === m) {
          status = "comparing";
        }
        if (idx in statusOverride) {
          status = statusOverride[idx];
        }

        const pointers: string[] = [];
        if (idx === l) pointers.push("low");
        if (idx === h) pointers.push("high");
        if (idx === m) pointers.push("mid");

        return { index: idx, status, pointers };
      });
    };

    frames.push({
      elements: getElements(low, high),
      highlightedMarker: "@init",
      message: `Initialize low = 0, high = ${high}`,
    });

    while (low <= high) {
      frames.push({
        elements: getElements(low, high),
        highlightedMarker: "@loop",
        message: `Condition low <= high (${low} <= ${high}) is true. Enter loop.`,
      });

      const mid = Math.floor((low + high) / 2);
      frames.push({
        elements: getElements(low, high, mid),
        highlightedMarker: "@mid",
        message: `Calculate mid = Math.floor((${low} + ${high}) / 2) = ${mid}. Value is ${arr[mid]}.`,
      });

      if (arr[mid] === target) {
        frames.push({
          elements: getElements(low, high, mid, { [mid]: "found" }),
          highlightedMarker: "@compare",
          message: `Target ${target} matches arr[mid] (${arr[mid]}). Returning index ${mid}.`,
        });
        return frames;
      }

      if (arr[mid] < target) {
        frames.push({
          elements: getElements(low, high, mid),
          highlightedMarker: "@left-half",
          message: `arr[mid] (${arr[mid]}) < target (${target}). Search right half. Set low = mid + 1 = ${mid + 1}.`,
        });
        low = mid + 1;
      } else {
        frames.push({
          elements: getElements(low, high, mid),
          highlightedMarker: "@right-half",
          message: `arr[mid] (${arr[mid]}) > target (${target}). Search left half. Set high = mid - 1 = ${mid - 1}.`,
        });
        high = mid - 1;
      }
    }

    frames.push({
      elements: arr.map((_val, idx) => ({
        index: idx,
        status: "excluded",
        pointers: [],
      })),
      highlightedMarker: "@notfound",
      message: `Loop finished. Target ${target} not found. Returning -1.`,
    });

    return frames;
  }, [targetVal, array]);

  const frames =
    activeTab === "linear" ? linearSearchFrames : binarySearchFrames;

  const playback = usePlayback({
    totalFrames: frames.length,
    speed: typeof speed === "number" ? speed : 1,
    isActive: true,
  });

  usePlaybackKeyboard(playback, {
    totalFrames: frames.length,
    speed,
    setSpeed,
  });

  // Reset on tab, target, or array change
  useEffect(() => {
    playback.reset();
  }, [activeTab, targetVal, array]);

  const currentFrame = frames[playback.stepIndex] || {
    elements: [],
    highlightedLine: 1,
    message: "",
  };

  const searchBarCount = array.length;
  let barWidthClass = "w-8 sm:w-12";
  let labelTextClass = "text-sm sm:text-base";
  let containerGapClass = "gap-1 sm:gap-2";

  if (searchBarCount > 15) {
    barWidthClass = "w-4 sm:w-6";
    labelTextClass = "text-[10px] sm:text-xs";
    containerGapClass = "gap-0.5 sm:gap-1";
  } else if (searchBarCount > 9) {
    barWidthClass = "w-5 sm:w-8";
    labelTextClass = "text-xs sm:text-sm";
    containerGapClass = "gap-0.5 sm:gap-1.5";
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      <SearchArrayEditor array={array} onChange={setArray} />
      {/* Target input and Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-paper-light border border-charcoal/10 rounded-2xl p-4 shadow-sm">
        <div className="flex p-1 bg-charcoal/[0.04] border border-charcoal/10 rounded-2xl">
          <button
            id="btn-select-linear-search"
            onClick={() => setActiveTab("linear")}
            className={`px-5 py-2 rounded-xl font-sans text-[13px] font-black uppercase tracking-wider transition-all duration-200 ${
              activeTab === "linear"
                ? "bg-paper text-coral shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-charcoal/5"
                : "bg-transparent text-charcoal/60 hover:text-charcoal"
            }`}
          >
            Linear Search
          </button>
          <button
            id="btn-select-binary-search"
            onClick={() => setActiveTab("binary")}
            className={`px-5 py-2 rounded-xl font-sans text-[13px] font-black uppercase tracking-wider transition-all duration-200 ${
              activeTab === "binary"
                ? "bg-paper text-coral shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-charcoal/5"
                : "bg-transparent text-charcoal/60 hover:text-charcoal"
            }`}
          >
            Binary Search
          </button>
        </div>

        <div className="flex items-center gap-3">
          <label
            htmlFor="input-search-target"
            className="font-sans text-base font-bold uppercase tracking-wider text-charcoal"
          >
            Search Target:
          </label>
          <div className="relative flex items-center">
            <input
              id="input-search-target"
              type="text"
              inputMode="numeric"
              value={targetVal}
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === "" || raw === "-") {
                  setTargetVal(raw as any);
                  return;
                }
                const n = Number(raw);
                if (Number.isFinite(n)) setTargetVal(n);
              }}
              onBlur={() => {
                if (targetVal === "" || targetVal === "-") {
                  setTargetVal(0);
                }
              }}
              className="w-24 pl-3 pr-8 py-1.5 text-base font-mono border border-charcoal/20 bg-paper rounded-xl focus:outline-none focus:ring-1 focus:ring-coral text-charcoal"
            />
            <div className="absolute right-1.5 flex flex-col gap-0.5">
              <button
                type="button"
                onClick={() => {
                  setTargetVal((prev) => {
                    const val = typeof prev === "number" ? prev : 0;
                    return Math.min(9999, val + 1);
                  });
                }}
                className="p-0.5 hover:bg-charcoal/5 rounded text-charcoal/60 hover:text-coral transition-colors"
                aria-label="Increment"
              >
                <ChevronUp className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setTargetVal((prev) => {
                    const val = typeof prev === "number" ? prev : 0;
                    return Math.max(-9999, val - 1);
                  });
                }}
                className="p-0.5 hover:bg-charcoal/5 rounded text-charcoal/60 hover:text-coral transition-colors"
                aria-label="Decrement"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>
          <span className="font-mono text-xs text-charcoal/60 hidden md:inline">
            in [{array.join(", ")}]
          </span>
        </div>
      </div>

      <PlaybackControls
        isPlaying={playback.isPlaying}
        onPlay={playback.handlePlay}
        onPause={playback.handlePause}
        onStepForward={playback.handleStepForward}
        onStepBackward={playback.handleStepBackward}
        onReset={playback.reset}
        onScrub={playback.scrubTo}
        speed={speed}
        onSpeedChange={setSpeed}
        stepIndex={playback.stepIndex}
        totalSteps={Math.max(0, frames.length - 1)}
      />

      {/* Main layout */}
      {isDesktop ? (
        <div className="h-[600px] w-full flex relative">
          <PanelGroup direction="horizontal" className="w-full gap-0 h-full items-stretch">
            <Panel defaultSize={60} minSize={35} className="flex flex-col min-w-0 pr-1 h-full">
              <div className="flex-1 w-full bg-paper border border-charcoal/10 rounded-3xl p-6 md:p-8 shadow-sm h-full overflow-y-auto">
                <h3 className="font-editorial text-xl font-bold text-charcoal mb-2">
                  Visual Sandbox
                </h3>
                <p className="text-base font-sans text-charcoal mb-6 italic">
                  {currentFrame.message}
                </p>

                <div
                  id="sorting-visualizer-container"
                  className={`flex items-end justify-start sm:justify-center ${containerGapClass} bg-gradient-to-br from-paper-dark to-charcoal/[0.02] border border-charcoal/10 rounded-3xl p-4 sm:p-8 h-[340px] pb-28 overflow-y-hidden shadow-inner`}
                >
                  {array.map((val, idx) => {
                    const el = currentFrame.elements[idx] || {
                      status: "default",
                      pointers: [],
                    };
                    let barColorClass = "bg-gradient-to-t from-charcoal/15 to-charcoal/25 hover:from-charcoal/25 hover:to-charcoal/35 border border-charcoal/5 shadow-sm";
                    let labelClass = "text-charcoal/60";

                    if (el.status === "comparing") {
                      barColorClass = "bg-gradient-to-t from-amber-400 to-amber-300 shadow-[0_4px_12px_rgba(251,191,36,0.3)] border border-amber-500/20";
                      labelClass = "text-amber-600 font-extrabold";
                    } else if (el.status === "found") {
                      barColorClass = "bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-[0_4px_12px_rgba(16,185,129,0.25)] border border-emerald-700/20 text-paper";
                      labelClass = "text-emerald-600 font-extrabold";
                    } else if (el.status === "excluded") {
                      barColorClass = "bg-charcoal/10 border border-charcoal/5 opacity-40";
                      labelClass = "text-charcoal/30 font-light opacity-50";
                    }

                    return (
                      <div key={idx} className="flex flex-col items-center justify-end h-full">
                        <div
                          className={`array-bar ${barWidthClass} transition-all duration-200 rounded-t-lg flex flex-col items-center justify-end font-mono font-bold text-charcoal pb-2 h-full`}
                          style={{
                            height: `${Math.max(40, val * 1.5)}px`,
                          }}
                          data-value={val}
                          data-index={idx}
                          data-status={el.status}
                        >
                          <span className={`font-mono font-bold tabular-nums transition-colors duration-200 mb-1.5 ${labelTextClass} ${labelClass}`}>
                            {val}
                          </span>
                          <div
                            className={`w-full h-full rounded-t-md transition-all duration-200 ${barColorClass}`}
                          ></div>
                        </div>
                        <span className="font-mono text-xs sm:text-sm text-charcoal/60 mt-1 select-none font-bold">
                          {idx}
                        </span>

                        {/* Pointers Overlay */}
                        <div className="flex flex-col gap-0.5 items-center mt-1 shrink-0 z-10 h-[56px] justify-start w-full">
                          {el.pointers && el.pointers.length > 0 && el.pointers.map((ptr) => (
                            <span
                              key={ptr}
                              className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider font-mono ${
                                ptr === "mid"
                                  ? "bg-amber-50 text-amber-700 border-amber-300"
                                  : ptr === "low"
                                    ? "bg-blue-50 text-blue-700 border-blue-300"
                                    : ptr === "high"
                                      ? "bg-red-50 text-red-700 border-red-300"
                                      : "bg-charcoal text-paper border-charcoal"
                              }`}
                            >
                              {ptr}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Panel>
            <PanelResizeHandle className="w-5 flex items-center justify-center cursor-col-resize group transition-all duration-200 self-stretch select-none mx-1.5 rounded-full">
              <div className="w-1 h-16 rounded-full bg-charcoal/10 group-hover:bg-coral group-active:bg-coral-dark transition-colors duration-200" />
            </PanelResizeHandle>
            <Panel defaultSize={40} minSize={25} className="flex flex-col min-w-0 pl-1 h-full">
              <div className="w-full h-full bg-paper border border-charcoal/10 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col min-w-0 overflow-y-auto">
                <h3 className="font-editorial text-xl font-bold text-charcoal mb-4">
                  Implementation
                </h3>
                <CodeViewer
                  codeType={
                    activeTab === "linear" ? "linear-search" : "binary-search"
                  }
                  highlightedMarker={currentFrame.highlightedMarker}
                />
              </div>
            </Panel>
          </PanelGroup>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="w-full bg-paper border border-charcoal/10 rounded-3xl p-6 md:p-8 shadow-sm">
            <h3 className="font-editorial text-xl font-bold text-charcoal mb-2">
              Visual Sandbox
            </h3>
            <p className="text-base font-sans text-charcoal mb-6 italic">
              {currentFrame.message}
            </p>

            <div
              id="sorting-visualizer-container"
              className={`flex items-end justify-start sm:justify-center ${containerGapClass} bg-gradient-to-br from-paper-dark to-charcoal/[0.02] border border-charcoal/10 rounded-3xl p-4 sm:p-8 h-[340px] pb-28 overflow-y-hidden shadow-inner`}
            >
              {array.map((val, idx) => {
                const el = currentFrame.elements[idx] || {
                  status: "default",
                  pointers: [],
                };
                let barColorClass = "bg-gradient-to-t from-charcoal/15 to-charcoal/25 hover:from-charcoal/25 hover:to-charcoal/35 border border-charcoal/5 shadow-sm";
                let labelClass = "text-charcoal/60";

                if (el.status === "comparing") {
                  barColorClass = "bg-gradient-to-t from-amber-400 to-amber-300 shadow-[0_4px_12px_rgba(251,191,36,0.3)] border border-amber-500/20";
                  labelClass = "text-amber-600 font-extrabold";
                } else if (el.status === "found") {
                  barColorClass = "bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-[0_4px_12px_rgba(16,185,129,0.25)] border border-emerald-700/20 text-paper";
                  labelClass = "text-emerald-600 font-extrabold";
                } else if (el.status === "excluded") {
                  barColorClass = "bg-charcoal/10 border border-charcoal/5 opacity-40";
                  labelClass = "text-charcoal/30 font-light opacity-50";
                }

                return (
                  <div key={idx} className="flex flex-col items-center justify-end h-full">
                    <div
                      className={`array-bar ${barWidthClass} transition-all duration-200 rounded-t-lg flex flex-col items-center justify-end font-mono font-bold text-charcoal pb-2 h-full`}
                      style={{
                        height: `${Math.max(40, val * 1.5)}px`,
                      }}
                      data-value={val}
                      data-index={idx}
                      data-status={el.status}
                    >
                      <span className={`font-mono font-bold tabular-nums transition-colors duration-200 mb-1.5 ${labelTextClass} ${labelClass}`}>
                        {val}
                      </span>
                      <div
                        className={`w-full h-full rounded-t-md transition-all duration-200 ${barColorClass}`}
                      ></div>
                    </div>
                    <span className="font-mono text-xs sm:text-sm text-charcoal/60 mt-1 select-none font-bold">
                      {idx}
                    </span>

                    {/* Pointers Overlay */}
                    <div className="flex flex-col gap-0.5 items-center mt-1 shrink-0 z-10 h-[56px] justify-start w-full">
                      {el.pointers && el.pointers.length > 0 && el.pointers.map((ptr) => (
                        <span
                          key={ptr}
                          className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider font-mono ${
                            ptr === "mid"
                              ? "bg-amber-50 text-amber-700 border-amber-300"
                              : ptr === "low"
                                ? "bg-blue-50 text-blue-700 border-blue-300"
                                : ptr === "high"
                                  ? "bg-red-50 text-red-700 border-red-300"
                                  : "bg-charcoal text-paper border-charcoal"
                          }`}
                        >
                          {ptr}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full bg-paper border border-charcoal/10 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col min-w-0">
            <h3 className="font-editorial text-xl font-bold text-charcoal mb-4">
              Implementation
            </h3>
            <CodeViewer
              codeType={
                activeTab === "linear" ? "linear-search" : "binary-search"
              }
              highlightedMarker={currentFrame.highlightedMarker}
            />
          </div>
        </div>
      )}
    </div>
  );
}
