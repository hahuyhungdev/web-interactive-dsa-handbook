import { lazy, Suspense } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './layout';
import { LessonSync } from './lesson-sync';

// ── Lazy-loaded pages ────────────────────────────────────────
const HomePage = lazy(() => import('@/pages/(home)').then(m => ({ default: m.HomePage })));
const SortingPage = lazy(() => import('@/pages/sorting').then(m => ({ default: m.SortingPage })));
const LinkedListPage = lazy(() => import('@/pages/linked-list').then(m => ({ default: m.LinkedListPage })));
const SearchPage = lazy(() => import('@/pages/search').then(m => ({ default: m.SearchPage })));
const PracticePage = lazy(() => import('@/pages/practice/[challengeId]').then(m => ({ default: m.PracticePage })));
const TheoryPage = lazy(() => import('@/pages/theory/[lessonId]').then(m => ({ default: m.TheoryPage })));
const NotFoundPage = lazy(() => import('@/pages/not-found').then(m => ({ default: m.NotFoundPage })));

function PageFallback() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-2 border-coral/30 border-t-coral rounded-full animate-spin" />
    </div>
  );
}

const withSuspense = (Component: React.LazyExoticComponent<() => JSX.Element>) => (
  <Suspense fallback={<PageFallback />}><Component /></Suspense>
);

// ── Router ───────────────────────────────────────────────────
const router = createBrowserRouter([
  {
    element: (
      <>
        <LessonSync />
        <AppLayout />
      </>
    ),
    children: [
      { index: true, element: withSuspense(HomePage) },
      { path: '/sorting', element: withSuspense(SortingPage) },
      { path: '/linked-list', element: withSuspense(LinkedListPage) },
      { path: '/search', element: withSuspense(SearchPage) },
      { path: '/theory/:lessonId', element: withSuspense(TheoryPage) },
      { path: '/practice/:challengeId', element: withSuspense(PracticePage) },
      { path: '*', element: withSuspense(NotFoundPage) },
    ],
  },
]);

// ── Root App ─────────────────────────────────────────────────
export function App() {
  return <RouterProvider router={router} />;
}
