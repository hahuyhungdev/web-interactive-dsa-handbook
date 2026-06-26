import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, PlayCircle, Code, BookOpen, Clock } from 'lucide-react';
import { Chapter } from '../types';

const CHAPTERS: Chapter[] = [
  {
    id: 'arrays',
    number: 'I',
    title: 'Contiguous Memory & Arrays',
    description: 'Explore linear memory layouts, memory addressing, and fundamental array manipulation algorithms.',
    lessons: [
      { title: 'The Contiguous Memory Model', type: 'theory', duration: '10 min' },
      { title: 'Linear Search & Binary Search', type: 'visualizer', duration: '15 min' },
      { title: 'Challenge: Two Sum', type: 'practice', duration: '20 min' },
    ],
  },
  {
    id: 'sorting',
    number: 'II',
    title: 'The Art of Sorting',
    description: 'Understand comparison-based sorting paradigms. Visualize Bubble Sort and Selection Sort step-by-step.',
    lessons: [
      { title: 'Sorting Taxonomy & Complexity', type: 'theory', duration: '12 min' },
      { title: 'Bubble Sort Visualizer', type: 'visualizer', duration: '25 min' },
      { title: 'Selection Sort Visualizer', type: 'visualizer', duration: '20 min' },
      { title: 'Challenge: Max Value in Array', type: 'practice', duration: '15 min' },
    ],
  },
  {
    id: 'linked-lists',
    number: 'III',
    title: 'Dynamic Nodes & Linked Lists',
    description: 'Break free from contiguous blocks. Master node structures, pointer manipulation, and traversal mechanics.',
    lessons: [
      { title: 'Nodes, Pointers & References', type: 'theory', duration: '15 min' },
      { title: 'Singly Linked List Visualizer', type: 'visualizer', duration: '30 min' },
      { title: 'Challenge: Reverse Linked List', type: 'practice', duration: '25 min' },
    ],
  },
];

interface TableOfContentsProps {
  activeLesson: string | null;
  onSelectLesson: (lesson: string) => void;
  isSidebar?: boolean;
}

export default function TableOfContents({ activeLesson, onSelectLesson, isSidebar = false }: TableOfContentsProps) {
  const [expandedChapter, setExpandedChapter] = useState<string | null>('sorting'); // Default expand sorting for showcase

  useEffect(() => {
    if (!activeLesson) return;
    const matchingChapter = CHAPTERS.find(ch => 
      ch.lessons.some(l => l.title === activeLesson)
    );
    if (matchingChapter) {
      setExpandedChapter(matchingChapter.id);
    }
  }, [activeLesson]);

  const toggleChapter = (chapterId: string) => {
    setExpandedChapter(expandedChapter === chapterId ? null : chapterId);
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
        return <span className="bg-charcoal/5 text-charcoal border border-charcoal/20 text-base font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-sans">Theory</span>;
      case 'visualizer':
        return <span className="bg-coral/10 text-coral-dark border border-coral-dark/30 text-base font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-sans">Interactive</span>;
      case 'practice':
        return <span className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-base font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-sans">Challenge</span>;
      default:
        return null;
    }
  };

  if (isSidebar) {
    return (
      <div className="flex flex-col gap-3 w-full" id="handbook">
        {CHAPTERS.map((chapter) => {
          const isExpanded = expandedChapter === chapter.id;
          return (
            <div 
              key={chapter.id}
              className={`rounded-2xl border transition-all duration-300 ${
                isExpanded 
                  ? 'bg-paper-dark/30 border-charcoal/10 shadow-sm' 
                  : 'bg-transparent border-transparent hover:bg-paper-dark/10'
              }`}
            >
              {/* Sidebar Accordion Header Button */}
              <button
                id={`chapter-btn-${chapter.id}`}
                onClick={() => toggleChapter(chapter.id)}
                className="w-full flex items-center justify-between text-left p-3.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 focus-visible:ring-offset-2 focus-visible:rounded-xl transition-all duration-200"
                aria-expanded={isExpanded}
                aria-controls={`chapter-panel-${chapter.id}`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-editorial italic text-xl text-coral font-extrabold select-none w-5 text-right shrink-0">
                    {chapter.number}
                  </span>
                  
                  <h3 className="font-editorial text-base md:text-lg font-bold text-charcoal leading-snug">
                    {chapter.title}
                  </h3>
                </div>

                <div className="shrink-0 ml-2">
                  <div className={`p-1 rounded-lg border text-charcoal transition-all ${
                    isExpanded ? 'bg-coral/5 text-coral border-coral/20' : 'bg-paper border-charcoal/20'
                  }`}>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </button>

              {/* Sidebar Accordion Content Panel */}
              <div
                id={`chapter-panel-${chapter.id}`}
                role="region"
                aria-labelledby={`chapter-btn-${chapter.id}`}
                className={`overflow-hidden transition-all duration-[50ms] ease-in-out ${
                  isExpanded ? 'max-h-[2000px] border-t border-charcoal/5' : 'max-h-0'
                }`}
              >
                <div className="p-3 pl-8 bg-paper-light/10 flex flex-col gap-1.5">
                  {chapter.lessons.map((lesson, idx) => {
                    const isActive = activeLesson === lesson.title;
                    return (
                      <div 
                        key={idx}
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          if (onSelectLesson) onSelectLesson(lesson.title);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            if (onSelectLesson) onSelectLesson(lesson.title);
                          }
                        }}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 ${
                          isActive 
                            ? 'bg-paper border-charcoal/10 shadow-sm text-coral' 
                            : 'border-transparent hover:border-charcoal/10 hover:bg-paper hover:shadow-xs'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                          isActive ? 'bg-coral/5 text-coral' : 'bg-charcoal/5 group-hover:bg-coral/5'
                        }`}>
                           {getIcon(lesson.type)}
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col gap-2">
                          <p className={`font-sans text-base font-bold leading-snug transition-colors ${
                            isActive ? 'text-charcoal' : 'text-charcoal group-hover:text-charcoal'
                          }`}>
                            {lesson.title}
                          </p>
                          
                          <div className="flex items-center gap-2 flex-wrap">
                            {getBadge(lesson.type)}
                            <div className="flex items-center gap-1 text-charcoal font-mono text-base">
                              <Clock className="w-3.5 h-3.5 text-charcoal" />
                              <span>{lesson.duration}</span>
                            </div>
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
    );
  }

  // Full-width view (Optional fallback)
  return (
    <section className="py-24 px-6 max-w-4xl mx-auto" id="handbook">
      {/* Section Header */}
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

      {/* Accordion Container */}
      <div className="border border-charcoal/10 bg-paper-light rounded-3xl overflow-hidden shadow-premium">
        {CHAPTERS.map((chapter) => {
          const isExpanded = expandedChapter === chapter.id;
          return (
            <div 
              key={chapter.id}
              className={`border-b border-charcoal/10 last:border-0 transition-colors duration-300 ${
                isExpanded ? 'bg-paper-dark/30' : 'hover:bg-paper-dark/10'
              }`}
            >
              {/* Accordion Header Button */}
              <button
                id={`chapter-btn-${chapter.id}`}
                onClick={() => toggleChapter(chapter.id)}
                className="w-full flex items-center justify-between text-left p-6 md:p-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 focus-visible:ring-offset-2 focus-visible:rounded-2xl transition-all duration-200"
                aria-expanded={isExpanded}
                aria-controls={`chapter-panel-${chapter.id}`}
              >
                <div className="flex items-start gap-5 md:gap-8">
                  {/* Roman Numeral Accent */}
                  <span className="font-editorial italic text-3xl md:text-4xl text-coral font-extrabold select-none w-10 text-right shrink-0">
                    {chapter.number}
                  </span>
                  
                  <div>
                    <h3 className="font-editorial text-xl md:text-2xl font-bold text-charcoal leading-snug">
                      {chapter.title}
                    </h3>
                    <p className="font-sans text-base text-charcoal mt-2 font-medium leading-relaxed max-w-2xl">
                      {chapter.description}
                    </p>
                  </div>
                </div>

                {/* Open/Close Trigger */}
                <div className="ml-4 shrink-0">
                  <div className={`p-2 rounded-xl border border-charcoal/10 text-charcoal transition-all ${
                    isExpanded ? 'bg-coral/5 text-coral border-coral/20' : 'bg-paper-light'
                  }`}>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </button>

              {/* Accordion Content Panels */}
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
                      onClick={() => {
                        if (onSelectLesson) onSelectLesson(lesson.title);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          if (onSelectLesson) onSelectLesson(lesson.title);
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
