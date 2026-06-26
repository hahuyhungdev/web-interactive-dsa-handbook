import { useMemo } from 'react';
import { SortingVisualizer } from './SortingVisualizer';
import { CodeViewer } from '@/features/theory/components/CodeViewer';
import { PlaybackControls } from '@/shared/components/ui/PlaybackControls';
import { usePlayback } from '@/shared/hooks/usePlayback';
import { generateBubbleSortFrames, generateSelectionSortFrames, DEFAULT_SORTING_ARRAY } from '../utils/generateFrames';

interface SortingWorkspaceProps {
  activeTab: 'bubble' | 'selection';
  onTabChange: (tab: 'bubble' | 'selection') => void;
}

export function SortingWorkspace({ activeTab, onTabChange }: SortingWorkspaceProps) {
  const frames = useMemo(() => {
    return activeTab === 'bubble'
      ? generateBubbleSortFrames(DEFAULT_SORTING_ARRAY)
      : generateSelectionSortFrames(DEFAULT_SORTING_ARRAY);
  }, [activeTab]);

  const playback = usePlayback({
    totalFrames: frames.length,
    speed: 1,
    isActive: true,
  });

  const handleTabChange = (newTab: 'bubble' | 'selection') => {
    playback.reset();
    onTabChange(newTab);
  };

  const currentFrame = frames[playback.stepIndex] || { highlightedLine: 1 };

  return (
    <div className="flex flex-col gap-8 w-full">
      <PlaybackControls
        isPlaying={playback.isPlaying}
        onPlay={playback.handlePlay}
        onPause={playback.handlePause}
        onStepForward={playback.handleStepForward}
        onStepBackward={playback.handleStepBackward}
        speed={1}
        onSpeedChange={() => {}}
        stepIndex={playback.stepIndex}
        totalSteps={Math.max(0, frames.length - 1)}
      />

      <div className="flex flex-col lg:flex-row gap-8 lg:items-stretch">
        <div className="flex-1 w-full bg-paper border border-charcoal/10 rounded-3xl p-6 md:p-8 shadow-sm">
          <h3 className="font-editorial text-xl font-bold text-charcoal mb-4">Visual Sandbox</h3>
          <SortingVisualizer
            activeTab={activeTab}
            currentArrayState={currentFrame.array || []}
            onTabChange={handleTabChange}
          />
        </div>

        <div className="w-full lg:w-[480px] shrink-0 bg-paper border border-charcoal/10 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col">
          <h3 className="font-editorial text-xl font-bold text-charcoal mb-4">Implementation</h3>
          <CodeViewer
            codeType={activeTab}
            highlightedMarker={currentFrame.highlightedMarker}
          />
        </div>
      </div>
    </div>
  );
}
