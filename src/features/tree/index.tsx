import { TreeWorkspace } from './components/TreeWorkspace';

export function TreeSection() {
  return (
    <section id="tree-visualizer-section" className="border border-charcoal/10 rounded-3xl p-8 bg-paper-light shadow-premium">
      <h2 className="font-editorial text-3xl font-bold text-charcoal mb-6">Binary Search Tree Visualizer</h2>
      <TreeWorkspace />
    </section>
  );
}
