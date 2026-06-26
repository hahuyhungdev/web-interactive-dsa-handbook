import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ROUTES, ROUTE_LESSON_MAP } from '@/shared/constants/routes';

// Shared state for lesson sync — only what's needed across layout + sync
let _setActiveLesson: React.Dispatch<React.SetStateAction<string | null>> | null = null;

export function useActiveLesson(): [string | null, React.Dispatch<React.SetStateAction<string | null>>] {
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  _setActiveLesson = setActiveLesson;
  return [activeLesson, setActiveLesson];
}

/**
 * Syncs URL → activeLesson state.
 * Lives inside router tree so useLocation() works.
 */
export function LessonSync() {
  const location = useLocation();

  useEffect(() => {
    if (!_setActiveLesson) return;
    const path = location.pathname;
    _setActiveLesson(ROUTE_LESSON_MAP[path] ?? null);
  }, [location.pathname]);

  return null;
}
