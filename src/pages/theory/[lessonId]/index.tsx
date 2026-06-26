import { useParams } from 'react-router-dom';
import { TheorySection } from '@/features/theory';

export function TheoryPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  return <TheorySection lessonId={lessonId} />;
}
