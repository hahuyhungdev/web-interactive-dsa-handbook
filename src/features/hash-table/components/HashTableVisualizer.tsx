import { motion, AnimatePresence } from 'motion/react';
import type { HashBucket, HashEntry, HashTableFrame } from '../utils/generateFrames';

interface HashTableVisualizerProps {
  frame: HashTableFrame;
}

// ── Status-based styles ─────────────────────────────────────────────────────

const BUCKET_STYLE: Record<HashBucket['status'], string> = {
  default: 'border-charcoal/15 bg-paper',
  active: 'border-amber-400 bg-amber-50 shadow-[0_0_12px_rgba(251,191,36,0.25)]',
  collision: 'border-coral bg-coral/5 shadow-[0_0_12px_rgba(255,111,97,0.25)]',
};

const ENTRY_STYLE: Record<HashEntry['status'], { card: string; badge: string }> = {
  default: {
    card: 'bg-paper border-charcoal/10',
    badge: 'bg-charcoal/5 text-charcoal/60',
  },
  hashing: {
    card: 'bg-amber-50 border-amber-300',
    badge: 'bg-amber-100 text-amber-700',
  },
  placed: {
    card: 'bg-emerald-50 border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.2)]',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  collision: {
    card: 'bg-coral/5 border-coral',
    badge: 'bg-coral/10 text-coral',
  },
  found: {
    card: 'bg-emerald-50 border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.2)]',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  searching: {
    card: 'bg-amber-50 border-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.2)]',
    badge: 'bg-amber-100 text-amber-700',
  },
  deleting: {
    card: 'bg-red-50 border-red-400 shadow-[0_0_8px_rgba(239,68,68,0.2)]',
    badge: 'bg-red-100 text-red-700',
  },
};

export function HashTableVisualizer({ frame }: HashTableVisualizerProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Hash computation badge */}
      <AnimatePresence mode="wait">
        {frame.hashComputation && (
          <motion.div
            key={frame.hashComputation}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="font-mono text-sm bg-violet-50 border border-violet-200 text-violet-700 rounded-xl px-4 py-2.5 text-center shadow-sm"
          >
            {frame.hashComputation}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message bar */}
      <motion.div
        key={frame.message}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-sans text-sm text-charcoal/70 bg-paper-dark rounded-xl px-4 py-2 text-center border border-charcoal/5"
      >
        {frame.message}
      </motion.div>

      {/* Bucket columns */}
      <div className="flex gap-4 justify-start md:justify-center items-start overflow-x-auto py-4 px-2 bg-paper-light/50 rounded-2xl border border-charcoal/5 shadow-inner">
        {frame.buckets.map((bucket) => {
          const bucketStyle = BUCKET_STYLE[bucket.status] ?? BUCKET_STYLE.default;
          return (
            <motion.div
              key={bucket.index}
              layout
              className={`flex flex-col items-center gap-3 min-w-[120px] max-w-[160px] flex-1`}
            >
              {/* Index label */}
              <div
                className={`
                  w-full text-center font-mono text-sm font-bold py-2 rounded-xl border-2 transition-all duration-300 shadow-sm
                  ${bucketStyle}
                `}
              >
                <span className="text-charcoal/40 mr-0.5">[</span>
                {bucket.index}
                <span className="text-charcoal/40 ml-0.5">]</span>
              </div>

              {/* Entries stack */}
              <div className="flex flex-col gap-2 w-full min-h-[100px]">
                <AnimatePresence mode="popLayout">
                  {bucket.entries.map((entry) => {
                    const entryStyle =
                      ENTRY_STYLE[entry.status] ?? ENTRY_STYLE.default;
                    return (
                      <motion.div
                        key={`${bucket.index}-${entry.key}`}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8, y: -10 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 25,
                          mass: 0.8,
                        }}
                        className={`
                          rounded-xl border p-3 transition-colors duration-200 shadow-sm
                          ${entryStyle.card}
                        `}
                      >
                        <div
                          title={`Key: ${entry.key}`}
                          className={`
                            text-xs font-mono rounded px-2 py-1 mb-1.5 text-center truncate font-bold
                            ${entryStyle.badge}
                          `}
                        >
                          {entry.key}
                        </div>
                        <div
                          title={`Value: ${entry.value}`}
                          className="text-sm font-sans font-bold text-charcoal text-center truncate"
                        >
                          {entry.value}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Empty bucket indicator */}
                {bucket.entries.length === 0 && (
                  <div className="text-xs font-mono text-charcoal/20 text-center py-6 select-none">
                    empty
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
