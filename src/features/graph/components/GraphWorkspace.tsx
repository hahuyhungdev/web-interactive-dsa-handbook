import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GraphVisualizer } from './GraphVisualizer';
import { CodeViewer } from '@/features/theory/components/CodeViewer';
import { PlaybackControls } from '@/shared/components/ui/PlaybackControls';
import { usePlayback } from '@/shared/hooks/usePlayback';
import { usePlaybackKeyboard } from '@/shared/hooks/usePlaybackKeyboard';
import {
  buildDefaultGraph,
  generateBFSFrames,
  generateDFSFrames,
} from '../utils/generateFrames';
import { BFS_CODE, DFS_CODE } from '../utils/graphCode';

type AlgoId = 'bfs' | 'dfs';

export function GraphWorkspace() {
  const [activeAlgo, setActiveAlgo] = useState<AlgoId>('bfs');
  const [speed, setSpeed] = useState<number | ''>(1);
  const [startNode, setStartNode] = useState('A');

  // Collapsible code panel state
  const [isCodeCollapsed, setIsCodeCollapsed] = useState(false);

  const { nodes, edges, adjacency } = useMemo(() => buildDefaultGraph(), []);

  const frames = useMemo(() => {
    if (activeAlgo === 'bfs') {
      return generateBFSFrames(nodes, edges, adjacency, startNode);
    }
    return generateDFSFrames(nodes, edges, adjacency, startNode);
  }, [activeAlgo, nodes, edges, adjacency, startNode]);

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

  const handleAlgoChange = (algo: AlgoId) => {
    playback.reset();
    setActiveAlgo(algo);
  };

  const handleStartNodeChange = (nodeId: string) => {
    playback.reset();
    setStartNode(nodeId);
  };

  const currentFrame = frames[playback.stepIndex] || frames[0];
  const codeLines = activeAlgo === 'bfs' ? BFS_CODE : DFS_CODE;
  const fileName = activeAlgo === 'bfs' ? 'bfs.js' : 'dfs.js';

  // Calculate active line for HUD
  const activeLineIdx = useMemo(() => {
    if (!currentFrame.highlightedMarker) return -1;
    return codeLines.findIndex((line) => line.includes(currentFrame.highlightedMarker));
  }, [currentFrame.highlightedMarker, codeLines]);

  const activeLineNum = activeLineIdx !== -1 ? activeLineIdx + 1 : 0;
  const activeLineCode = useMemo(() => {
    if (activeLineIdx === -1) return '';
    return codeLines[activeLineIdx].replace(/\s*\/\/\s*@[\w-]+/, '').trim();
  }, [activeLineIdx, codeLines]);

  return (
    <div className="flex flex-col gap-6 w-full">
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
        <div className="flex-1 w-full min-w-0 bg-paper border border-charcoal/10 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-editorial text-xl font-bold text-charcoal mb-4">
              Visual Sandbox
            </h3>
            <GraphVisualizer
              frame={currentFrame}
              activeAlgo={activeAlgo}
              startNode={startNode}
              onAlgoChange={handleAlgoChange}
              onStartNodeChange={handleStartNodeChange}
            />
          </div>
          {isCodeCollapsed && activeLineCode && (
            <div className="mt-6 bg-paper-dark border border-coral/20 rounded-2xl px-5 py-3 shadow-inner flex items-center gap-3">
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
          <div className="w-full lg:w-[390px] shrink-0 bg-paper border border-charcoal/10 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col transition-all duration-300 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-editorial text-xl font-bold text-charcoal">
                Implementation
              </h3>
              <button
                onClick={() => setIsCodeCollapsed(true)}
                title="Collapse Code Panel"
                className="p-1.5 rounded-lg border border-charcoal/15 bg-paper hover:bg-charcoal/5 text-charcoal transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <CodeViewer
              codeLines={codeLines}
              fileName={fileName}
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
