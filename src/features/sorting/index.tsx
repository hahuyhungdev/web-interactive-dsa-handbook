import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SortingWorkspace } from "./components/SortingWorkspace";
import {
  DEFAULT_SORT_ALGO_ID,
  getSortAlgo,
  isSortAlgoId,
  type SortAlgoId,
} from "./sortRegistry";

/**
 * Compound component — owns sorting state internally.
 * Page renders this single component with zero props.
 */
export function SortingSection() {
  const [searchParams] = useSearchParams();
  const urlAlgo = searchParams.get("algo");
  const [activeTab, setActiveTab] = useState<SortAlgoId>(
    isSortAlgoId(urlAlgo) ? urlAlgo : DEFAULT_SORT_ALGO_ID,
  );

  // Keep the active tab in sync when the URL deep-links to an algorithm
  // (e.g. selecting a different sort lesson from the sidebar).
  useEffect(() => {
    if (isSortAlgoId(urlAlgo)) setActiveTab(urlAlgo);
  }, [urlAlgo]);

  const title = `${getSortAlgo(activeTab).label} Visualizer`;

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
