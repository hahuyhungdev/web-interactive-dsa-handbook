import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/layouts/components/Navbar';
import { TableOfContents } from '@/layouts/components/TableOfContents';
import { Heart } from 'lucide-react';

interface MainLayoutProps {
  activeLesson: string | null;
  onSelectLesson: (lesson: string) => void;
}

export function MainLayout({ activeLesson, onSelectLesson }: MainLayoutProps) {
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
