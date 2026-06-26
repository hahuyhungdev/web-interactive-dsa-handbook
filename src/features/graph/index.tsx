import { GraphWorkspace } from './components/GraphWorkspace';

export function GraphSection() {
  return (
    <section id="graph-visualizer-section" className="border border-charcoal/10 rounded-3xl p-8 bg-paper-light shadow-premium">
      <h2 className="font-editorial text-3xl font-bold text-charcoal mb-6">Graph Traversal Visualizer</h2>
      <GraphWorkspace />
    </section>
  );
}
