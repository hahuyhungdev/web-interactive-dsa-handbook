import { HashTableWorkspace } from './components/HashTableWorkspace';

export function HashTableSection() {
  return (
    <section
      id="hash-table-visualizer-section"
      className="border border-charcoal/10 rounded-3xl p-8 bg-paper-light shadow-premium"
    >
      <h2 className="font-editorial text-3xl font-bold text-charcoal mb-6">
        Hash Table Visualizer
      </h2>
      <HashTableWorkspace />
    </section>
  );
}
