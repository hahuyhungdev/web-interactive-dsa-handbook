import { useParams } from 'react-router-dom';
import { PracticeChallengeSection } from '@/features/practice';

export function PracticePage() {
  const { challengeId } = useParams<{ challengeId: string }>();

  // Map URL param to lesson title
  const lessonMap: Record<string, string> = {
    'two-sum': 'Challenge: Two Sum',
    'find-max': 'Challenge: Max Value in Array',
    'reverse-list': 'Challenge: Reverse Linked List',
    'binary-search': 'Challenge: Binary Search',
    'valid-parentheses': 'Challenge: Valid Parentheses',
  };

  const activeLesson = challengeId ? lessonMap[challengeId] ?? 'Challenge: Two Sum' : 'Challenge: Two Sum';
  return <PracticeChallengeSection activeLesson={activeLesson} />;
}
