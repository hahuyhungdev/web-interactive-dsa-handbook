import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <header className="pt-12 pb-20 px-6 max-w-5xl mx-auto text-center">
        <span className="font-sans text-base uppercase tracking-[0.2em] text-coral-dark font-bold bg-coral/5 px-4 py-1.5 rounded-full border border-coral-dark/10">
          An Interactive Monograph
        </span>
        
        <h1 className="font-editorial text-4xl md:text-6xl font-black text-charcoal tracking-tight mt-6 mb-8 leading-[1.1]">
          The Art & Mechanics <br />
          <span className="italic font-medium text-coral font-editorial">of Algorithms</span>
        </h1>
        
        <p className="font-editorial text-base md:text-lg text-charcoal max-w-2xl mx-auto leading-relaxed mb-10">
          A tactile textbook designed for visual thinkers. Master data structures and sorting algorithms through beautifully synchronized step-by-step visualizers and interactive workspaces.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#about" className="w-full sm:w-auto flex items-center justify-center gap-2 border border-charcoal/20 bg-transparent hover:bg-charcoal/5 px-8 py-3.5 rounded-2xl font-sans text-base font-bold tracking-wider uppercase transition-all duration-300">
            Read Introduction
          </a>
        </div>
      </header>

      {/* Editorial Decorative Preview */}
      <section className="px-6 max-w-5xl mx-auto mb-12">
        <div className="border border-charcoal/10 bg-paper-dark rounded-3xl p-8 md:p-12 shadow-premium relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-coral/5 rounded-full filter blur-3xl -z-10"></div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-editorial text-2xl md:text-3xl font-bold text-charcoal mb-4">
                &ldquo;Code is poetry, visualized.&rdquo;
              </h3>
              <p className="font-editorial text-base md:text-lg text-charcoal leading-relaxed mb-6">
                Most visualizers treat algorithms as dynamic charts. We treat them as part of an editorial layout, tying core memory registers and pointer links directly to clean, syntax-highlighted code.
              </p>
              <div className="flex items-center gap-4 text-base font-sans font-semibold tracking-wider uppercase text-coral-dark">
                <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> Client-Side Sandbox</span>
                <span className="text-charcoal">•</span>
                <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> Rich Commentary</span>
              </div>
            </div>
            
            {/* Visualizer Mockup Panel */}
            <div className="bg-paper-light border border-charcoal/10 rounded-2xl p-6 shadow-sm font-mono text-base">
              <div className="flex items-center justify-between border-b border-charcoal/5 pb-3 mb-4">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                </div>
                <span className="text-base text-charcoal tracking-wider">bubbleSort.js</span>
              </div>
              
              <div className="space-y-1.5 text-charcoal font-mono text-base">
                <div><span className="text-coral">function</span> <span className="text-blue-600">bubbleSort</span>(arr: number[]) {'{'}</div>
                <div className="pl-4"><span className="text-coral">for</span> (<span className="text-coral">let</span> i = 0; i &lt; arr.length; i++) {'{'}</div>
                <div className="pl-8 bg-coral/10 border-l-2 border-coral -mx-6 px-6 py-0.5"><span className="text-coral">for</span> (<span className="text-coral">let</span> j = 0; j &lt; arr.length - i - 1; j++) {'{'}</div>
                <div className="pl-12 text-charcoal">{"// active sorting visual frame comparison"}</div>
                <div className="pl-12"><span className="text-coral">if</span> (arr[j] &gt; arr[j+1]) swap(arr, j, j+1);</div>
                <div className="pl-8">{'}'}</div>
                <div className="pl-4">{'}'}</div>
                <div>{'}'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
