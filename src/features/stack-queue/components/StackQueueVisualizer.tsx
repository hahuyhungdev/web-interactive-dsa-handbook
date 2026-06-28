import { motion, AnimatePresence } from "motion/react";
import type { StackQueueFrame } from "../utils/generateFrames";

type Mode = "stack" | "queue";

interface StackQueueVisualizerProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  frame: StackQueueFrame;
}

const STATUS_STYLE: Record<
  StackQueueFrame["elements"][number]["status"],
  { bg: string; text: string }
> = {
  default: {
    bg: "bg-gradient-to-br from-charcoal/80 to-charcoal/95 border border-charcoal/10 shadow-sm",
    text: "text-paper",
  },
  active: {
    bg: "bg-gradient-to-br from-amber-400 to-amber-300 shadow-[0_4px_12px_rgba(251,191,36,0.3)] border border-amber-500",
    text: "text-charcoal font-black",
  },
  removing: {
    bg: "bg-gradient-to-br from-coral to-coral-light shadow-[0_4px_12px_rgba(224,83,66,0.3)] border border-coral-dark",
    text: "text-paper",
  },
  added: {
    bg: "bg-gradient-to-br from-emerald-600 to-emerald-400 shadow-[0_4px_12px_rgba(16,185,129,0.3)] border border-emerald-700",
    text: "text-paper",
  },
};

const MODES: { id: Mode; label: string }[] = [
  { id: "stack", label: "Stack" },
  { id: "queue", label: "Queue" },
];

export function StackQueueVisualizer({
  mode,
  onModeChange,
  frame,
}: StackQueueVisualizerProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Mode Tabs */}
      <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-none border-b border-charcoal/10 w-full flex-nowrap -mx-6 px-6 md:-mx-8 md:px-8 lg:mx-0 lg:px-0 lg:flex-wrap">
        {MODES.map((m) => {
          const isActive = mode === m.id;
          return (
            <button
              key={m.id}
              id={`btn-select-${m.id}`}
              onClick={() => {
                if (!isActive) onModeChange(m.id);
              }}
              aria-pressed={isActive}
              className={`px-4 py-2 rounded-xl font-sans text-sm sm:text-base font-bold uppercase tracking-wider transition-spring hover-spring active-spring shrink-0 ${
                isActive
                  ? "bg-coral text-paper shadow-sm"
                  : "border border-charcoal/20 bg-transparent hover:bg-charcoal/5 text-charcoal"
              }`}
            >
              {m.label}
              <span
                className={`ml-2 normal-case font-mono text-xs ${
                  isActive ? "text-paper/80" : "text-charcoal/50"
                }`}
              >
                {m.id === "stack" ? "LIFO" : "FIFO"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Visualization Container */}
      <div
        id={`sq-visualizer-${mode}`}
        className="w-full glass-panel-dark border border-charcoal/10 rounded-3xl p-8 min-h-[380px] overflow-hidden shadow-inner mt-2"
      >
        {mode === "stack" ? (
          <StackView frame={frame} />
        ) : (
          <QueueView frame={frame} />
        )}
      </div>

      {/* Step Message */}
      <div className="bg-charcoal/[0.03] border border-charcoal/10 rounded-2xl px-5 py-3 font-sans text-sm sm:text-base text-charcoal/80 min-h-[48px] flex items-center shadow-inner mt-4">
        <span className="font-bold text-coral mr-2">›</span>
        {frame.message}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stack: vertical, bottom-up. Top pointer on the topmost element.   */
/* ------------------------------------------------------------------ */

function StackView({ frame }: { frame: StackQueueFrame }) {
  const reversed = [...frame.elements].reverse();

  return (
    <div className="flex flex-col items-center justify-end min-h-[320px]">
      {/* U-shaped Stack Beaker */}
      <div className="border-b-4 border-x-2 border-charcoal/15 rounded-b-3xl px-8 py-6 flex flex-col gap-2.5 items-center min-w-[180px] bg-paper/45 backdrop-blur-sm relative shadow-inner">
        <AnimatePresence mode="popLayout">
          {reversed.map((el, visualIdx) => {
            const logicalIdx = frame.elements.length - 1 - visualIdx;
            const style = STATUS_STYLE[el.status] ?? STATUS_STYLE.default;
            const isTop = logicalIdx === frame.topPointer;

            return (
              <motion.div
                key={`${el.value}-${logicalIdx}`}
                layout
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 40 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  mass: 0.8,
                }}
                className="flex items-center gap-3 relative"
              >
                {/* Pointer label positioned on the left of the container */}
                {isTop && (
                  <span className="absolute -left-14 font-mono text-xs font-bold text-coral animate-pulse whitespace-nowrap select-none">
                    top →
                  </span>
                )}

                {/* Element block */}
                <div
                  className={`w-24 h-14 rounded-2xl flex items-center justify-center font-mono text-xl font-bold transition-all duration-200 ${style.bg} ${style.text}`}
                  data-value={el.value}
                  data-status={el.status}
                >
                  {el.value}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {frame.elements.length === 0 && (
          <div className="text-charcoal/30 font-sans text-sm italic py-12">
            Empty Stack
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Queue: horizontal, left-to-right. Front on left, Rear on right.   */
/* ------------------------------------------------------------------ */

function QueueView({ frame }: { frame: StackQueueFrame }) {
  return (
    <div className="flex flex-col items-center gap-6 min-h-[320px] justify-center">
      {/* Pointer labels row */}
      {frame.elements.length > 0 && (
        <div className="flex items-end gap-3 h-6">
          {frame.elements.map((_, idx) => {
            const isFront = idx === frame.frontPointer;
            const isRear = idx === frame.rearPointer;
            return (
              <div
                key={idx}
                className="w-24 flex justify-center font-mono text-[10px] font-black tracking-wider uppercase text-coral"
              >
                {isFront && isRear ? (
                  <span>front/rear</span>
                ) : isFront ? (
                  <span>front ↓</span>
                ) : isRear ? (
                  <span>↓ rear</span>
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      {/* Pipeline Container with inline badges and overflow support */}
      <div className="flex items-center gap-3 w-full justify-center overflow-x-auto py-2">
        <span className="text-[10px] font-bold text-charcoal/40 font-sans uppercase shrink-0 border border-charcoal/10 px-2.5 py-1.5 bg-paper rounded-xl shadow-sm">out</span>
        <div className="border-y-2 border-charcoal/15 bg-paper/45 backdrop-blur-sm px-6 py-4 flex items-center gap-3 justify-center rounded-lg shadow-inner shrink-0">
          <AnimatePresence mode="popLayout">
            {frame.elements.map((el, idx) => {
              const style = STATUS_STYLE[el.status] ?? STATUS_STYLE.default;

              return (
                <motion.div
                  key={`${el.value}-${idx}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8, x: 40 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -30 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    mass: 0.8,
                  }}
                  className={`w-24 h-14 rounded-2xl flex items-center justify-center font-mono text-xl font-bold transition-all duration-200 shrink-0 ${style.bg} ${style.text}`}
                  data-value={el.value}
                  data-status={el.status}
                >
                  {el.value}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {frame.elements.length === 0 && (
            <div className="text-charcoal/30 font-sans text-sm italic py-6">
              Empty Queue
            </div>
          )}
        </div>
        <span className="text-[10px] font-bold text-charcoal/40 font-sans uppercase shrink-0 border border-charcoal/10 px-2.5 py-1.5 bg-paper rounded-xl shadow-sm">in</span>
      </div>

      {/* Direction indicator */}
      {frame.elements.length > 0 && (
        <div className="flex items-center gap-2 text-charcoal/40 font-mono text-xs mt-2 bg-charcoal/[0.03] px-4 py-1.5 rounded-full border border-charcoal/5">
          <span>← Dequeue (Front)</span>
          <span className="mx-2 text-charcoal/20">|</span>
          <span>Enqueue (Rear) ←</span>
        </div>
      )}
    </div>
  );
}
