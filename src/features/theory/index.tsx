import { TheoryContent } from "./components/TheoryContent";
import { CodeViewer } from "./components/CodeViewer";

interface TheorySectionProps {
  lessonId: string | undefined;
}

/**
 * Compound component — composes theory internals.
 * Page renders this single component.
 */
export function TheorySection({ lessonId }: TheorySectionProps) {
  return <TheoryContent lessonId={lessonId} />;
}
