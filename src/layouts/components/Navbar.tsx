import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-5xl z-50 transition-all duration-300">
      {/* Mobile Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full backdrop-blur-lg bg-paper/80 border border-charcoal/10 shadow-premium-hover rounded-2xl p-6 flex flex-col gap-4 animate-fade-in md:hidden">
          <a
            href="/"
            onClick={() => setIsOpen(false)}
            className="font-sans text-base font-bold tracking-wider uppercase text-charcoal hover:text-coral py-2 border-b border-charcoal/5 focus:outline-none focus-visible:text-coral"
          >
            Home
          </a>
          <a
            href="/sorting"
            onClick={() => setIsOpen(false)}
            className="font-sans text-base font-bold tracking-wider uppercase text-charcoal hover:text-coral py-2 border-b border-charcoal/5 focus:outline-none focus-visible:text-coral"
          >
            Chapters
          </a>
          <a
            href="/practice/two-sum"
            onClick={() => setIsOpen(false)}
            className="font-sans text-base font-bold tracking-wider uppercase text-charcoal hover:text-coral py-2 border-b border-charcoal/5 focus:outline-none focus-visible:text-coral"
          >
            Practice
          </a>
          <a
            href="/#about"
            onClick={() => setIsOpen(false)}
            className="font-sans text-base font-bold tracking-wider uppercase text-charcoal hover:text-coral py-2 border-b border-charcoal/5 focus:outline-none focus-visible:text-coral"
          >
            About
          </a>
          <a
            href="/sorting"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 bg-coral text-paper py-3 rounded-xl font-sans text-base font-bold uppercase tracking-wider shadow-sm mt-2 focus:outline-none focus-visible:bg-coral-dark"
          >
            Start Reading <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      )}

      {/* Frosted Glass Container */}
      <div
        className={`backdrop-blur-md border rounded-2xl px-6 flex items-center justify-between transition-all duration-500 ${
          isScrolled
            ? 'bg-paper/60 border-charcoal/10 shadow-premium py-3'
            : 'bg-paper/30 border-charcoal/5 shadow-none py-4'
        }`}
      >
        {/* Brand/Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-coral flex items-center justify-center text-paper font-bold text-lg transition-transform duration-300 group-hover:scale-105">
            D
          </div>
          <h1 className="font-editorial text-xl font-bold text-charcoal tracking-tight">
            DSA <span className="font-sans text-base uppercase tracking-widest text-coral-dark font-bold ml-1">Handbook</span>
          </h1>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 font-sans text-base font-semibold tracking-wider uppercase text-charcoal">
          <a href="/" className="hover:text-coral transition-colors duration-200">Home</a>
          <a href="/sorting" className="hover:text-coral transition-colors duration-200">Chapters</a>
          <a href="/practice/two-sum" className="hover:text-coral transition-colors duration-200">Practice</a>
          <a href="/#about" className="hover:text-coral transition-colors duration-200">About</a>
        </div>

        {/* CTA Launch Button */}
        <div className="hidden md:flex items-center">
          <a href="/sorting" className="flex items-center gap-2 bg-charcoal text-paper hover:bg-coral hover:text-paper transition-all duration-300 px-4 py-2 rounded-xl font-sans text-base font-bold tracking-wider uppercase shadow-sm">
            Start Reading <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Menu Toggle button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-1.5 rounded-lg hover:bg-charcoal/5 text-charcoal transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/50"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
    </nav>
  );
}
