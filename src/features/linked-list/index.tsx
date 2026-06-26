import { LinkedListWorkspace } from "./components/LinkedListWorkspace";

/**
 * Compound component — composes linked-list internals.
 * Page renders this single component with zero props.
 */
export function LinkedListSection() {
  return (
    <section id="linked-list-visualizer-section" className="border border-charcoal/10 rounded-3xl p-8 bg-paper-light shadow-premium">
      <h2 className="font-editorial text-3xl font-bold text-charcoal mb-6">
        Singly Linked List Visualizer
      </h2>
      <LinkedListWorkspace />
    </section>
  );
}
