import type { ArrayItem } from "@/shared/types";
import { motion } from "motion/react";
import { SORT_ALGOS, type SortAlgoId } from "../sortRegistry";

interface SortingVisualizerProps {
  activeTab: SortAlgoId;
  currentArrayState: ArrayItem[];
  onTabChange: (tab: SortAlgoId) => void;
}

/**
 * Per-status bar styling. Kept as a lookup so the render path stays flat and
 * every state reads as an intentional, designed treatment (not a default).
 */
const STATUS_STYLE: Record<
  ArrayItem["status"],
  { bar: string; label: string }
> = {
  default: { bar: "bg-charcoal/25", label: "text-charcoal/50" },
  comparing: {
    bar: "bg-amber-400 shadow-[0_0_0_3px_rgba(251,191,36,0.25)]",
    label: "text-amber-600",
  },
  swapping: {
    bar: "bg-coral shadow-[0_0_0_3px_rgba(255,111,97,0.25)]",
    label: "text-coral",
  },
  pivot: {
    bar: "bg-violet-500 shadow-[0_0_0_3px_rgba(139,92,246,0.25)]",
    label: "text-violet-600",
  },
  sorted: { bar: "bg-emerald-500", label: "text-emerald-600" },
};

export function SortingVisualizer({
  activeTab,
  currentArrayState,
  onTabChange,
}: SortingVisualizerProps) {
  const maxValue = currentArrayState.reduce(
    (m, item) => Math.max(m, item.value),
    1,
  );
  // Reserve headroom for the numeric label above each bar.
  const usableHeight = 168;
  const scale = usableHeight / maxValue;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Selection Tabs — generated from the registry */}
      <div className="flex flex-wrap gap-3 border-b border-charcoal/10 pb-4">
        {SORT_ALGOS.map((algo) => {
          const isActive = activeTab === algo.id;
          return (
            <button
              key={algo.id}
              id={`btn-select-${algo.id}-sort`}
              onClick={() => {
                if (!isActive) onTabChange(algo.id);
              }}
              title={`${algo.label} · ${algo.complexity}`}
              aria-pressed={isActive}
              className={`px-4 py-2 rounded-xl font-sans text-base font-bold uppercase tracking-wider transition-all duration-300 ${
                isActive
                  ? "bg-coral text-paper shadow-sm"
                  : "border border-charcoal/20 bg-transparent hover:bg-charcoal/5 text-charcoal"
              }`}
            >
              {algo.label}
              <span
                className={`ml-2 normal-case font-mono text-xs ${
                  isActive ? "text-paper/80" : "text-charcoal/50"
                }`}
              >
                {algo.complexity}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Visualizer Sub-container */}
      <div id={`sorting-visualizer-${activeTab}`} className="w-full">
        <div
          id="sorting-visualizer-container"
          className="flex items-end justify-center gap-2 bg-paper-dark border border-charcoal/10 rounded-3xl p-8 h-64 min-w-[280px] overflow-hidden"
        >
          {currentArrayState.map((item, idx) => {
            const style = STATUS_STYLE[item.status] ?? STATUS_STYLE.default;
            const barHeight = Math.max(18, item.value * scale);

            return (
              <motion.div
                key={item.index}
                layout="position"
                transition={{
                  type: "spring",
                  stiffness: 520,
                  damping: 34,
                  mass: 0.7,
                }}
                className="array-bar flex flex-col items-center justify-end gap-1.5"
                data-value={item.value}
                data-index={idx}
                data-status={item.status}
              >
                <span
                  className={`font-mono text-sm font-bold tabular-nums transition-colors duration-200 ${style.label}`}
                >
                  {item.value}
                </span>
                <div
                  className={`w-10 rounded-t-md transition-[background-color,box-shadow] duration-200 ${style.bar}`}
                  style={{ height: `${barHeight}px` }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
