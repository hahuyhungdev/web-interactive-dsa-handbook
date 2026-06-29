import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronUp, PlayCircle, Code, BookOpen, Clock } from 'lucide-react';
import { CHAPTERS } from '@/shared/constants/chapters';

interface TableOfContentsProps {
  activeLesson: string | null;
  onSelectLesson: (lesson: string) => void;
  isSidebar?: boolean;
}

const CHAPTER_ROUTES: Record<string, string> = {
  arrays: '/search',
  sorting: '/sorting',
  'linked-lists': '/linked-list',
  'stack-queue': '/stack-queue',
  tree: '/tree',
  'hash-table': '/hash-table',
  graph: '/graph'
};

export function TableOfContents({ activeLesson, onSelectLesson, isSidebar = false }: TableOfContentsProps) {
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    const matchingChapterByRoute = CHAPTERS.find(ch => {
      const chRoute = CHAPTER_ROUTES[ch.id];
      return chRoute && (currentPath === chRoute || currentPath.startsWith(chRoute + '/'));
    });

    if (matchingChapterByRoute) {
      setExpandedChapter(matchingChapterByRoute.id);
      return;
    }

    if (!activeLesson) return;
    const matchingChapter = CHAPTERS.find(ch =>
      ch.lessons.some(l => l.title === activeLesson)
    );
    if (matchingChapter) {
      setExpandedChapter(matchingChapter.id);
    }
  }, [activeLesson, location.pathname]);

  const handleChapterClick = (chapterId: string) => {
    setExpandedChapter(expandedChapter === chapterId ? null : chapterId);
    if (isSidebar) {
      const route = CHAPTER_ROUTES[chapterId];
      if (route) {
        navigate(route);
      }
    }
  };

  const getIcon = (type: 'theory' | 'visualizer' | 'practice' | string) => {
    switch (type) {
      case 'theory': return <BookOpen className="w-5 h-5 text-charcoal" />;
      case 'visualizer': return <PlayCircle className="w-5 h-5 text-coral" />;
      case 'practice': return <Code className="w-5 h-5 text-emerald-600" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const getBadge = (type: 'theory' | 'visualizer' | 'practice' | string) => {
    switch (type) {
      case 'theory':
        return <span className="bg-charcoal/5 text-charcoal border border-charcoal/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-sans">Theory</span>;
      case 'visualizer':
        return <span className="bg-coral/10 text-coral-dark border border-coral-dark/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-sans">Interactive</span>;
      case 'practice':
        return <span className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-sans">Challenge</span>;
      default:
        return null;
    }
  };

  if (isSidebar) {
    const activeChapter = CHAPTERS.find(chapter => {
      const hasActiveLesson = chapter.lessons.some(l => l.title === activeLesson);
      const hasRouteMatch = CHAPTER_ROUTES[chapter.id] && (location.pathname === CHAPTER_ROUTES[chapter.id] || location.pathname.startsWith(CHAPTER_ROUTES[chapter.id] + '/'));
      return hasActiveLesson || hasRouteMatch;
    });

    const chaptersToRender = activeChapter ? [activeChapter] : CHAPTERS;

    return (
      <div className="flex flex-col gap-3 w-full" id="handbook">
        {chaptersToRender.map((chapter) => {
          return (
            <div
              key={chapter.id}
              className="rounded-2xl border bg-paper-dark/50 border-coral/30 shadow-sm overflow-hidden"
            >
              <div className="w-full flex items-center justify-between text-left p-3 select-none border-b border-charcoal/5 bg-paper-dark/30">
                <div className="flex items-center gap-2.5">
                  <span className="font-editorial italic text-lg font-extrabold text-coral w-5 text-right shrink-0">
                    {chapter.number}
                  </span>
                  <h3 className="font-editorial text-sm md:text-base font-bold text-charcoal leading-snug">
                    {chapter.title}
                  </h3>
                </div>
              </div>

              <div className="p-2 pl-3 bg-paper-light/10 flex flex-col gap-1">
                {chapter.lessons.map((lesson, idx) => {
                  const isActive = activeLesson === lesson.title;
                  return (
                    <div
                      key={idx}
                      role="button"
                      tabIndex={0}
                      onClick={() => onSelectLesson(lesson.title)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectLesson(lesson.title);
                        }
                      }}
                      className={`flex items-start gap-2.5 p-2 px-2.5 rounded-xl border transition-all group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 ${
                        isActive
                          ? 'bg-paper border-charcoal/10 shadow-sm text-coral'
                          : 'border-transparent hover:border-charcoal/10 hover:bg-paper hover:shadow-xs'
                      }`}
                    >
                      <div className={`p-1 rounded-lg transition-colors shrink-0 ${
                        isActive ? 'bg-coral/5 text-coral' : 'bg-charcoal/5 group-hover:bg-coral/5'
                      }`}>
                         {getIcon(lesson.type)}
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <p className={`font-sans text-xs md:text-sm font-bold leading-snug transition-colors ${
                          isActive ? 'text-charcoal' : 'text-charcoal group-hover:text-charcoal'
                        }`}>
                          {lesson.title}
                        </p>

                        <div className="flex items-center gap-2 flex-wrap mt-0.5">
                          {getBadge(lesson.type)}
                          <div className="flex items-center gap-0.5 text-charcoal/60 font-mono text-[10px]">
                            <Clock className="w-3 h-3 text-charcoal/55" />
                            <span>{lesson.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Full-width view (Optional fallback)
  return (
    <section className="py-24 px-6 max-w-4xl mx-auto" id="handbook">
      <div className="text-center mb-16">
        <span className="font-sans text-base uppercase tracking-widest text-coral-dark font-bold bg-coral/5 px-3 py-1 rounded-full border border-coral-dark/20">
          Course Syllabus
        </span>
        <h2 className="font-editorial text-4xl md:text-5xl font-bold text-charcoal tracking-tight mt-4 mb-6">
          Table of Contents
        </h2>
        <div className="h-[1px] w-24 bg-coral/30 mx-auto mb-6"></div>
        <p className="font-editorial italic text-lg text-charcoal max-w-xl mx-auto leading-relaxed">
          &ldquo;A curated path through fundamental structures, combining comprehensive prose with interactive sandboxes.&rdquo;
        </p>
      </div>

      <div className="border border-charcoal/10 bg-paper-light rounded-3xl overflow-hidden shadow-premium">
        {CHAPTERS.map((chapter) => {
          const isExpanded = expandedChapter === chapter.id;
          const hasActiveLesson = chapter.lessons.some(l => l.title === activeLesson);
          const isActive = hasActiveLesson || (CHAPTER_ROUTES[chapter.id] && (location.pathname === CHAPTER_ROUTES[chapter.id] || location.pathname.startsWith(CHAPTER_ROUTES[chapter.id] + '/')));
          return (
            <div
              key={chapter.id}
              className={`border-b border-charcoal/10 last:border-0 transition-colors duration-300 ${
                isActive ? 'bg-paper-dark/40 border-l-4 border-l-coral' : isExpanded ? 'bg-paper-dark/30 border-l-4 border-l-transparent' : 'hover:bg-paper-dark/10 border-l-4 border-l-transparent'
              }`}
            >
              <button
                id={`chapter-btn-${chapter.id}`}
                onClick={() => handleChapterClick(chapter.id)}
                className="w-full flex items-center justify-between text-left p-6 md:p-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 focus-visible:ring-offset-2 focus-visible:rounded-2xl transition-all duration-200"
                aria-expanded={isExpanded}
                aria-controls={`chapter-panel-${chapter.id}`}
              >
                <div className="flex items-start gap-5 md:gap-8">
                  <span className={`font-editorial italic text-3xl md:text-4xl font-extrabold select-none w-10 text-right shrink-0 transition-colors ${
                    isActive ? 'text-coral' : 'text-coral/60'
                  }`}>
                    {chapter.number}
                  </span>
                  <div>
                    <h3 className={`font-editorial text-xl md:text-2xl font-bold leading-snug transition-colors ${
                      isActive ? 'text-coral' : 'text-charcoal'
                    }`}>
                      {chapter.title}
                    </h3>
                    <p className="font-sans text-base text-charcoal mt-2 font-medium leading-relaxed max-w-2xl">
                      {chapter.description}
                    </p>
                  </div>
                </div>

                <div className="ml-4 shrink-0">
                  <div className={`p-2 rounded-xl border border-charcoal/10 text-charcoal transition-all ${
                    isExpanded ? 'bg-coral/5 text-coral border-coral/20' : 'bg-paper-light'
                  }`}>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </button>

              <div
                id={`chapter-panel-${chapter.id}`}
                role="region"
                aria-labelledby={`chapter-btn-${chapter.id}`}
                className={`overflow-hidden transition-all duration-[50ms] ease-in-out ${
                  isExpanded ? 'max-h-[2000px] border-t border-charcoal/5' : 'max-h-0'
                }`}
              >
                <div className="p-6 md:p-8 pl-14 md:pl-24 bg-paper-light/40 flex flex-col gap-3">
                  {chapter.lessons.map((lesson, idx) => (
                    <div
                      key={idx}
                      role="button"
                      tabIndex={0}
                      onClick={() => onSelectLesson(lesson.title)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectLesson(lesson.title);
                        }
                      }}
                      className="flex items-center justify-between p-3.5 rounded-2xl border border-transparent hover:border-charcoal/10 hover:bg-paper-light hover:shadow-sm transition-all group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/50"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="p-2 rounded-xl bg-charcoal/5 group-hover:bg-coral/5 transition-colors">
                           {getIcon(lesson.type)}
                        </div>
                        <p className="font-sans text-base font-semibold text-charcoal group-hover:text-charcoal transition-colors">
                          {lesson.title}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        {getBadge(lesson.type)}
                        <div className="flex items-center gap-1 text-charcoal font-mono text-base hidden sm:flex">
                          <Clock className="w-3.5 h-3.5 text-charcoal" />
                          <span>{lesson.duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
