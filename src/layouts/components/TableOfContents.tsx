import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronUp, PlayCircle, Code, BookOpen, Clock, PanelLeftClose } from 'lucide-react';
import { CHAPTERS } from '@/shared/constants/chapters';

interface TableOfContentsProps {
  activeLesson: string | null;
  onSelectLesson: (lesson: string) => void;
  isSidebar?: boolean;
  onCollapse?: () => void;
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

export function TableOfContents({ activeLesson, onSelectLesson, isSidebar = false, onCollapse }: TableOfContentsProps) {
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});
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
      setExpandedChapters(prev => ({ ...prev, [matchingChapterByRoute.id]: true }));
      return;
    }

    if (!activeLesson) return;
    const matchingChapter = CHAPTERS.find(ch =>
      ch.lessons.some(l => l.title === activeLesson)
    );
    if (matchingChapter) {
      setExpandedChapter(matchingChapter.id);
      setExpandedChapters(prev => ({ ...prev, [matchingChapter.id]: true }));
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
    const iconSizeClass = "w-3.5 h-3.5";
    switch (type) {
      case 'theory': return <BookOpen className={iconSizeClass} />;
      case 'visualizer': return <PlayCircle className={iconSizeClass} />;
      case 'practice': return <Code className={iconSizeClass} />;
      default: return <BookOpen className={iconSizeClass} />;
    }
  };

  const getBadge = (type: 'theory' | 'visualizer' | 'practice' | string) => {
    switch (type) {
      case 'theory':
        return <span className="bg-charcoal/[0.04] text-charcoal/60 border border-charcoal/10 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider font-sans">Theory</span>;
      case 'visualizer':
        return <span className="bg-coral/[0.04] text-coral-dark border border-coral-dark/15 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider font-sans">Interactive</span>;
      case 'practice':
        return <span className="bg-emerald-500/[0.04] text-emerald-700 border border-emerald-500/15 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider font-sans">Challenge</span>;
      default:
        return null;
    }
  };

  if (isSidebar) {
    const activeCh = CHAPTERS.find(ch => {
      const hasActiveLesson = ch.lessons.some(l => l.title === activeLesson);
      const isCurrentChapterRoute = CHAPTER_ROUTES[ch.id] && (
        location.pathname === CHAPTER_ROUTES[ch.id] || 
        location.pathname.startsWith(CHAPTER_ROUTES[ch.id] + '/')
      );
      return hasActiveLesson || isCurrentChapterRoute;
    }) || CHAPTERS[0];

    const isExpanded = expandedChapters[activeCh.id] !== false;

    return (
      <div className="flex flex-col gap-4.5 w-full" id="handbook-sidebar">
        {/* Sidebar Header */}
        <div className="px-1 py-3 flex items-center justify-between border-b border-charcoal/10 mb-1">
          <span className="font-sans text-[12px] md:text-[13px] font-black uppercase tracking-[0.2em] text-charcoal/40 select-none">
            Syllabus Unit
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] md:text-[10.5px] text-coral font-bold bg-coral/[0.04] px-2.5 py-0.5 rounded-md border border-coral/10 select-none">
              {activeCh.lessons.length} Lessons
            </span>
            {onCollapse && (
              <button
                type="button"
                onClick={onCollapse}
                className="p-1 rounded-lg border border-charcoal/15 bg-paper hover:bg-paper-dark hover:border-coral/20 text-charcoal hover:text-coral shadow-sm hover:shadow active:scale-95 transition-all focus:outline-none flex items-center justify-center md:flex hidden"
                title="Collapse Sidebar"
              >
                <PanelLeftClose className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Active Chapter Card */}
        <div className="flex flex-col gap-2.5">
          <div
            className="transition-all duration-300 rounded-2xl border border-coral/35 bg-paper shadow-md shadow-coral/[0.02]"
          >
            {/* Chapter Trigger Header */}
            <button
              type="button"
              onClick={() => {
                setExpandedChapters(prev => ({
                  ...prev,
                  [activeCh.id]: !prev[activeCh.id]
                }));
              }}
              className="w-full flex items-center justify-between p-3.5 select-none focus:outline-none transition-colors rounded-t-2xl group bg-gradient-to-r from-coral/[0.02] to-transparent"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="font-editorial italic text-lg md:text-[21px] font-extrabold shrink-0 w-6 text-right transition-colors duration-300 text-coral">
                  {activeCh.number}
                </span>
                <h3 className="font-sans text-[14px] md:text-[15px] font-black uppercase tracking-wider leading-tight text-left text-charcoal">
                  {activeCh.title}
                </h3>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-coral transition-transform duration-300 shrink-0 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Lessons Expanded Container */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isExpanded ? 'max-h-[850px] border-t border-charcoal/[0.04] p-3.5' : 'max-h-0 p-0 pointer-events-none'
              }`}
            >
              <div className="relative ml-1 pl-1 flex flex-col gap-2.5">
                {/* Vertical Timeline Line */}
                <div className="absolute left-[19px] top-3.5 bottom-7 w-[1.5px] bg-gradient-to-b from-charcoal/15 via-charcoal/10 to-transparent" />
                
                {activeCh.lessons.map((lesson, idx) => {
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
                      className={`group relative flex items-center justify-between pl-[35px] pr-2.5 py-2.5 rounded-xl transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/40 ${
                        isActive
                          ? 'bg-paper-dark/45 shadow-sm text-charcoal border border-charcoal/[0.06] -translate-x-0.5'
                          : 'border border-transparent hover:bg-charcoal/[0.02] hover:translate-x-0.5'
                      }`}
                    >
                      {/* Timeline Dot Indicator */}
                      <div className={`absolute top-1/2 -translate-y-1/2 rounded-full transition-all duration-300 z-10 ${
                        isActive 
                          ? 'w-4 h-4 left-[11.5px] bg-coral border-[3px] border-paper ring-4 ring-coral/15 shadow-sm shadow-coral/25' 
                          : 'w-3 h-3 left-[13.5px] bg-paper border border-charcoal/20 group-hover:border-coral/50 group-hover:bg-coral/5'
                      }`} />

                      {/* Lesson Details */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Lesson Icon */}
                        <div className={`p-2 rounded-lg border transition-all duration-300 shrink-0 ${
                          isActive 
                            ? 'bg-coral text-paper border-coral shadow-sm shadow-coral/15' 
                            : 'bg-paper border-charcoal/10 text-charcoal/50 group-hover:bg-coral/5 group-hover:text-coral group-hover:border-coral/20'
                        }`}>
                          {getIcon(lesson.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className={`font-sans text-[13px] md:text-[13.5px] tracking-wide leading-snug transition-colors duration-300 ${
                            isActive ? 'font-extrabold text-charcoal' : 'font-semibold text-charcoal/70 group-hover:text-charcoal'
                          }`}>
                            {lesson.title.replace('Challenge: ', '')}
                          </p>
                          <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
                            {getBadge(lesson.type)}
                            <div className="flex items-center gap-0.5 text-charcoal/40 font-mono text-[9.5px] md:text-[10px] font-bold">
                              <Clock className="w-2.5 h-2.5" />
                              <span>{lesson.duration}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full-width view (Chapters Outline Page / Fallback view)
  return (
    <section className="py-16 px-6 max-w-4xl mx-auto" id="handbook">
      <div className="text-center mb-12">
        <span className="font-sans text-xs uppercase tracking-[0.2em] text-coral-dark font-extrabold bg-coral/[0.04] px-4 py-1.5 rounded-full border border-coral-dark/15 select-none">
          Course Syllabus
        </span>
        <h2 className="font-editorial text-4xl md:text-5xl font-extrabold text-charcoal tracking-tight mt-6 mb-4">
          Table of Contents
        </h2>
        <div className="h-[1.5px] w-24 bg-coral/30 mx-auto mb-6"></div>
        <p className="font-editorial italic text-lg text-charcoal/75 max-w-xl mx-auto leading-relaxed">
          &ldquo;A curated path through fundamental structures, combining comprehensive prose with interactive sandboxes.&rdquo;
        </p>
      </div>

      <div className="border border-charcoal/[0.08] bg-paper-light rounded-3xl overflow-hidden shadow-premium">
        {CHAPTERS.map((chapter) => {
          const isExpanded = expandedChapter === chapter.id;
          const hasActiveLesson = chapter.lessons.some(l => l.title === activeLesson);
          const isActive = hasActiveLesson || (CHAPTER_ROUTES[chapter.id] && (location.pathname === CHAPTER_ROUTES[chapter.id] || location.pathname.startsWith(CHAPTER_ROUTES[chapter.id] + '/')));
          return (
            <div
              key={chapter.id}
              className={`border-b border-charcoal/[0.08] last:border-0 transition-colors duration-300 ${
                isActive ? 'bg-paper-dark/35 border-l-4 border-l-coral' : isExpanded ? 'bg-paper-dark/20 border-l-4 border-l-transparent' : 'hover:bg-paper-dark/10 border-l-4 border-l-transparent'
              }`}
            >
              {/* Accordion Trigger */}
              <button
                id={`chapter-btn-${chapter.id}`}
                onClick={() => handleChapterClick(chapter.id)}
                className="w-full flex items-center justify-between text-left p-6 md:p-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/40 transition-all duration-200 group"
                aria-expanded={isExpanded}
                aria-controls={`chapter-panel-${chapter.id}`}
              >
                <div className="flex items-start gap-5 md:gap-8 min-w-0">
                  <span className={`font-editorial italic text-3xl md:text-4xl font-extrabold select-none w-10 text-right shrink-0 transition-colors duration-300 ${
                    isActive ? 'text-coral' : 'text-coral/50 group-hover:text-coral/80'
                  }`}>
                    {chapter.number}
                  </span>
                  <div className="min-w-0">
                    <h3 className={`font-editorial text-xl md:text-2xl font-bold leading-snug transition-colors duration-300 ${
                      isActive ? 'text-coral' : 'text-charcoal group-hover:text-charcoal'
                    }`}>
                      {chapter.title}
                    </h3>
                    <p className="font-sans text-[13.5px] text-charcoal/65 mt-2 font-medium leading-relaxed max-w-2xl">
                      {chapter.description}
                    </p>
                  </div>
                </div>

                <div className="ml-4 shrink-0">
                  <div className={`p-2.5 rounded-xl border transition-all duration-300 ${
                    isExpanded 
                      ? 'bg-coral/[0.04] text-coral border-coral/25' 
                      : 'bg-paper-light border-charcoal/10 text-charcoal/50 group-hover:text-charcoal/80 group-hover:border-charcoal/20'
                  }`}>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </button>

              {/* Accordion Panel */}
              <div
                id={`chapter-panel-${chapter.id}`}
                role="region"
                aria-labelledby={`chapter-btn-${chapter.id}`}
                className={`overflow-hidden transition-all duration-350 ease-in-out ${
                  isExpanded ? 'max-h-[2000px] border-t border-charcoal/[0.04]' : 'max-h-0'
                }`}
              >
                <div className="p-6 md:p-8 pl-12 md:pl-20 bg-paper-light/30 flex flex-col gap-4 relative">
                  {/* Vertical line connecting timeline nodes */}
                  <div className="absolute left-[39.5px] md:left-[55.5px] top-8 bottom-12 w-[1.5px] bg-gradient-to-b from-charcoal/15 via-charcoal/10 to-transparent" />
                  
                  {chapter.lessons.map((lesson, idx) => {
                    const isLessonActive = activeLesson === lesson.title;
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
                        className={`group relative flex items-center justify-between p-4 pl-12 md:pl-16 rounded-2xl border transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/40 ${
                          isLessonActive
                            ? 'bg-paper border-charcoal/10 shadow-md shadow-charcoal/[0.02] -translate-x-1'
                            : 'border-transparent hover:border-charcoal/10 hover:bg-paper-light hover:shadow-sm hover:translate-x-1'
                        }`}
                      >
                        {/* Timeline Node */}
                        <div className={`absolute top-1/2 -translate-y-1/2 rounded-full transition-all duration-300 z-10 ${
                          isLessonActive 
                            ? 'w-4 h-4 left-[31px] md:left-[47px] bg-coral border-[3px] border-paper ring-6 ring-coral/15 shadow-sm shadow-coral/20' 
                            : 'w-3.5 h-3.5 left-[32.5px] md:left-[48.5px] bg-paper border-2 border-charcoal/20 group-hover:border-coral/50 group-hover:bg-coral/5'
                        }`} />

                        {/* Content Left: Icon + Text */}
                        <div className="flex items-center gap-4 min-w-0">
                          {/* Lesson Icon */}
                          <div className={`p-2 rounded-xl border transition-all duration-300 shrink-0 ${
                            isLessonActive
                              ? 'bg-coral text-paper border-coral shadow-sm shadow-coral/20'
                              : 'bg-charcoal/5 border-transparent text-charcoal/50 group-hover:bg-coral/5 group-hover:text-coral group-hover:border-coral/20'
                          }`}>
                             {getIcon(lesson.type)}
                          </div>
                          
                          <p className={`font-sans text-sm tracking-wide transition-colors duration-300 ${
                            isLessonActive ? 'font-extrabold text-charcoal' : 'font-semibold text-charcoal/70 group-hover:text-charcoal'
                          }`}>
                            {lesson.title.replace('Challenge: ', '')}
                          </p>
                        </div>

                        {/* Content Right: Badge + Duration */}
                        <div className="flex items-center gap-4 shrink-0">
                          {getBadge(lesson.type)}
                          <div className="flex items-center gap-1.5 text-charcoal/40 font-mono text-xs font-bold hidden sm:flex">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{lesson.duration}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
