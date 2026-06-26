import { useState, useEffect, useMemo } from 'react';
import { Play, Pause, SkipForward, SkipBack, Info } from 'lucide-react';
import CodeViewer from './CodeViewer';

const SEARCH_ARRAY = [12, 24, 35, 45, 52, 60, 75, 88, 93];

interface SearchFrame {
  index: number;
  status: 'default' | 'comparing' | 'found' | 'excluded';
  pointers: string[];
}

interface VisualFrame {
  elements: SearchFrame[];
  highlightedMarker: string;
  message: string;
}

export default function SearchVisualizer() {
  const [activeTab, setActiveTab] = useState<'linear' | 'binary'>('linear');
  const [targetVal, setTargetVal] = useState<number>(75);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number | ''>(1);

  // Generate linear search steps
  const linearSearchFrames = useMemo((): VisualFrame[] => {
    const arr = SEARCH_ARRAY;
    const target = targetVal;
    const frames: VisualFrame[] = [];

    // Frame 0: Start
    frames.push({
      elements: arr.map((val, idx) => ({ index: idx, status: 'default', pointers: [] })),
      highlightedMarker: '@loop',
      message: `Initial state: search target is ${target}`
    });

    for (let i = 0; i < arr.length; i++) {
      // Loop check
      frames.push({
        elements: arr.map((val, idx) => ({
          index: idx,
          status: idx === i ? 'comparing' : idx < i ? 'excluded' : 'default',
          pointers: idx === i ? ['i'] : []
        })),
        highlightedMarker: '@loop',
        message: `Checking index i = ${i} (value ${arr[i]})`
      });

      // Comparison
      const isFound = arr[i] === target;
      frames.push({
        elements: arr.map((val, idx) => ({
          index: idx,
          status: idx === i ? (isFound ? 'found' : 'comparing') : idx < i ? 'excluded' : 'default',
          pointers: idx === i ? ['i'] : []
        })),
        highlightedMarker: '@compare',
        message: `Comparing arr[${i}] = ${arr[i]} with target ${target}. ${isFound ? 'Matches!' : 'No match.'}`
      });

      if (isFound) {
        // Found return
        frames.push({
          elements: arr.map((val, idx) => ({
            index: idx,
            status: idx === i ? 'found' : idx < i ? 'excluded' : 'default',
            pointers: idx === i ? ['i'] : []
          })),
          highlightedMarker: '@compare',
          message: `Target ${target} found at index ${i}!`
        });
        return frames;
      }
    }

    // Not found
    frames.push({
      elements: arr.map((val, idx) => ({ index: idx, status: 'excluded', pointers: [] })),
      highlightedMarker: '@notfound',
      message: `Target ${target} not found in array. Returning -1.`
    });

    return frames;
  }, [targetVal]);

  // Generate binary search steps
  const binarySearchFrames = useMemo((): VisualFrame[] => {
    const arr = SEARCH_ARRAY;
    const target = targetVal;
    const frames: VisualFrame[] = [];

    let low = 0;
    let high = arr.length - 1;

    // Helper to get element status based on boundary
    const getElements = (l: number, h: number, m: number = -1, statusOverride: Record<number, SearchFrame['status']> = {}) => {
      return arr.map((val, idx) => {
        let status: SearchFrame['status'] = 'default';
        if (idx < l || idx > h) {
          status = 'excluded';
        } else if (idx === m) {
          status = 'comparing';
        }
        if (idx in statusOverride) {
          status = statusOverride[idx];
        }

        const pointers: string[] = [];
        if (idx === l) pointers.push('low');
        if (idx === h) pointers.push('high');
        if (idx === m) pointers.push('mid');

        return { index: idx, status, pointers };
      });
    };

    // Frame 0: Init
    frames.push({
      elements: getElements(low, high),
      highlightedMarker: '@init',
      message: `Initialize low = 0, high = ${high}`
    });

    while (low <= high) {
      // Loop condition check
      frames.push({
        elements: getElements(low, high),
        highlightedMarker: '@loop',
        message: `Condition low <= high (${low} <= ${high}) is true. Enter loop.`
      });

      const mid = Math.floor((low + high) / 2);
      // Mid assignment
      frames.push({
        elements: getElements(low, high, mid),
        highlightedMarker: '@mid',
        message: `Calculate mid = Math.floor((${low} + ${high}) / 2) = ${mid}. Value is ${arr[mid]}.`
      });

      if (arr[mid] === target) {
        // Found
        frames.push({
          elements: getElements(low, high, mid, { [mid]: 'found' }),
          highlightedMarker: '@compare',
          message: `Target ${target} matches arr[mid] (${arr[mid]}). Returning index ${mid}.`
        });
        return frames;
      }

      if (arr[mid] < target) {
        // Less than target, shift low
        frames.push({
          elements: getElements(low, high, mid),
          highlightedMarker: '@left-half',
          message: `arr[mid] (${arr[mid]}) < target (${target}). Search right half. Set low = mid + 1 = ${mid + 1}.`
        });
        low = mid + 1;
      } else {
        // Greater than target, shift high
        frames.push({
          elements: getElements(low, high, mid),
          highlightedMarker: '@right-half',
          message: `arr[mid] (${arr[mid]}) > target (${target}). Search left half. Set high = mid - 1 = ${mid - 1}.`
        });
        high = mid - 1;
      }
    }

    // Not found
    frames.push({
      elements: arr.map((val, idx) => ({ index: idx, status: 'excluded', pointers: [] })),
      highlightedMarker: '@notfound',
      message: `Loop finished. Target ${target} not found. Returning -1.`
    });

    return frames;
  }, [targetVal]);

  const frames = activeTab === 'linear' ? linearSearchFrames : binarySearchFrames;

  // Reset steps on tab or target change
  useEffect(() => {
    setIsPlaying(false);
    setStepIndex(0);
  }, [activeTab, targetVal]);

  // Sync playback loop
  useEffect(() => {
    if (!isPlaying) return;

    const intervalId = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= frames.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000 / (typeof speed === 'number' ? speed : 1));

    return () => clearInterval(intervalId);
  }, [isPlaying, speed, frames.length]);

  const handlePlay = () => {
    if (stepIndex >= frames.length - 1) {
      setStepIndex(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setStepIndex((prev) => Math.min(frames.length - 1, prev + 1));
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    setStepIndex((prev) => Math.max(0, prev - 1));
  };

  const currentFrame = frames[stepIndex] || { elements: [], highlightedLine: 1, message: '' };

  // Generate code lines for CodeViewer
  const linearCodeType = 'linear-search';
  const binaryCodeType = 'binary-search';

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Target input and Tabs */}
      {/* Target input and Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-paper-light border border-charcoal/10 rounded-2xl p-4 shadow-sm">
        <div className="flex gap-3">
          <button
            id="btn-select-bubble-sort" // Keep IDs clean for visualizer tabs
            onClick={() => setActiveTab('linear')}
            className={`px-4 py-2 rounded-xl font-sans text-base font-bold uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'linear'
                ? 'bg-coral text-paper shadow-sm'
                : 'border border-charcoal/20 bg-transparent hover:bg-charcoal/5 text-charcoal'
            }`}
          >
            Linear Search
          </button>
          <button
            id="btn-select-selection-sort"
            onClick={() => setActiveTab('binary')}
            className={`px-4 py-2 rounded-xl font-sans text-base font-bold uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'binary'
                ? 'bg-coral text-paper shadow-sm'
                : 'border border-charcoal/20 bg-transparent hover:bg-charcoal/5 text-charcoal'
            }`}
          >
            Binary Search
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-sans text-base font-bold uppercase tracking-wider text-charcoal">Search Target:</span>
          <select
            value={targetVal}
            onChange={(e) => setTargetVal(Number(e.target.value))}
            className="px-3 py-1.5 text-base font-mono border border-charcoal/20 bg-paper rounded-xl focus:outline-none focus:ring-1 focus:ring-coral text-charcoal"
          >
            {SEARCH_ARRAY.map(val => (
              <option key={val} value={val}>{val}</option>
            ))}
            <option value={99}>99 (Not Found)</option>
          </select>
        </div>
      </div>

      {/* Playback controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-paper-light border border-charcoal/10 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <button
              id="btn-pause"
              onClick={handlePause}
              className="p-2.5 bg-charcoal text-paper hover:bg-coral hover:text-paper rounded-xl transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/50"
              aria-label="Pause"
            >
              <Pause className="w-4 h-4 fill-current" />
            </button>
          ) : (
            <button
              id="btn-play"
              onClick={handlePlay}
              className="p-2.5 bg-coral text-paper hover:bg-coral-dark rounded-xl transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/50"
              aria-label="Play"
            >
              <Play className="w-4 h-4 fill-current" />
            </button>
          )}

          <button
            id="btn-step-backward"
            onClick={handleStepBackward}
            className="p-2.5 border border-charcoal/20 bg-transparent hover:bg-charcoal/5 text-charcoal rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/50"
            aria-label="Step Backward"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            id="btn-step-forward"
            onClick={handleStepForward}
            className="p-2.5 border border-charcoal/20 bg-transparent hover:bg-charcoal/5 text-charcoal rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/50"
            aria-label="Step Forward"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed and step info */}
        <div className="flex items-center gap-6 font-sans text-base font-semibold">
          <div className="flex items-center gap-2">
            <span className="text-charcoal uppercase tracking-wider text-base">Speed:</span>
            <input
              id="input-speed"
              type="number"
              min="0.1"
              max="10"
              step="0.1"
              value={speed}
              onChange={(e) => {
                let val = parseFloat(e.target.value);
                if (!isNaN(val)) {
                  if (val > 10) val = 10;
                  if (val < 0.1) val = 0.1;
                  setSpeed(val);
                } else {
                  setSpeed('');
                }
              }}
              onBlur={() => {
                if (speed === '' || isNaN(speed)) {
                  setSpeed(1);
                }
              }}
              className="w-16 px-2.5 py-1.5 text-base font-mono border border-charcoal/20 bg-paper rounded-xl focus:outline-none focus:ring-1 focus:ring-coral text-charcoal"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-charcoal/5 px-3 py-1.5 rounded-xl border border-charcoal/10 font-mono text-base text-charcoal">
            <Info className="w-4 h-4 text-charcoal" />
            <span>Step:</span>
            <span id="playback-step-info" className="font-bold">{stepIndex}</span>
            <span>/</span>
            <span>{Math.max(0, frames.length - 1)}</span>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row gap-8 lg:items-stretch">
        {/* Sandbox */}
        <div className="flex-1 w-full bg-paper border border-charcoal/10 rounded-3xl p-6 md:p-8 shadow-sm">
          <h3 className="font-editorial text-xl font-bold text-charcoal mb-2">Visual Sandbox</h3>
          <p className="text-base font-sans text-charcoal mb-6 italic">{currentFrame.message}</p>

          <div
            id="sorting-visualizer-container" // Re-use ID contract for array-bar wrapper
            className="flex items-end justify-center gap-2 bg-paper-dark border border-charcoal/10 rounded-3xl p-8 h-48 min-w-[280px]"
          >
            {SEARCH_ARRAY.map((val, idx) => {
              const el = currentFrame.elements[idx] || { status: 'default', pointers: [] };
              let barColor = 'bg-charcoal/30 border-charcoal/10';
              if (el.status === 'comparing') {
                barColor = 'bg-amber-400 border-amber-500';
              } else if (el.status === 'found') {
                barColor = 'bg-emerald-500 border-emerald-600 text-paper';
              } else if (el.status === 'excluded') {
                barColor = 'bg-charcoal/10 border-charcoal/5 opacity-40';
              }

              return (
                <div
                  key={idx}
                  className="array-bar w-12 transition-all duration-200 rounded-t-lg flex flex-col items-center justify-end text-base font-mono font-bold text-charcoal pb-2 h-full relative"
                  style={{
                    height: `${Math.max(40, val * 1.5)}px`,
                  }}
                  data-value={val}
                  data-index={idx}
                  data-status={el.status}
                >
                  <span className="bg-paper px-1 py-0.5 rounded border border-charcoal/10 shadow-sm mb-1.5 font-mono text-base">
                    {val}
                  </span>
                  <div className={`w-full h-full rounded-t-md border transition-all duration-200 ${barColor}`}></div>
                  
                  {/* Pointers Overlay */}
                  {el.pointers && el.pointers.length > 0 && (
                    <div className="absolute top-[105%] left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center shrink-0">
                      {el.pointers.map(ptr => (
                        <span
                          key={ptr}
                          className={`text-base font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider font-mono ${
                            ptr === 'mid' ? 'bg-amber-50 text-amber-700 border-amber-300' :
                            ptr === 'low' ? 'bg-blue-50 text-blue-700 border-blue-300' :
                            ptr === 'high' ? 'bg-red-50 text-red-700 border-red-300' :
                            'bg-charcoal text-paper border-charcoal'
                          }`}
                        >
                          {ptr}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CodeViewer */}
        <div className="w-full lg:w-[480px] shrink-0 bg-paper border border-charcoal/10 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col">
          <h3 className="font-editorial text-xl font-bold text-charcoal mb-4">Implementation</h3>
          <CodeViewer
            codeType={activeTab === 'linear' ? linearCodeType : binaryCodeType}
            highlightedMarker={currentFrame.highlightedMarker}
          />
        </div>
      </div>
    </div>
  );
}
