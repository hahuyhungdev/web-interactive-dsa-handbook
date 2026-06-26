import { StackQueueWorkspace } from "./components/StackQueueWorkspace";

/**
 * Compound component — owns stack/queue state internally.
 * Page renders this single component with zero props.
 */
export function StackQueueSection() {
  return (
    <section
      id="stack-queue-visualizer-section"
      className="border border-charcoal/10 rounded-3xl p-8 bg-paper-light shadow-premium"
    >
      <h2 className="font-editorial text-3xl font-bold text-charcoal mb-6">
        Stack &amp; Queue Visualizer
      </h2>
      <StackQueueWorkspace />
    </section>
  );
}
