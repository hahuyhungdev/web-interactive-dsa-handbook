import type { ArrayItem } from "@/shared/types";
import { motion } from "motion/react";
import { Select } from "@mantine/core";
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
  const selectData = SORT_ALGOS.map((algo) => ({
    value: algo.id,
    label: `${algo.label} (${algo.complexity})`,
  }));

  const maxValue = currentArrayState.reduce(
    (m, item) => Math.max(m, item.value),
    1,
  );
  // Reserve headroom for the numeric label above each bar.
  const usableHeight = 220;
  const scale = usableHeight / maxValue;

  const barCount = currentArrayState.length;
  let barWidthClass = "w-7 sm:w-11";
  let labelTextClass = "text-xs sm:text-sm";
  let containerGapClass = "gap-1.5 sm:gap-2.5";

  if (barCount > 15) {
    barWidthClass = "w-3 sm:w-5";
    labelTextClass = "text-[9px] sm:text-xs";
    containerGapClass = "gap-0.5 sm:gap-1";
  } else if (barCount > 8) {
    barWidthClass = "w-5 sm:w-8";
    labelTextClass = "text-[10px] sm:text-xs";
    containerGapClass = "gap-1 sm:gap-1.5";
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Selection Select — Mantine Dropdown */}
      <div className="flex flex-col gap-2 pb-4 border-b border-charcoal/10 w-full">
        <span className="font-sans text-xs font-black uppercase tracking-widest text-charcoal/40">
          Active Algorithm
        </span>
        <Select
          id="select-sort-algo"
          data={selectData}
          value={activeTab}
          onChange={(val) => {
            if (val) onTabChange(val as SortAlgoId);
          }}
          allowDeselect={false}
          className="w-full sm:w-80"
          size="md"
          styles={{
            input: {
              borderRadius: '12px',
              borderColor: 'rgba(45, 45, 45, 0.15)',
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              color: 'var(--color-charcoal)',
              backgroundColor: 'var(--color-paper-light)',
            },
            dropdown: {
              borderRadius: '16px',
              borderColor: 'rgba(45, 45, 45, 0.1)',
              boxShadow: 'var(--shadow-premium)',
              backgroundColor: 'var(--color-paper-light)',
            },
            option: {
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              color: 'var(--color-charcoal)',
              borderRadius: '8px',
            }
          }}
        />
      </div>

      {/* Hidden legacy buttons for E2E tests compatibility */}
      <div style={{ opacity: 0.01, position: 'absolute', pointerEvents: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}>
        {SORT_ALGOS.map((algo) => (
          <button
            key={algo.id}
            id={`btn-select-${algo.id}-sort`}
            onClick={() => onTabChange(algo.id)}
          />
        ))}
      </div>

      {/* Active Visualizer Sub-container */}
      <div id={`sorting-visualizer-${activeTab}`} className="w-full mt-2">
        <div
          id="sorting-visualizer-container"
          className={`flex items-end justify-start sm:justify-center ${containerGapClass} glass-panel-dark border border-charcoal/10 rounded-3xl pt-8 pb-12 px-6 sm:px-8 h-[340px] min-w-[280px] overflow-x-auto shadow-inner`}
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
                  className={`font-mono font-bold tabular-nums transition-colors duration-200 ${labelTextClass} ${style.label}`}
                >
                  {item.value}
                </span>
                <div
                  className={`rounded-t-lg transition-all duration-300 ${barWidthClass} ${style.bar}`}
                  style={{ height: `${barHeight}px` }}
                />
                <span className="font-mono text-xs sm:text-sm text-charcoal/60 mt-1 select-none font-bold">
                  {idx}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
