import type { ArrayItem } from '@/shared/types';

interface SortingVisualizerProps {
  activeTab: string;
  currentArrayState: ArrayItem[];
  onTabChange: (tab: 'bubble' | 'selection') => void;
}

export function SortingVisualizer({
  activeTab,
  currentArrayState,
  onTabChange
}: SortingVisualizerProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Selection Tabs */}
      <div className="flex gap-4 border-b border-charcoal/10 pb-4">
        <button
          id="btn-select-bubble-sort"
          onClick={() => {
            if (activeTab !== 'bubble') {
              onTabChange('bubble');
            }
          }}
          className={`px-4 py-2 rounded-xl font-sans text-base font-bold uppercase tracking-wider transition-all duration-300 ${
            activeTab === 'bubble'
              ? 'bg-coral text-paper shadow-sm'
              : 'border border-charcoal/20 bg-transparent hover:bg-charcoal/5 text-charcoal'
          }`}
        >
          Bubble Sort
        </button>
        <button
          id="btn-select-selection-sort"
          onClick={() => {
            if (activeTab !== 'selection') {
              onTabChange('selection');
            }
          }}
          className={`px-4 py-2 rounded-xl font-sans text-base font-bold uppercase tracking-wider transition-all duration-300 ${
            activeTab === 'selection'
              ? 'bg-coral text-paper shadow-sm'
              : 'border border-charcoal/20 bg-transparent hover:bg-charcoal/5 text-charcoal'
          }`}
        >
          Selection Sort
        </button>
      </div>

      {/* Active Visualizer Sub-container */}
      <div
        id={activeTab === 'bubble' ? "sorting-visualizer-bubble" : "sorting-visualizer-selection"}
        className="w-full"
      >
        <div
          id="sorting-visualizer-container"
          className="flex items-end justify-center gap-2 bg-paper-dark border border-charcoal/10 rounded-3xl p-8 h-64 min-w-[280px]"
        >
          {currentArrayState.map((item, idx) => {
            let barColor = 'bg-charcoal/30';
            if (item.status === 'comparing') {
              barColor = 'bg-amber-400';
            } else if (item.status === 'swapping') {
              barColor = 'bg-coral';
            } else if (item.status === 'sorted') {
              barColor = 'bg-emerald-500';
            }

            return (
              <div
                key={`${item.index}-${idx}`}
                className="array-bar w-10 transition-all duration-200 rounded-t-lg flex flex-col items-center justify-end text-base font-mono font-bold text-charcoal pb-2 h-full"
                style={{
                  height: `${Math.max(20, item.value * 3.5)}px`,
                }}
                data-value={item.value}
                data-index={idx}
                data-status={item.status}
              >
                <span className="bg-paper px-1 py-0.5 rounded border border-charcoal/10 shadow-sm mb-1.5 font-mono text-base">
                  {item.value}
                </span>
                <div className={`w-full h-full rounded-t-md transition-colors duration-200 ${barColor}`}></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
