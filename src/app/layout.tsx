import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { LESSON_ROUTE_MAP, ROUTES } from '@/shared/constants/routes';

/**
 * Layout wrapper — owns activeLesson state (sidebar concern).
 * Lives inside router tree so useNavigate() works.
 */
export function AppLayout() {
  const navigate = useNavigate();
  const [activeLesson, setActiveLesson] = useState<string | null>(null);

  const handleSelectLesson = useCallback((lesson: string) => {
    setActiveLesson(lesson);
    navigate(LESSON_ROUTE_MAP[lesson] ?? ROUTES.HOME);
  }, [navigate]);

  return (
    <MainLayout
      activeLesson={activeLesson}
      onSelectLesson={handleSelectLesson}
    />
  );
}
