import { useState, useMemo, useEffect } from 'react';
import { LinkedListVisualizer } from './LinkedListVisualizer';
import { CodeViewer } from '@/features/theory/components/CodeViewer';
import { PlaybackControls } from '@/shared/components/ui/PlaybackControls';
import { usePlayback } from '@/shared/hooks/usePlayback';
import { generateListFrames } from '../utils/generateFrames';
import type { NodeItem } from '@/shared/types';

export function LinkedListWorkspace() {
  const [list, setList] = useState<NodeItem[]>([
    { id: '1', value: '15', status: 'default' },
    { id: '2', value: '30', status: 'default' },
    { id: '3', value: '45', status: 'default' }
  ]);
  const [insertedNodeId, setInsertedNodeId] = useState<string | null>(null);

  const frames = useMemo(() => generateListFrames(list, insertedNodeId), [list, insertedNodeId]);

  const playback = usePlayback({
    totalFrames: frames.length,
    speed: 1,
    isActive: true,
  });

  const handleListChange = (newList: NodeItem[], insertedId: string | null) => {
    playback.reset();
    setList(newList);
    setInsertedNodeId(insertedId);
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
          <LinkedListVisualizer
            list={list}
            onListChange={handleListChange}
            currentNodesState={currentFrame.nodes || []}
          />
        </div>

        <div className="w-full lg:w-[480px] shrink-0 bg-paper border border-charcoal/10 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col">
          <h3 className="font-editorial text-xl font-bold text-charcoal mb-4">Implementation</h3>
          <CodeViewer
            codeType="linked-list"
            highlightedMarker={currentFrame.highlightedMarker}
          />
        </div>
      </div>
    </div>
  );
}
