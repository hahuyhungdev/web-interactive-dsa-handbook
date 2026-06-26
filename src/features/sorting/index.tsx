import { useState } from "react";
import { SortingWorkspace } from "./components/SortingWorkspace";

/**
 * Compound component — owns sorting state internally.
 * Page renders this single component with zero props.
 */
export function SortingSection() {
  const [activeTab, setActiveTab] = useState<'bubble' | 'selection'>('bubble');
  const title = activeTab === 'bubble' ? 'Bubble Sort Visualizer' : 'Selection Sort Visualizer';

  return (
    <section
      id="sorting-visualizer-section"
      className="border border-charcoal/10 rounded-3xl p-8 bg-paper-light shadow-premium"
    >
      <h2 className="font-editorial text-3xl font-bold text-charcoal mb-6">
        {title}
      </h2>
      <SortingWorkspace activeTab={activeTab} onTabChange={setActiveTab} />
    </section>
  );
}
