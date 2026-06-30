import { lazy, Suspense } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './layout';
import { LessonSync } from './lesson-sync';

// ── Lazy-loaded pages ────────────────────────────────────────
const HomePage = lazy(() => import('@/pages/(home)').then(m => ({ default: m.HomePage })));
const ChaptersPage = lazy(() => import('@/pages/chapters').then(m => ({ default: m.ChaptersPage })));
const SortingPage = lazy(() => import('@/pages/sorting').then(m => ({ default: m.SortingPage })));
const LinkedListPage = lazy(() => import('@/pages/linked-list').then(m => ({ default: m.LinkedListPage })));
const StackQueuePage = lazy(() => import('@/pages/stack-queue').then(m => ({ default: m.StackQueuePage })));
const TreePage = lazy(() => import('@/pages/tree').then(m => ({ default: m.TreePage })));
const HashTablePage = lazy(() => import('@/pages/hash-table').then(m => ({ default: m.HashTablePage })));
const GraphPage = lazy(() => import('@/pages/graph').then(m => ({ default: m.GraphPage })));
const SearchPage = lazy(() => import('@/pages/search').then(m => ({ default: m.SearchPage })));
const PracticePage = lazy(() => import('@/pages/practice/[challengeId]').then(m => ({ default: m.PracticePage })));
const TheoryPage = lazy(() => import('@/pages/theory/[lessonId]').then(m => ({ default: m.TheoryPage })));
const NotFoundPage = lazy(() => import('@/pages/not-found').then(m => ({ default: m.NotFoundPage })));

function PageFallback() {
  return (
    <div className="flex items-center justify-center py-12">
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
      { path: '/chapters', element: withSuspense(ChaptersPage) },
      { path: '/chapters/sorting', element: withSuspense(SortingPage) },
      { path: '/chapters/linked-lists', element: withSuspense(LinkedListPage) },
      { path: '/chapters/stack-queue', element: withSuspense(StackQueuePage) },
      { path: '/chapters/tree', element: withSuspense(TreePage) },
      { path: '/chapters/hash-table', element: withSuspense(HashTablePage) },
      { path: '/chapters/graph', element: withSuspense(GraphPage) },
      { path: '/chapters/arrays', element: withSuspense(SearchPage) },
      { path: '/chapters/:chapterId/theory/:lessonId', element: withSuspense(TheoryPage) },
      { path: '/chapters/:chapterId/practice/:challengeId', element: withSuspense(PracticePage) },
      { path: '*', element: withSuspense(NotFoundPage) },
    ],
  },
]);

// ── Root App ─────────────────────────────────────────────────
export function App() {
  return <RouterProvider router={router} />;
}
