import { PracticeSection } from "./components/PracticeSection";

interface PracticeSectionWrapperProps {
  activeLesson: string | null;
}

/**
 * Compound component — composes practice internals.
 * Page renders this single component.
 */
export function PracticeChallengeSection({ activeLesson }: PracticeSectionWrapperProps) {
  const resolvedLesson = activeLesson && activeLesson.startsWith('Challenge:')
    ? activeLesson
    : 'Challenge: Two Sum';

  return (
    <section id="practice-challenge-section" className="border border-charcoal/10 rounded-3xl p-8 bg-paper-light shadow-premium">
      <h2 className="font-editorial text-3xl font-bold text-charcoal mb-4">
        {resolvedLesson.replace('Challenge: ', '')}
      </h2>
      <PracticeSection activeLesson={resolvedLesson} />
    </section>
  );
}
