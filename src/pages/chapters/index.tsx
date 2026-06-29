import { TableOfContents } from "@/layouts/components/TableOfContents";
import { useActiveLesson } from "@/app/lesson-sync";
import { useNavigate } from "react-router-dom";
import { LESSON_ROUTE_MAP, ROUTES } from "@/shared/constants/routes";

export function ChaptersPage() {
  const [activeLesson, setActiveLesson] = useActiveLesson();
  const navigate = useNavigate();

  const handleSelectLesson = (lesson: string) => {
    setActiveLesson(lesson);
    navigate(LESSON_ROUTE_MAP[lesson] ?? ROUTES.HOME);
  };

  return (
    <div className="py-6 sm:py-10 max-w-5xl mx-auto px-4 select-none">
      <TableOfContents
        activeLesson={activeLesson}
        onSelectLesson={handleSelectLesson}
        isSidebar={false}
      />
    </div>
  );
}
