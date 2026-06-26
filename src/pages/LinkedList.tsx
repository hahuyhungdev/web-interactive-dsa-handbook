import VisualizerSection from '../components/VisualizerSection';

interface LinkedListProps {
  activeLesson: string | null;
}

export default function LinkedList({ activeLesson }: LinkedListProps) {
  return (
    <section id="linked-list-visualizer-section" className="border border-charcoal/10 rounded-3xl p-8 bg-paper-light shadow-premium">
      <h2 className="font-editorial text-3xl font-bold text-charcoal mb-6">
        Singly Linked List Visualizer
      </h2>
      <VisualizerSection
        activeLesson="Singly Linked List Visualizer"
        isActive={true}
      />
    </section>
  );
}
