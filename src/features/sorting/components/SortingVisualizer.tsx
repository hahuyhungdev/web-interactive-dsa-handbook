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
  default: {
    bar: "bg-gradient-to-t from-charcoal/15 to-charcoal/25 hover:from-charcoal/25 hover:to-charcoal/35 border border-charcoal/5 shadow-sm",
    label: "text-charcoal/50",
  },
  comparing: {
    bar: "bg-gradient-to-t from-amber-400 to-amber-300 shadow-[0_4px_12px_rgba(251,191,36,0.3)] border border-amber-500/20",
    label: "text-amber-600 font-extrabold",
  },
  swapping: {
    bar: "bg-gradient-to-t from-coral to-coral-light shadow-[0_4px_12px_rgba(224,83,66,0.3)] border border-coral-dark/20",
    label: "text-coral font-extrabold",
  },
  pivot: {
    bar: "bg-gradient-to-t from-violet-600 to-violet-400 shadow-[0_4px_12px_rgba(139,92,246,0.3)] border border-violet-700/20",
    label: "text-violet-600 font-extrabold",
  },
  sorted: {
    bar: "bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-[0_4px_12px_rgba(16,185,129,0.25)] border border-emerald-700/20",
    label: "text-emerald-600 font-extrabold",
  },
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
      <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-none border-b border-charcoal/10 w-full flex-nowrap -mx-6 px-6 md:-mx-8 md:px-8 lg:mx-0 lg:px-0 lg:flex-wrap">
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
              className={`px-4 py-2 rounded-xl font-sans text-sm sm:text-base font-bold uppercase tracking-wider transition-spring hover-spring active-spring shrink-0 ${
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
      <div id={`sorting-visualizer-${activeTab}`} className="w-full mt-2">
        <div
          id="sorting-visualizer-container"
          className="flex items-end justify-start sm:justify-center gap-1.5 sm:gap-2.5 glass-panel-dark border border-charcoal/10 rounded-3xl p-8 h-64 min-w-[280px] overflow-x-auto shadow-inner"
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
                data-element-type="array-item"
                data-value={item.value}
                data-index={idx}
                data-status={item.status}
              >
                <span
                  className={`font-mono text-xs sm:text-sm font-bold tabular-nums transition-colors duration-200 ${style.label}`}
                >
                  {item.value}
                </span>
                <div
                  className={`w-7 sm:w-11 rounded-t-lg transition-all duration-300 ${style.bar}`}
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
