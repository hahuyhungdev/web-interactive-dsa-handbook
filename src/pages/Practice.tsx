import PracticeSection from '../components/PracticeSection';

interface PracticeProps {
  activeLesson: string | null;
}

export default function Practice({ activeLesson }: PracticeProps) {
  return (
    <section id="practice-challenge-section" className="border border-charcoal/10 rounded-3xl p-8 bg-paper-light shadow-premium">
      <h2 className="font-editorial text-3xl font-bold text-charcoal mb-4">
        {activeLesson && activeLesson.startsWith('Challenge:') ? activeLesson : 'Challenge: Two Sum'}
      </h2>
      <PracticeSection activeLesson={activeLesson && activeLesson.startsWith('Challenge:') ? activeLesson : 'Challenge: Two Sum'} />
    </section>
  );
}
