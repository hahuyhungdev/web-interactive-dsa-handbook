import VisualizerSection from '../components/VisualizerSection';

interface SortingProps {
  activeLesson: string | null;
  sortingStepIndex: number;
  setSortingStepIndex: React.Dispatch<React.SetStateAction<number>>;
  sortingIsPlaying: boolean;
  setSortingIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  sortingActiveTab: 'bubble' | 'selection';
  setSortingActiveTab: React.Dispatch<React.SetStateAction<'bubble' | 'selection'>>;
  prevSortingLesson: string | null;
}

export default function Sorting({
  activeLesson,
  sortingStepIndex,
  setSortingStepIndex,
  sortingIsPlaying,
  setSortingIsPlaying,
  sortingActiveTab,
  setSortingActiveTab,
  prevSortingLesson
}: SortingProps) {
  const isCurrentlyActive = activeLesson === 'Bubble Sort Visualizer' || activeLesson === 'Selection Sort Visualizer';
  
  return (
    <section
      id="sorting-visualizer-section"
      className="border border-charcoal/10 rounded-3xl p-8 bg-paper-light shadow-premium"
    >
      <h2 className="font-editorial text-3xl font-bold text-charcoal mb-6">
        {prevSortingLesson || 'Bubble Sort Visualizer'}
      </h2>
      <VisualizerSection
        activeLesson={prevSortingLesson || 'Bubble Sort Visualizer'}
        isActive={isCurrentlyActive}
        stepIndex={sortingStepIndex}
        setStepIndex={setSortingStepIndex}
        isPlaying={sortingIsPlaying}
        setIsPlaying={setSortingIsPlaying}
        activeTab={sortingActiveTab}
        setActiveTab={setSortingActiveTab}
      />
    </section>
  );
}
