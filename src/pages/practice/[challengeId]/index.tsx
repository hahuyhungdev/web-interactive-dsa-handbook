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
    'queue-using-stacks': 'Challenge: Implement Queue using Stacks',
    'min-stack': 'Challenge: Min Stack',
    'evaluate-rpn': 'Challenge: Evaluate Reverse Polish Notation',
    'next-greater-element': 'Challenge: Next Greater Element I',
    'remove-duplicates': 'Challenge: Remove Duplicates',
    'merge-sorted-array': 'Challenge: Merge Sorted Array',
    'max-subarray': 'Challenge: Maximum Subarray',
    'sort-colors': 'Challenge: Sort Colors',
    'kth-largest': 'Challenge: Kth Largest Element',
    'top-k-frequent': 'Challenge: Top K Frequent Elements',
    'intersection-arrays': 'Challenge: Intersection of Two Arrays',
    'merge-two-lists': 'Challenge: Merge Two Sorted Lists',
    'linked-list-cycle': 'Challenge: Linked List Cycle',
    'middle-list': 'Challenge: Middle of the Linked List',
    'remove-nth-node': 'Challenge: Remove Nth Node From End',
  };

  const activeLesson = challengeId ? lessonMap[challengeId] ?? 'Challenge: Two Sum' : 'Challenge: Two Sum';
  return <PracticeChallengeSection activeLesson={activeLesson} />;
}
