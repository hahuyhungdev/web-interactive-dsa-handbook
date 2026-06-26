import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { LESSON_ROUTE_MAP, ROUTES } from '@/shared/constants/routes';
import { useActiveLesson } from './lesson-sync';

/**
 * Layout wrapper — owns activeLesson state (sidebar concern).
 * Lives inside router tree so useNavigate() works.
 */
export function AppLayout() {
  const navigate = useNavigate();
  const [activeLesson, setActiveLesson] = useActiveLesson();

  const handleSelectLesson = useCallback((lesson: string) => {
    setActiveLesson(lesson);
    navigate(LESSON_ROUTE_MAP[lesson] ?? ROUTES.HOME);
  }, [navigate, setActiveLesson]);

  return (
    <MainLayout
      activeLesson={activeLesson}
      onSelectLesson={handleSelectLesson}
    />
  );
}

