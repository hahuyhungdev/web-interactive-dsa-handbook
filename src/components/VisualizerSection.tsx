import { useState, useEffect, useMemo } from 'react';
import { Play, Pause, SkipForward, SkipBack, Info } from 'lucide-react';
import SortingVisualizer from './SortingVisualizer';
import LinkedListVisualizer from './LinkedListVisualizer';
import CodeViewer from './CodeViewer';
import { ArrayItem, NodeItem, VisualizerFrame } from '../types';

// --- Frame Generation Helpers ---

const DEFAULT_SORTING_ARRAY = [25, 40, 15, 55, 30, 20];

function generateBubbleSortFrames(arr: number[]): VisualizerFrame[] {
  let frames: VisualizerFrame[] = [];
  let currentArray: ArrayItem[] = arr.map((val, idx) => ({ value: val, index: idx, status: 'default' }));
  
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

  let n = currentArray.length;
  let sortedIndices: number[] = [];

  // Frame 0: Initial state
  pushFrame(currentArray, '@outer-loop', sortedIndices);

  for (let i = 0; i < n; i++) {
    // Outer loop check
    pushFrame(currentArray, '@outer-loop', sortedIndices);
    
    for (let j = 0; j < n - i - 1; j++) {
      // Inner loop check
      pushFrame(currentArray, '@inner-loop', sortedIndices);

      // Comparing frame
      currentArray[j].status = 'comparing';
      currentArray[j + 1].status = 'comparing';
      pushFrame(currentArray, '@compare', sortedIndices);

      if (currentArray[j].value > currentArray[j + 1].value) {
        // Swapping frame
        currentArray[j].status = 'swapping';
        currentArray[j + 1].status = 'swapping';
        pushFrame(currentArray, '@swap', sortedIndices);

        // Perform swap
        let temp = currentArray[j];
        currentArray[j] = currentArray[j + 1];
        currentArray[j + 1] = temp;
        
        // Post swap frame
        pushFrame(currentArray, '@swap', sortedIndices);
      }

      // Reset statuses to default
      currentArray[j].status = 'default';
      currentArray[j + 1].status = 'default';
    }
    
    // Mark element sorted
    sortedIndices.push(n - i - 1);
    pushFrame(currentArray, '@outer-loop', sortedIndices);
  }

  // Final state: all elements sorted
  let finalArray: ArrayItem[] = currentArray.map(item => ({ ...item, status: 'sorted' }));
  frames.push({
    array: finalArray,
    highlightedMarker: '@outer-loop'
  });

  return frames;
}

function generateSelectionSortFrames(arr: number[]): VisualizerFrame[] {
  let frames: VisualizerFrame[] = [];
  let currentArray: ArrayItem[] = arr.map((val, idx) => ({ value: val, index: idx, status: 'default' }));
  
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

  let n = currentArray.length;
  let sortedIndices: number[] = [];

  // Frame 0: Initial state
  pushFrame(currentArray, '@outer-loop', sortedIndices);

  for (let i = 0; i < n; i++) {
    // Outer loop start
    pushFrame(currentArray, '@outer-loop', sortedIndices);

    if (i === n - 1) {
      sortedIndices.push(i);
      pushFrame(currentArray, '@outer-loop', sortedIndices);
      break;
    }

    let minIdx = i;
    pushFrame(currentArray, '@init-min', sortedIndices, minIdx);

    for (let j = i + 1; j < n; j++) {
      // Inner loop check
      pushFrame(currentArray, '@inner-loop', sortedIndices, minIdx, j);

      // Comparison check
      pushFrame(currentArray, '@compare', sortedIndices, minIdx, j);

      if (currentArray[j].value < currentArray[minIdx].value) {
        minIdx = j;
        pushFrame(currentArray, '@update-min', sortedIndices, minIdx);
      }
    }

    // Swapping check
    pushFrame(currentArray, '@outer-loop', sortedIndices, minIdx, i);

    if (minIdx !== i) {
      // Swapping frame
      let swapArray: ArrayItem[] = currentArray.map((item, idx) => {
        let status: 'default' | 'comparing' | 'swapping' | 'sorted' = 'default';
        if (sortedIndices.includes(idx)) {
          status = 'sorted';
        } else if (idx === minIdx || idx === i) {
          status = 'swapping';
        }
        return { ...item, status };
      });
      frames.push({
        array: swapArray,
        highlightedMarker: '@swap'
      });

      // Perform swap
      let temp = currentArray[i];
      currentArray[i] = currentArray[minIdx];
      currentArray[minIdx] = temp;

      // Post swap frame
      swapArray = currentArray.map((item, idx) => {
        let status: 'default' | 'comparing' | 'swapping' | 'sorted' = 'default';
        if (sortedIndices.includes(idx)) {
          status = 'sorted';
        } else if (idx === minIdx || idx === i) {
          status = 'swapping';
        }
        return { ...item, status };
      });
      frames.push({
        array: swapArray,
        highlightedMarker: '@swap'
      });
    }

    sortedIndices.push(i);
    pushFrame(currentArray, '@outer-loop', sortedIndices);
  }

  // Final sorted frame
  let finalArray: ArrayItem[] = currentArray.map(item => ({ ...item, status: 'sorted' }));
  frames.push({
    array: finalArray,
    highlightedMarker: '@outer-loop'
  });

  return frames;
}

const generateListFrames = (list: NodeItem[], insertedNodeId: string | null = null): VisualizerFrame[] => {
  let frames: VisualizerFrame[] = [];
  
  // Frame 0: Initial state
  frames.push({
    nodes: list.map(node => ({
      ...node,
      status: (node.id === insertedNodeId ? 'inserted' : 'default') as NodeItem['status']
    })),
    highlightedMarker: '@init'
  });

  // Loop through list to visit nodes
  for (let i = 0; i < list.length; i++) {
    // Frame for visit(current)
    frames.push({
      nodes: list.map((node, idx) => ({
        ...node,
        status: (idx === i ? 'traversing' : 'default') as NodeItem['status']
      })),
      highlightedMarker: '@visit'
    });

    // Frame for current = current.next
    frames.push({
      nodes: list.map((node, idx) => ({
        ...node,
        status: (idx === i ? 'traversing' : 'default') as NodeItem['status']
      })),
      highlightedMarker: '@next'
    });
  }

  // Final Frame: traversal finished
  frames.push({
    nodes: list.map(node => ({ ...node, status: 'default' as NodeItem['status'] })),
    highlightedMarker: '@loop'
  });

  return frames;
};

interface VisualizerSectionProps {
  activeLesson: string | null;
  isActive: boolean;
  stepIndex?: number;
  setStepIndex?: React.Dispatch<React.SetStateAction<number>>;
  isPlaying?: boolean;
  setIsPlaying?: React.Dispatch<React.SetStateAction<boolean>>;
  activeTab?: 'bubble' | 'selection';
  setActiveTab?: React.Dispatch<React.SetStateAction<'bubble' | 'selection'>>;
}

export default function VisualizerSection({
  activeLesson,
  isActive,
  stepIndex: externalStepIndex,
  setStepIndex: externalSetStepIndex,
  isPlaying: externalIsPlaying,
  setIsPlaying: externalSetIsPlaying,
  activeTab: externalActiveTab,
  setActiveTab: externalSetActiveTab
}: VisualizerSectionProps) {
  const [internalActiveTab, setInternalActiveTab] = useState<'bubble' | 'selection'>('bubble');
  const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab;
  const setActiveTab = externalSetActiveTab !== undefined ? externalSetActiveTab : setInternalActiveTab;

  const [internalIsPlaying, setInternalIsPlaying] = useState(false);
  const isPlaying = externalIsPlaying !== undefined ? externalIsPlaying : internalIsPlaying;
  const setIsPlaying = externalSetIsPlaying !== undefined ? externalSetIsPlaying : setInternalIsPlaying;

  const [internalStepIndex, setInternalStepIndex] = useState(0);
  const stepIndex = externalStepIndex !== undefined ? externalStepIndex : internalStepIndex;
  const setStepIndex = externalSetStepIndex !== undefined ? externalSetStepIndex : setInternalStepIndex;

  const [speed, setSpeed] = useState<number | ''>(1);
  const [list, setList] = useState<NodeItem[]>([
    { id: '1', value: '15', status: 'default' },
    { id: '2', value: '30', status: 'default' },
    { id: '3', value: '45', status: 'default' }
  ]);
  const [insertedNodeId, setInsertedNodeId] = useState<string | null>(null);

  // Sync lesson with initial settings
  useEffect(() => {
    if (externalStepIndex !== undefined) return;

    setIsPlaying(false);
    setStepIndex(0);
    if (activeLesson === 'Bubble Sort Visualizer') {
      setActiveTab('bubble');
    } else if (activeLesson === 'Selection Sort Visualizer') {
      setActiveTab('selection');
    }
  }, [activeLesson]);

  // Pause playback when the visualizer section is not active/visible
  useEffect(() => {
    if (!isActive) {
      setIsPlaying(false);
    }
  }, [isActive]);

  // Compute frames based on active lesson / sorting tab
  const frames = useMemo(() => {
    const isSorting = activeLesson === 'Bubble Sort Visualizer' || activeLesson === 'Selection Sort Visualizer';
    if (isSorting) {
      if (activeTab === 'bubble') {
        return generateBubbleSortFrames(DEFAULT_SORTING_ARRAY);
      } else {
        return generateSelectionSortFrames(DEFAULT_SORTING_ARRAY);
      }
    } else if (activeLesson === 'Singly Linked List Visualizer') {
      return generateListFrames(list, insertedNodeId);
    }
    return [];
  }, [activeLesson, activeTab, list, insertedNodeId]);

  // Sync playing playback loop
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
    }, 100 / (typeof speed === 'number' ? speed : 1));

    return () => clearInterval(intervalId);
  }, [isPlaying, speed, frames.length]);

  const handlePlay = () => {
    if (stepIndex >= frames.length - 1) {
      // restart if reached the end
      setStepIndex(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setStepIndex((prev) => {
      if (prev < frames.length - 1) {
        return prev + 1;
      }
      return prev;
    });
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    setStepIndex((prev) => {
      if (prev > 0) {
        return prev - 1;
      }
      return prev;
    });
  };

  const handleTabChange = (newTab: 'bubble' | 'selection') => {
    setIsPlaying(false);
    setStepIndex(0);
    setActiveTab(newTab);
  };

  const handleListChange = (newList: NodeItem[], insertedId: string | null) => {
    setIsPlaying(false);
    setStepIndex(0);
    setList(newList);
    setInsertedNodeId(insertedId);
  };

  const currentFrame = frames[stepIndex] || { highlightedLine: 1 };
  const isSorting = activeLesson === 'Bubble Sort Visualizer' || activeLesson === 'Selection Sort Visualizer';
  
  const codeType = isSorting
    ? activeTab
    : 'linked-list';

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Playback Controls & Frame step info */}
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

      {/* Side-by-Side Flex/Grid Layout */}
      <div className="flex flex-col lg:flex-row gap-8 lg:items-stretch">
        {/* Active Visualizer Panel */}
        <div className="flex-1 w-full bg-paper border border-charcoal/10 rounded-3xl p-6 md:p-8 shadow-sm">
          <h3 className="font-editorial text-xl font-bold text-charcoal mb-4">Visual Sandbox</h3>
          {isSorting ? (
            <SortingVisualizer
              activeTab={activeTab}
              currentArrayState={currentFrame.array || []}
              onTabChange={handleTabChange}
            />
          ) : (
            <LinkedListVisualizer
              list={list}
              onListChange={handleListChange}
              currentNodesState={currentFrame.nodes || []}
            />
          )}
        </div>

        {/* Code Viewer Panel */}
        <div className="w-full lg:w-[480px] shrink-0 bg-paper border border-charcoal/10 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col">
          <h3 className="font-editorial text-xl font-bold text-charcoal mb-4">Implementation</h3>
          <CodeViewer
            codeType={codeType}
            highlightedMarker={currentFrame.highlightedMarker}
          />
        </div>
      </div>
    </div>
  );
}
