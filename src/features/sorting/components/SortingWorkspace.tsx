import { useMemo, useState } from "react";
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

      <div className="flex flex-col lg:flex-row gap-8 lg:items-stretch">
        <div className="flex-1 w-full bg-paper border border-charcoal/10 rounded-3xl p-6 md:p-8 shadow-sm">
          <h3 className="font-editorial text-xl font-bold text-charcoal mb-4">
            Visual Sandbox
          </h3>
          <SortingVisualizer
            activeTab={activeTab}
            currentArrayState={currentFrame.array || []}
            onTabChange={handleTabChange}
          />
        </div>

        <div className="w-full lg:w-[480px] shrink-0 bg-paper border border-charcoal/10 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col">
          <h3 className="font-editorial text-xl font-bold text-charcoal mb-4">
            Implementation
          </h3>
          <CodeViewer
            codeLines={algo.code}
            fileName={algo.fileName}
            highlightedMarker={currentFrame.highlightedMarker}
          />
        </div>
      </div>
    </div>
  );
}
