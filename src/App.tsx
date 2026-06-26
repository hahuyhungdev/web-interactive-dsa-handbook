import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import TableOfContents from './components/TableOfContents';
import Home from './pages/Home';
import Sorting from './pages/Sorting';
import LinkedList from './pages/LinkedList';
import Practice from './pages/Practice';
import Theory from './pages/Theory';
import Search from './pages/Search';
import { Heart } from 'lucide-react';

interface LayoutProps {
  activeLesson: string | null;
  onSelectLesson: (lesson: string) => void;
}

function Layout({ activeLesson, onSelectLesson }: LayoutProps) {
  return (
    <div className="min-h-screen bg-paper text-charcoal selection:bg-coral/20 selection:text-coral flex flex-col">
      <Navbar />
      
      <div className="pt-24 flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto relative px-4 md:px-6 mb-12">
        {/* Left column: Sidebar TableOfContents */}
        <aside className="w-full md:w-80 shrink-0 md:pr-8 border-b md:border-b-0 md:border-r border-charcoal/10 py-6 md:py-0">
          <div className="md:sticky md:top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-2">
            <TableOfContents activeLesson={activeLesson} onSelectLesson={onSelectLesson} isSidebar={true} />
          </div>
        </aside>

        {/* Right column: Active Route Workspace */}
        <main className="flex-1 py-6 md:py-0 md:pl-8">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-charcoal/10 py-12 px-6 text-center text-base text-charcoal font-sans tracking-wide shrink-0">
        <p className="flex items-center justify-center gap-1">
          Designed with an editorial eye. Made with <Heart className="w-4 h-4 text-coral fill-coral" /> for computer science.
        </p>
        <p className="mt-2">© 2026 Interactive DSA Handbook. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default function App() {
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [sortingStepIndex, setSortingStepIndex] = useState(0);
  const [sortingIsPlaying, setSortingIsPlaying] = useState(false);
  const [sortingActiveTab, setSortingActiveTab] = useState<'bubble' | 'selection'>('bubble');
  const [prevSortingLesson, setPrevSortingLesson] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSelectLesson = (lesson: string) => {
    setActiveLesson(lesson);
    if (lesson === 'Bubble Sort Visualizer' || lesson === 'Selection Sort Visualizer') {
      if (lesson !== prevSortingLesson) {
        setSortingStepIndex(0);
        setSortingIsPlaying(false);
        setSortingActiveTab(lesson === 'Bubble Sort Visualizer' ? 'bubble' : 'selection');
        setPrevSortingLesson(lesson);
      }
      navigate('/sorting');
    } else if (lesson === 'Singly Linked List Visualizer') {
      setSortingIsPlaying(false);
      navigate('/linked-list');
    } else if (lesson === 'The Contiguous Memory Model') {
      navigate('/theory/contiguous-memory');
    } else if (lesson === 'Sorting Taxonomy & Complexity') {
      navigate('/theory/sorting-taxonomy');
    } else if (lesson === 'Nodes, Pointers & References') {
      navigate('/theory/pointers-references');
    } else if (lesson === 'Linear Search & Binary Search') {
      navigate('/search');
    } else if (lesson === 'Challenge: Two Sum') {
      navigate('/practice/two-sum');
    } else if (lesson === 'Challenge: Max Value in Array') {
      navigate('/practice/find-max');
    } else if (lesson === 'Challenge: Reverse Linked List') {
      navigate('/practice/reverse-list');
    } else {
      navigate('/');
    }
  };

  // Synchronize URL changes with activeLesson state
  useEffect(() => {
    const path = location.pathname;
    if (path === '/sorting') {
      if (!activeLesson || (activeLesson !== 'Bubble Sort Visualizer' && activeLesson !== 'Selection Sort Visualizer')) {
        const defaultLesson = sortingActiveTab === 'bubble' ? 'Bubble Sort Visualizer' : 'Selection Sort Visualizer';
        setActiveLesson(defaultLesson);
        if (!prevSortingLesson) {
          setPrevSortingLesson(defaultLesson);
        }
      }
    } else if (path === '/linked-list') {
      setActiveLesson('Singly Linked List Visualizer');
    } else if (path === '/search') {
      setActiveLesson('Linear Search & Binary Search');
    } else if (path === '/theory/contiguous-memory') {
      setActiveLesson('The Contiguous Memory Model');
    } else if (path === '/theory/sorting-taxonomy') {
      setActiveLesson('Sorting Taxonomy & Complexity');
    } else if (path === '/theory/pointers-references') {
      setActiveLesson('Nodes, Pointers & References');
    } else if (path === '/practice/two-sum') {
      setActiveLesson('Challenge: Two Sum');
    } else if (path === '/practice/find-max') {
      setActiveLesson('Challenge: Max Value in Array');
    } else if (path === '/practice/reverse-list') {
      setActiveLesson('Challenge: Reverse Linked List');
    } else if (path === '/') {
      setActiveLesson(null);
    }
  }, [location.pathname]);

  return (
    <Routes>
      <Route element={<Layout activeLesson={activeLesson} onSelectLesson={handleSelectLesson} />}>
        <Route path="/" element={<Home />} />
        <Route path="/sorting" element={
          <Sorting
            activeLesson={activeLesson}
            sortingStepIndex={sortingStepIndex}
            setSortingStepIndex={setSortingStepIndex}
            sortingIsPlaying={sortingIsPlaying}
            setSortingIsPlaying={setSortingIsPlaying}
            sortingActiveTab={sortingActiveTab}
            setSortingActiveTab={setSortingActiveTab}
            prevSortingLesson={prevSortingLesson}
          />
        } />
        <Route path="/linked-list" element={
          <LinkedList activeLesson={activeLesson} />
        } />
        <Route path="/practice/two-sum" element={
          <Practice activeLesson="Challenge: Two Sum" />
        } />
        <Route path="/practice/find-max" element={
          <Practice activeLesson="Challenge: Max Value in Array" />
        } />
        <Route path="/practice/reverse-list" element={
          <Practice activeLesson="Challenge: Reverse Linked List" />
        } />
        <Route path="/practice" element={
          <Practice activeLesson={activeLesson} />
        } />
        <Route path="/theory/:lessonId" element={
          <Theory />
        } />
        <Route path="/search" element={
          <Search activeLesson={activeLesson} />
        } />
      </Route>
    </Routes>
  );
}
