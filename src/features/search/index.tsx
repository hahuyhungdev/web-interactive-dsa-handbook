import { SearchVisualizer } from "./components/SearchVisualizer";

/**
 * Compound component — composes search internals.
 * Page renders this single component with zero props.
 */
export function SearchSection() {
  return (
    <section id="search-visualizer-section" className="border border-charcoal/10 rounded-3xl p-8 bg-paper-light shadow-premium">
      <h2 className="font-editorial text-3xl font-bold text-charcoal mb-6">
        Linear Search & Binary Search Visualizer
      </h2>
      <SearchVisualizer />
    </section>
  );
}
