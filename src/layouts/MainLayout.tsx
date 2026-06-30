import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";
import { Navbar } from "@/layouts/components/Navbar";
import { TableOfContents } from "@/layouts/components/TableOfContents";
import { KeyboardHelpOverlay } from "@/shared/components/ui/KeyboardHelpOverlay";
import { Heart, Keyboard, BookOpen, ChevronLeft, ChevronRight, PanelLeftOpen } from "lucide-react";

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

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
        return () => clearTimeout(timer);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [location.pathname, location.hash]);

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

      <div className="pt-24 flex-1 flex flex-col md:flex-row max-w-[110rem] w-full mx-auto relative px-4 md:px-6 mb-8">
        {/* Left column: Sidebar TableOfContents (Desktop version) */}
        {!hideSidebar && (
          <div 
            className="hidden md:flex shrink-0 relative transition-[width] duration-300 z-30" 
            style={{ width: isSidebarCollapsed ? 0 : '18.5rem' }}
          >
            <aside className={`shrink-0 md:border-r border-charcoal/10 md:py-0 md:sticky md:top-24 md:self-start md:max-h-[calc(100vh-128px)] md:overflow-y-auto scrollbar-none transition-[width,padding,border-color,opacity] duration-300 relative w-full ${
              isSidebarCollapsed ? 'md:pr-0 md:border-r-0 overflow-hidden' : 'md:pr-6'
            }`}>
              <div className="pr-2">
                <TableOfContents
                  activeLesson={activeLesson}
                  onSelectLesson={handleSelectLesson}
                  isSidebar={true}
                  onCollapse={() => setIsSidebarCollapsed(true)}
                />
              </div>
            </aside>
          </div>
        )}

        {/* Mobile Sidebar Outline (Mobile version) */}
        {!hideSidebar && !isDesktop && (
          <aside className="shrink-0 border-b border-charcoal/10 py-6 w-full md:hidden">
            <details
              open={isMobileTocOpen}
              onToggle={(e) => {
                setIsMobileTocOpen((e.target as HTMLDetailsElement).open);
              }}
              className="border border-charcoal/10 rounded-xl p-3 bg-paper-dark/10 mb-4"
            >
              <summary className="font-sans text-base font-bold text-charcoal cursor-pointer flex items-center justify-between select-none focus:outline-none list-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-coral" />
                  <span>Chapters Outline</span>
                </span>
                <span className="transition-transform duration-200 group-open:rotate-180 text-charcoal/60 font-sans text-xs">
                  ▼
                </span>
              </summary>
              
              <div className="mt-4 pr-2">
                <TableOfContents
                  activeLesson={activeLesson}
                  onSelectLesson={handleSelectLesson}
                  isSidebar={true}
                />
              </div>
            </details>
          </aside>
        )}

        {/* Right column: Active Route Workspace */}
        <main className={`flex-1 min-w-0 py-6 md:py-0 transition-[padding] duration-300 ${hideSidebar || isSidebarCollapsed ? "" : "md:pl-6"} flex flex-col justify-between relative`}>
          {isSidebarCollapsed && !hideSidebar && (
            <div className="absolute left-0 top-0 z-30 flex items-center md:flex hidden">
              <button
                id="btn-sidebar-toggle-expand"
                onClick={() => setIsSidebarCollapsed(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-charcoal/10 bg-paper hover:bg-paper-dark text-charcoal hover:text-coral shadow-sm transition-all text-xs font-sans font-bold uppercase tracking-wider focus:outline-none"
                title="Expand Sidebar"
              >
                <PanelLeftOpen className="w-4 h-4 text-coral animate-pulse" />
                <span>Show Syllabus</span>
              </button>
            </div>
          )}

          <div className={`flex-1 transition-all ${isSidebarCollapsed && !hideSidebar ? "pt-12 md:pt-10" : ""}`}>
            <Outlet />
          </div>

          {/* Footer */}
          {!location.pathname.startsWith("/practice") && (
            <footer className="border-t border-charcoal/10 mt-10 py-6 text-center text-base text-charcoal font-sans tracking-wide shrink-0">
              <p className="flex items-center justify-center gap-1">
                Designed with an editorial eye. Made with{" "}
                <Heart className="w-4 h-4 text-coral fill-coral" /> for computer
                science.
              </p>
              <p className="mt-2">
                © 2026 Interactive DSA Handbook. All rights reserved.
              </p>
            </footer>
          )}
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
    </div>
  );
}
