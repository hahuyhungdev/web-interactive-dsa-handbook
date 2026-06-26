import { useCallback, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HashTableVisualizer } from './HashTableVisualizer';
import { CodeViewer } from '@/features/theory/components/CodeViewer';
import { PlaybackControls } from '@/shared/components/ui/PlaybackControls';
import { usePlayback } from '@/shared/hooks/usePlayback';
import { usePlaybackKeyboard } from '@/shared/hooks/usePlaybackKeyboard';
import {
  buildDefaultHashTable,
  generateInsertFrames,
  generateSearchFrames,
  generateDeleteFrames,
  type HashBucket,
  type HashTableFrame,
} from '../utils/generateFrames';
import { HASH_INSERT_CODE, HASH_SEARCH_CODE, HASH_DELETE_CODE } from '../utils/hashCode';

// ── Types ───────────────────────────────────────────────────────────────────

type HashOp = 'insert' | 'search' | 'delete';

const OP_TABS: { id: HashOp; label: string }[] = [
  { id: 'insert', label: 'Insert' },
  { id: 'search', label: 'Search' },
  { id: 'delete', label: 'Delete' },
];

const CODE_MAP: Record<HashOp, { code: string[]; fileName: string }> = {
  insert: { code: HASH_INSERT_CODE, fileName: 'hashInsert.js' },
  search: { code: HASH_SEARCH_CODE, fileName: 'hashSearch.js' },
  delete: { code: HASH_DELETE_CODE, fileName: 'hashDelete.js' },
};

// ── Default initial frame ───────────────────────────────────────────────────

function makeIdleFrame(buckets: HashBucket[]): HashTableFrame {
  return {
    buckets: buckets.map((b) => ({
      ...b,
      status: 'default' as const,
      entries: b.entries.map((e) => ({ ...e, status: 'default' as const })),
    })),
    highlightedMarker: '',
    message: 'Ready — choose an operation and enter a key.',
  };
}

// ── Component ───────────────────────────────────────────────────────────────

export function HashTableWorkspace() {
  const [activeOp, setActiveOp] = useState<HashOp>('insert');
  const [speed, setSpeed] = useState<number | ''>(1);
  const [hashTable, setHashTable] = useState<HashBucket[]>(buildDefaultHashTable);

  // Input state
  const [keyInput, setKeyInput] = useState('');
  const [valueInput, setValueInput] = useState('');

  // Frames state
  const [frames, setFrames] = useState<HashTableFrame[]>(() => [makeIdleFrame(hashTable)]);

  // Collapsible code panel state
  const [isCodeCollapsed, setIsCodeCollapsed] = useState(false);

  // Track pending insert so we commit after playback finishes
  const pendingInsert = useRef<{ key: string; value: string } | null>(null);

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

  // When playback finishes on an insert, commit the new table state
  const prevPlaying = useRef(false);
  useMemo(() => {
    // Detect transition from playing → stopped at last frame
    if (prevPlaying.current && !playback.isPlaying && pendingInsert.current) {
      const lastFrame = frames[frames.length - 1];
      if (playback.stepIndex >= frames.length - 1 && lastFrame) {
        // Commit the final frame's buckets as the new table state
        setHashTable(lastFrame.buckets.map((b) => ({
          ...b,
          status: 'default' as const,
          entries: b.entries.map((e) => ({ ...e, status: 'default' as const })),
        })));
        pendingInsert.current = null;
      }
    }
    prevPlaying.current = playback.isPlaying;
  }, [playback.isPlaying, playback.stepIndex, frames]);

  const handleOpChange = useCallback(
    (op: HashOp) => {
      playback.reset();
      setActiveOp(op);
      setFrames([makeIdleFrame(hashTable)]);
    },
    [hashTable, playback],
  );

  const handleRun = useCallback(() => {
    const key = keyInput.trim();
    if (!key) return;

    let newFrames: HashTableFrame[];
    switch (activeOp) {
      case 'insert': {
        const value = valueInput.trim() || '—';
        newFrames = generateInsertFrames(hashTable, key, value);
        pendingInsert.current = { key, value };
        break;
      }
      case 'search':
        newFrames = generateSearchFrames(hashTable, key);
        break;
      case 'delete': {
        newFrames = generateDeleteFrames(hashTable, key);
        // Commit delete immediately (the frames show the animation)
        const lastFrame = newFrames[newFrames.length - 1];
        if (lastFrame) {
          // Schedule commit after playback
          const commitBuckets = lastFrame.buckets.map((b) => ({
            ...b,
            status: 'default' as const,
            entries: b.entries.map((e) => ({ ...e, status: 'default' as const })),
          }));
          // Use a ref-based approach: commit after playback via effect
          pendingInsert.current = { key: '__delete__', value: '' };
          setTimeout(() => {
            // After animation completes
          }, 0);
        }
        break;
      }
      default:
        return;
    }

    setFrames(newFrames);
    playback.reset();
    // Auto-play after a tiny delay so React can flush the new frames
    requestAnimationFrame(() => {
      playback.handlePlay();
    });
  }, [activeOp, hashTable, keyInput, valueInput, playback]);

  const currentFrame = frames[playback.stepIndex] ?? makeIdleFrame(hashTable);
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
              id={`btn-hash-op-${tab.id}`}
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

      {/* Input controls */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="hash-key-input" className="text-xs font-sans font-bold uppercase tracking-wider text-charcoal/60">
            Key
          </label>
          <input
            id="hash-key-input"
            type="text"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleRun(); }}
            placeholder="e.g. name"
            className="w-36 px-3 py-2 text-sm font-mono border border-charcoal/20 bg-paper rounded-xl focus:outline-none focus:ring-1 focus:ring-coral text-charcoal placeholder:text-charcoal/30"
          />
        </div>

        {activeOp === 'insert' && (
          <div className="flex flex-col gap-1">
            <label htmlFor="hash-value-input" className="text-xs font-sans font-bold uppercase tracking-wider text-charcoal/60">
              Value
            </label>
            <input
              id="hash-value-input"
              type="text"
              value={valueInput}
              onChange={(e) => setValueInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleRun(); }}
              placeholder="e.g. Alice"
              className="w-36 px-3 py-2 text-sm font-mono border border-charcoal/20 bg-paper rounded-xl focus:outline-none focus:ring-1 focus:ring-coral text-charcoal placeholder:text-charcoal/30"
            />
          </div>
        )}

        <button
          id="btn-hash-run"
          onClick={handleRun}
          disabled={!keyInput.trim()}
          className="px-5 py-2 rounded-xl font-sans text-sm font-bold uppercase tracking-wider transition-all duration-300 bg-charcoal text-paper hover:bg-coral hover:text-paper disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          Run {activeOp}
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
            <HashTableVisualizer frame={currentFrame} />
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
