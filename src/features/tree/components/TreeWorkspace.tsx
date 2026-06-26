import { useCallback, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TreeVisualizer } from './TreeVisualizer';
import { CodeViewer } from '@/features/theory/components/CodeViewer';
import { PlaybackControls } from '@/shared/components/ui/PlaybackControls';
import { usePlayback } from '@/shared/hooks/usePlayback';
import { usePlaybackKeyboard } from '@/shared/hooks/usePlaybackKeyboard';
import {
  buildDefaultBST,
  generateInsertFrames,
  generateSearchFrames,
  generateInorderFrames,
  generatePreorderFrames,
  generatePostorderFrames,
  getEdges,
  type TreeNode,
  type TreeFrame,
} from '../utils/generateFrames';
import {
  BST_INSERT_CODE,
  BST_SEARCH_CODE,
  BST_INORDER_CODE,
  BST_PREORDER_CODE,
  BST_POSTORDER_CODE,
} from '../utils/treeCode';

// ── Types ───────────────────────────────────────────────────────────────────

type TreeOp = 'insert' | 'search' | 'inorder' | 'preorder' | 'postorder';

const OP_TABS: { id: TreeOp; label: string }[] = [
  { id: 'insert', label: 'Insert' },
  { id: 'search', label: 'Search' },
  { id: 'inorder', label: 'In-Order' },
  { id: 'preorder', label: 'Pre-Order' },
  { id: 'postorder', label: 'Post-Order' },
];

const CODE_MAP: Record<TreeOp, { code: string[]; fileName: string }> = {
  insert: { code: BST_INSERT_CODE, fileName: 'bstInsert.js' },
  search: { code: BST_SEARCH_CODE, fileName: 'bstSearch.js' },
  inorder: { code: BST_INORDER_CODE, fileName: 'bstInorder.js' },
  preorder: { code: BST_PREORDER_CODE, fileName: 'bstPreorder.js' },
  postorder: { code: BST_POSTORDER_CODE, fileName: 'bstPostorder.js' },
};

// ── Idle Frame Generator ────────────────────────────────────────────────────

function makeIdleFrame(nodes: TreeNode[]): TreeFrame {
  return {
    nodes: nodes.map((n) => ({ ...n, status: 'default' as const })),
    edges: getEdges(nodes),
    highlightedMarker: '',
    message: 'Ready — choose an operation to run on the BST.',
  };
}

// ── Component ───────────────────────────────────────────────────────────────

export function TreeWorkspace() {
  const [activeOp, setActiveOp] = useState<TreeOp>('insert');
  const [speed, setSpeed] = useState<number | ''>(1);
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>(buildDefaultBST);

  // Input state
  const [inputValue, setInputValue] = useState('');

  // Frames state
  const [frames, setFrames] = useState<TreeFrame[]>(() => [makeIdleFrame(treeNodes)]);

  // Collapsible code panel state
  const [isCodeCollapsed, setIsCodeCollapsed] = useState(false);

  // Track pending insert to commit after playback finishes
  const pendingInsert = useRef<{ value: number } | null>(null);

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

  // When playback finishes, commit the new tree structure if it was an insert
  const prevPlaying = useRef(false);
  useMemo(() => {
    if (prevPlaying.current && !playback.isPlaying && pendingInsert.current) {
      const lastFrame = frames[frames.length - 1];
      if (playback.stepIndex >= frames.length - 1 && lastFrame) {
        setTreeNodes(
          lastFrame.nodes.map((n) => ({
            ...n,
            status: 'default' as const,
          }))
        );
        pendingInsert.current = null;
      }
    }
    prevPlaying.current = playback.isPlaying;
  }, [playback.isPlaying, playback.stepIndex, frames]);

  const handleOpChange = useCallback(
    (op: TreeOp) => {
      playback.reset();
      setActiveOp(op);
      setFrames([makeIdleFrame(treeNodes)]);
      pendingInsert.current = null;
    },
    [treeNodes, playback]
  );

  const handleRun = useCallback(() => {
    let newFrames: TreeFrame[];

    if (activeOp === 'insert' || activeOp === 'search') {
      const val = parseInt(inputValue.trim(), 10);
      if (isNaN(val) || val < 1 || val > 999) return;

      if (activeOp === 'insert') {
        newFrames = generateInsertFrames(treeNodes, val);
        pendingInsert.current = { value: val };
      } else {
        newFrames = generateSearchFrames(treeNodes, val);
        pendingInsert.current = null;
      }
    } else {
      pendingInsert.current = null;
      switch (activeOp) {
        case 'inorder':
          newFrames = generateInorderFrames(treeNodes);
          break;
        case 'preorder':
          newFrames = generatePreorderFrames(treeNodes);
          break;
        case 'postorder':
          newFrames = generatePostorderFrames(treeNodes);
          break;
        default:
          return;
      }
    }

    setFrames(newFrames);
    playback.reset();
    // Auto-play after a brief delay
    requestAnimationFrame(() => {
      playback.handlePlay();
    });
  }, [activeOp, treeNodes, inputValue, playback]);

  const handleResetTree = useCallback(() => {
    playback.reset();
    const defaultNodes = buildDefaultBST();
    setTreeNodes(defaultNodes);
    setFrames([makeIdleFrame(defaultNodes)]);
    setInputValue('');
    pendingInsert.current = null;
  }, [playback]);

  const currentFrame = frames[playback.stepIndex] ?? makeIdleFrame(treeNodes);
  const { code, fileName } = CODE_MAP[activeOp];

  // Calculate active line for HUD
  const activeLineIdx = useMemo(() => {
    if (!currentFrame.highlightedMarker) return -1;
    return code.findIndex((line) => line.includes(currentFrame.highlightedMarker));
  }, [currentFrame.highlightedMarker, code]);

  const activeLineNum = activeLineIdx !== -1 ? activeLineIdx + 1 : 0;
  const activeLineCode = useMemo(() => {
    if (activeLineIdx === -1) return '';
    return code[activeLineIdx].replace(/\s*\/\/\s*@[\w-]+/, '').trim();
  }, [activeLineIdx, code]);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Operation tabs */}
      <div className="flex flex-wrap gap-3 border-b border-charcoal/10 pb-4">
        {OP_TABS.map((tab) => {
          const isActive = activeOp === tab.id;
          return (
            <button
              key={tab.id}
              id={`btn-tree-op-${tab.id}`}
              onClick={() => handleOpChange(tab.id)}
              aria-pressed={isActive}
              className={`px-4 py-2 rounded-xl font-sans text-base font-bold uppercase tracking-wider transition-all duration-300 ${
                isActive
                  ? 'bg-coral text-paper shadow-sm'
                  : 'border border-charcoal/20 bg-transparent hover:bg-charcoal/5 text-charcoal'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Input controls & Actions */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-end gap-3">
          {(activeOp === 'insert' || activeOp === 'search') ? (
            <div className="flex flex-col gap-1">
              <label htmlFor="tree-input" className="text-xs font-sans font-bold uppercase tracking-wider text-charcoal/60">
                Node Value (1-999)
              </label>
              <input
                id="tree-input"
                type="number"
                min="1"
                max="999"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleRun(); }}
                placeholder="e.g. 45"
                className="w-36 px-3 py-2 text-sm font-mono border border-charcoal/20 bg-paper rounded-xl focus:outline-none focus:ring-1 focus:ring-coral text-charcoal placeholder:text-charcoal/30"
              />
            </div>
          ) : null}

          {(activeOp === 'insert' || activeOp === 'search') ? (
            <button
              id="btn-tree-run"
              onClick={handleRun}
              disabled={!inputValue.trim()}
              className="px-5 py-2 rounded-xl font-sans text-sm font-bold uppercase tracking-wider transition-all duration-300 bg-charcoal text-paper hover:bg-coral hover:text-paper disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              Run {activeOp}
            </button>
          ) : (
            <button
              id="btn-tree-run-traversal"
              onClick={handleRun}
              className="px-5 py-2 rounded-xl font-sans text-sm font-bold uppercase tracking-wider transition-all duration-300 bg-charcoal text-paper hover:bg-coral hover:text-paper shadow-sm"
            >
              Run Traversal
            </button>
          )}
        </div>

        <button
          id="btn-tree-reset"
          onClick={handleResetTree}
          className="px-5 py-2 rounded-xl font-sans text-sm font-bold uppercase tracking-wider transition-all duration-300 border border-charcoal/20 bg-transparent hover:bg-charcoal/5 text-charcoal shadow-sm"
        >
          Reset Tree
        </button>
      </div>

      {/* Playback controls */}
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

      {/* Visualizer + Code viewer */}
      <div className="flex flex-col lg:flex-row gap-6 lg:items-stretch">
        <div className="flex-1 w-full min-w-0 bg-paper border border-charcoal/10 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-editorial text-xl font-bold text-charcoal mb-4">
              Visual Sandbox
            </h3>
            <TreeVisualizer frame={currentFrame} />
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
          <div className="w-full lg:w-[390px] shrink-0 bg-paper border border-charcoal/10 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col transition-all duration-300">
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
              codeLines={code}
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
