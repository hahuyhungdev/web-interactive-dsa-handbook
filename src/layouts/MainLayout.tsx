import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";
import { Navbar } from "@/layouts/components/Navbar";
import { TableOfContents } from "@/layouts/components/TableOfContents";
import { KeyboardHelpOverlay } from "@/shared/components/ui/KeyboardHelpOverlay";
import { Heart, Keyboard, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";

interface MainLayoutProps {
  activeLesson: string | null;
  onSelectLesson: (lesson: string) => void;
}

export function MainLayout({ activeLesson, onSelectLesson }: MainLayoutProps) {
  const [showHelp, setShowHelp] = useState(false);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isChaptersPage = location.pathname === "/chapters";
  const hideSidebar = isHomePage || isChaptersPage;
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const listener = () => setIsDesktop(media.matches);
    media.addEventListener("change", listener);
    setIsDesktop(media.matches);
    return () => media.removeEventListener("change", listener);
  }, []);

  useHotkeys(
    "shift+slash",
    (event) => {
      event.preventDefault();
      setShowHelp((open) => !open);
    },
    { enableOnFormTags: false, enableOnContentEditable: false },
  );

  const handleSelectLesson = (lesson: string) => {
    onSelectLesson(lesson);
    setIsMobileTocOpen(false);
  };

  return (
    <div className="min-h-screen bg-paper text-charcoal selection:bg-coral/20 selection:text-coral flex flex-col">
      <Navbar />

      <div className="pt-32 flex-1 flex flex-col md:flex-row max-w-[95rem] w-full mx-auto relative px-4 md:px-6 mb-8">
        {/* Left column: Sidebar TableOfContents */}
        {!hideSidebar && (
          <aside className={`shrink-0 border-b md:border-b-0 md:border-r border-charcoal/10 py-6 md:py-0 md:sticky md:top-32 md:self-start md:max-h-[calc(100vh-160px)] md:overflow-y-auto scrollbar-none transition-[width,padding,border-color,opacity] duration-300 relative ${
            isSidebarCollapsed ? 'w-full md:w-0 md:pr-0 md:border-r-0 overflow-hidden' : 'w-full md:w-72 md:pr-6'
          }`}>
            <div className="relative w-full">
              {/* Collapse Toggle Button */}
              <button
                onClick={() => setIsSidebarCollapsed(true)}
                className="hidden md:flex absolute -right-3 top-0 z-30 bg-paper border border-charcoal/10 hover:bg-paper-dark text-charcoal hover:text-coral transition-all p-1 rounded-full shadow-sm items-center justify-center group focus:outline-none"
                title="Collapse Sidebar"
              >
                <ChevronLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
              </button>

              <details
                open={isDesktop || isMobileTocOpen}
                onToggle={(e) => {
                  if (isDesktop) {
                    (e.target as HTMLDetailsElement).open = true;
                  } else {
                    setIsMobileTocOpen((e.target as HTMLDetailsElement).open);
                  }
                }}
                className="md:border-0 md:bg-transparent md:p-0 border border-charcoal/10 rounded-xl p-3 bg-paper-dark/10 mb-4"
              >
                <summary className="md:hidden font-sans text-base font-bold text-charcoal cursor-pointer flex items-center justify-between select-none focus:outline-none list-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-coral" />
                    <span>Chapters Outline</span>
                  </span>
                  <span className="transition-transform duration-200 group-open:rotate-180 text-charcoal/60 font-sans text-xs">
                    ▼
                  </span>
                </summary>
                
                <div className="mt-4 md:mt-0 pr-2">
                  <TableOfContents
                    activeLesson={activeLesson}
                    onSelectLesson={handleSelectLesson}
                    isSidebar={true}
                  />
                </div>
              </details>
            </div>
          </aside>
        )}

        {isSidebarCollapsed && !hideSidebar && (
          <button
            onClick={() => setIsSidebarCollapsed(false)}
            className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-paper border border-charcoal/10 border-l-0 hover:bg-paper-dark text-charcoal hover:text-coral transition-all p-2 rounded-r-xl shadow-md flex items-center justify-center group focus:outline-none"
            title="Expand Sidebar"
          >
            <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        )}

        {/* Right column: Active Route Workspace */}
        <main className={`flex-1 min-w-0 py-6 md:py-0 transition-[padding] duration-300 ${hideSidebar || isSidebarCollapsed ? "" : "md:pl-6"}`}>
          <Outlet />
        </main>
      </div>

      {/* Floating keyboard help trigger */}
      <button
        id="btn-open-keyboard-help"
        type="button"
        onClick={() => setShowHelp(true)}
        title="Keyboard shortcuts (?)"
        aria-label="Show keyboard shortcuts"
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-3 py-2 rounded-full bg-charcoal text-paper text-xs font-sans font-bold uppercase tracking-wider shadow-lg hover:bg-coral transition-colors"
      >
        <Keyboard className="w-4 h-4" />
        <span className="hidden sm:inline">Shortcuts</span>
        <kbd className="font-mono text-[10px] opacity-80">?</kbd>
      </button>

      <KeyboardHelpOverlay open={showHelp} onClose={() => setShowHelp(false)} />

      {/* Footer */}
      <footer className="border-t border-charcoal/10 py-8 px-6 text-center text-base text-charcoal font-sans tracking-wide shrink-0">
        <p className="flex items-center justify-center gap-1">
          Designed with an editorial eye. Made with{" "}
          <Heart className="w-4 h-4 text-coral fill-coral" /> for computer
          science.
        </p>
        <p className="mt-2">
          © 2026 Interactive DSA Handbook. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
