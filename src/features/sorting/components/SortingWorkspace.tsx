import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SortingVisualizer } from "./SortingVisualizer";
import { SortingArrayEditor } from "./SortingArrayEditor";
import { CodeViewer } from "@/features/theory/components/CodeViewer";
import { PlaybackControls } from "@/shared/components/ui/PlaybackControls";
import { usePlayback } from "@/shared/hooks/usePlayback";
import { usePlaybackKeyboard } from "@/shared/hooks/usePlaybackKeyboard";
import { DEFAULT_SORTING_ARRAY } from "../utils/generateFrames";
import { getSortAlgo, type SortAlgoId } from "../sortRegistry";

interface SortingWorkspaceProps {
  activeTab: SortAlgoId;
  onTabChange: (tab: SortAlgoId) => void;
}

export function SortingWorkspace({
  activeTab,
  onTabChange,
}: SortingWorkspaceProps) {
  const [speed, setSpeed] = useState<number | "">(1);
  const [array, setArray] = useState<number[]>(DEFAULT_SORTING_ARRAY);

  // Collapsible code panel state
  const [isCodeCollapsed, setIsCodeCollapsed] = useState(false);

  const algo = getSortAlgo(activeTab);
  const frames = useMemo(() => algo.generate(array), [algo, array]);

  const playback = usePlayback({
    totalFrames: frames.length,
    speed,
    isActive: true,
  });

  usePlaybackKeyboard(playback, {
    totalFrames: frames.length,
    speed,
    setSpeed,
  });

  const handleTabChange = (newTab: SortAlgoId) => {
    playback.reset();
    onTabChange(newTab);
  };

  const handleArrayChange = (next: number[]) => {
    playback.reset();
    setArray(next);
  };

  const currentFrame = frames[playback.stepIndex] || { highlightedLine: 1 };

  // Calculate active line for HUD
  const activeLineIdx = useMemo(() => {
    if (!currentFrame.highlightedMarker) return -1;
    return algo.code.findIndex((line) => line.includes(currentFrame.highlightedMarker));
  }, [currentFrame.highlightedMarker, algo.code]);

  const activeLineNum = activeLineIdx !== -1 ? activeLineIdx + 1 : 0;
  const activeLineCode = useMemo(() => {
    if (activeLineIdx === -1) return '';
    return algo.code[activeLineIdx].replace(/\s*\/\/\s*@[\w-]+/, '').trim();
  }, [activeLineIdx, algo.code]);

  return (
    <div className="flex flex-col gap-6 w-full">
      <SortingArrayEditor array={array} onChange={handleArrayChange} />

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

      <div className="flex flex-col lg:flex-row gap-6 lg:items-stretch">
        <div className="flex-1 w-full min-w-0 bg-gradient-to-br from-paper to-paper-light border border-charcoal/10 rounded-3xl p-5 sm:p-6 md:p-8 shadow-premium flex flex-col justify-between">
          <div>
            <h3 className="font-editorial text-xl sm:text-2xl font-bold text-charcoal mb-4">
              Visual Sandbox
            </h3>
            <SortingVisualizer
              activeTab={activeTab}
              currentArrayState={currentFrame.array || []}
              onTabChange={handleTabChange}
            />
          </div>
          {isCodeCollapsed && activeLineCode && (
            <div className="mt-6 bg-paper-dark/65 border border-coral/20 rounded-2xl px-5 py-3 shadow-inner flex items-center gap-3">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest bg-coral/10 text-coral px-2.5 py-1 rounded-lg">
                Line {activeLineNum}
              </span>
              <span className="font-mono text-sm text-charcoal truncate flex-1 font-semibold">
                {activeLineCode}
              </span>
            </div>
          )}
        </div>

        {!isCodeCollapsed ? (
          <div className="w-full lg:w-[390px] shrink-0 bg-gradient-to-br from-paper to-paper-light border border-charcoal/10 rounded-3xl p-5 sm:p-6 md:p-8 shadow-premium flex flex-col transition-all duration-300 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-editorial text-xl sm:text-2xl font-bold text-charcoal">
                Implementation
              </h3>
              <button
                onClick={() => setIsCodeCollapsed(true)}
                title="Collapse Code Panel"
                className="p-1.5 rounded-lg border border-charcoal/15 bg-paper hover:bg-charcoal/5 text-charcoal transition-spring hover-spring active-spring"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <CodeViewer
              codeLines={algo.code}
              fileName={algo.fileName}
              highlightedMarker={currentFrame.highlightedMarker}
            />
          </div>
        ) : (
          <div
            onClick={() => setIsCodeCollapsed(false)}
            title="Expand Code Panel"
            className="hidden lg:flex w-[48px] shrink-0 bg-paper border border-charcoal/10 rounded-3xl p-3 shadow-sm flex flex-col items-center justify-start cursor-pointer hover:bg-charcoal/5 group transition-all duration-300"
          >
            <button className="p-1 rounded-lg border border-charcoal/15 bg-paper group-hover:bg-charcoal/10 text-charcoal mb-8">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <div className="text-[10px] font-sans font-extrabold uppercase tracking-widest text-charcoal/30 select-none whitespace-nowrap rotate-90 mt-16 origin-center">
              Code Viewer
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
