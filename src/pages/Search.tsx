import SearchVisualizer from '../components/SearchVisualizer';

interface SearchProps {
  activeLesson: string | null;
}

export default function Search({ activeLesson }: SearchProps) {
  return (
    <section id="sorting-visualizer-section" className="border border-charcoal/10 rounded-3xl p-8 bg-paper-light shadow-premium">
      <h2 className="font-editorial text-3xl font-bold text-charcoal mb-6">
        Linear Search & Binary Search Visualizer
      </h2>
      <SearchVisualizer />
    </section>
  );
}
