import {
  ArrowRight,
  BookOpen,
  Sparkles,
  Cpu,
  Layers,
  GitFork,
  Boxes,
  Database,
  Search,
  Code,
  Flame,
  Zap,
  Terminal,
  Compass
} from "lucide-react";
import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="flex flex-col gap-10 py-3 px-4 sm:px-6 max-w-5xl mx-auto select-none">
      {/* 🚀 EPIC HERO HEADER SECTION */}
      <header className="text-center relative py-4 flex flex-col items-center select-text">
        {/* Editorial Halo Background (Vibrant Glowing Rings) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-tr from-coral/10 to-violet-500/5 rounded-full filter blur-[90px] -z-10"></div>
        <div className="absolute top-10 left-1/3 w-40 h-40 bg-amber-400/5 rounded-full filter blur-[60px] -z-10"></div>

        {/* Sensory Tag badge */}
        <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] text-coral font-extrabold bg-coral/10 border border-coral/20 px-4 py-2 rounded-full mb-4 shadow-sm flex items-center gap-2 select-none animate-pulse">
          <Flame className="w-3.5 h-3.5 fill-current text-coral" /> Interactive Monograph
        </span>

        {/* Thrilling Headline */}
        <h1 className="font-editorial text-4xl sm:text-5xl md:text-7xl font-black text-charcoal tracking-tight leading-[1.02] mb-4">
          Stop Memorizing Syntax.<br />
          <span className="italic font-medium text-coral font-editorial">Unleash the Memory Matrix.</span>
        </h1>

        {/* Sensational Narrative */}
        <p className="font-editorial text-sm sm:text-base md:text-lg text-charcoal/80 max-w-3xl mx-auto leading-relaxed mb-6">
          You&apos;ve read the StackOverflow threads. You&apos;ve memorized the boilerplate code. 
          Yet, when the debugger stops or a dynamic pointer vector breaks, your mind goes blank. 
          Why? Because you&apos;ve never actually <span className="underline decoration-coral decoration-2 underline-offset-4 font-bold">witnessed</span> computer memory in action. 
          Welcome to the ultimate tactile textbook for visual thinkers.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link
            to="/sorting"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-coral hover:bg-coral-dark text-paper border border-transparent px-8 py-2.5 rounded-2xl font-sans text-sm sm:text-base font-bold tracking-wider uppercase shadow-md transition-spring hover-spring active-spring"
          >
            Enter the Lab <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/practice/two-sum"
            className="w-full sm:w-auto flex items-center justify-center gap-2 border border-charcoal/20 bg-transparent hover:bg-charcoal/5 text-charcoal px-8 py-2.5 rounded-2xl font-sans text-sm sm:text-base font-bold tracking-wider uppercase transition-spring hover-spring active-spring"
          >
            Try Practice
          </Link>
        </div>
      </header>

      {/* 🔮 THE COGNITIVE REVOLUTION (editorial bento element) */}
      <section id="about" className="grid md:grid-cols-2 gap-6 items-center bg-paper-dark/45 border border-charcoal/10 rounded-2xl p-4 sm:p-6 md:p-8 shadow-premium relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-coral/5 rounded-full filter blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/5 rounded-full filter blur-2xl -z-10"></div>

        <div className="flex flex-col gap-4">
          <span className="font-sans text-[10px] uppercase tracking-widest text-charcoal/40 font-extrabold">
            The Philosophy
          </span>
          <h2 className="font-editorial text-2xl md:text-3xl font-bold text-charcoal leading-tight">
            &ldquo;Code is poetry, visualized.&rdquo;
          </h2>
          <p className="font-editorial text-xs sm:text-sm text-charcoal/70 leading-relaxed">
            Reading raw logic is abstract. Watching basic bar charts is passive. 
            We bridge the gap by connecting core memory registers and pointer vectors 
            directly to clean, syntax-highlighted code. Drag sliders, skip steps, and 
            watch arrays morph in real-time.
          </p>
          
          <div className="flex flex-wrap items-center gap-3 text-xs font-sans font-bold tracking-wider uppercase text-coral-dark">
            <span className="flex items-center gap-1.5 bg-paper/70 px-3 py-1.5 rounded-xl border border-charcoal/5 shadow-sm">
              <Zap className="w-3.5 h-3.5 text-coral fill-current" /> Worker Sandbox
            </span>
            <span className="flex items-center gap-1.5 bg-paper/70 px-3 py-1.5 rounded-xl border border-charcoal/5 shadow-sm">
              <BookOpen className="w-3.5 h-3.5 text-coral" /> Editorial Guides
            </span>
          </div>
        </div>

        {/* Code Visualizer Mockup Display */}
        <div className="bg-paper-light border border-charcoal/10 rounded-2xl p-5 shadow-sm font-mono text-[11px] sm:text-xs">
          <div className="flex items-center justify-between border-b border-charcoal/5 pb-3 mb-4">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
            </div>
            <div className="flex items-center gap-2 select-none">
              <span className="flex items-center gap-1 bg-coral/10 text-coral text-[9px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-coral/20 animate-pulse">
                Executing Line 3
              </span>
              <span className="text-charcoal/50 font-mono tracking-wider">bubbleSort.js</span>
            </div>
          </div>

          <div className="space-y-1.5 text-charcoal font-mono leading-relaxed select-none">
            <div>
              <span className="text-coral">function</span>{" "}
              <span className="text-blue-600">bubbleSort</span>(arr) {"{"}
            </div>
            <div className="pl-4">
              <span className="text-coral">for</span> (<span className="text-coral">let</span> i = 0; i &lt; arr.length; i++) {"{"}
            </div>
            <div className="pl-8 bg-coral/10 border-l-2 border-coral -mx-5 px-5 py-0.5 font-bold text-charcoal">
              <span className="text-coral">for</span> (<span className="text-coral">let</span> j = 0; j &lt; arr.length - i - 1; j++) {"{"}
            </div>
            <div className="pl-12 text-charcoal/40 italic">{"// active index comparison: arr[j] vs arr[j+1]"}</div>
            <div className="pl-12">
              <span className="text-coral">if</span> (arr[j] &gt; arr[j+1]) swap(arr, j, j+1);
            </div>
            <div className="pl-8">{"}"}</div>
            <div className="pl-4">{"}"}</div>
            <div>{"}"}</div>
          </div>
        </div>
      </section>

      {/* 🚀 FEATURES GRID (MARKETING USP) */}
      <section className="flex flex-col gap-4">
        <div className="text-center mb-1 flex flex-col gap-1">
          <h3 className="font-editorial text-xl sm:text-2xl font-bold text-charcoal">
            Engineered for Visual Mastery
          </h3>
          <p className="font-sans text-xs sm:text-sm font-semibold text-charcoal/70">
            A state-of-the-art interactive lab running directly in your browser.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="glass-panel border border-charcoal/10 rounded-2xl p-5 flex flex-col gap-2.5 hover:border-coral/20 hover:shadow-premium-hover transition-spring hover-spring relative group">
            <div className="absolute top-4 right-4 text-charcoal/10 group-hover:text-coral/20 transition-colors">
              <Terminal className="w-6 h-6" />
            </div>
            <div className="w-8 h-8 rounded-lg bg-coral/5 flex items-center justify-center text-coral mb-1 animate-none">
              <Cpu className="w-4 h-4" />
            </div>
            <h4 className="font-editorial text-base font-bold text-charcoal">
              Web Worker Sandbox
            </h4>
            <p className="font-sans text-xs sm:text-sm font-medium text-charcoal/70 leading-relaxed">
              We compile and evaluate code dynamically in isolated browser contexts. 
              ES6 Proxies intercept memory changes with zero lag.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel border border-charcoal/10 rounded-2xl p-5 flex flex-col gap-2.5 hover:border-coral/20 hover:shadow-premium-hover transition-spring hover-spring relative group">
            <div className="absolute top-4 right-4 text-charcoal/10 group-hover:text-coral/20 transition-colors">
              <Compass className="w-6 h-6" />
            </div>
            <div className="w-8 h-8 rounded-lg bg-coral/5 flex items-center justify-center text-coral mb-1">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="font-editorial text-base font-bold text-charcoal">
              Dual-Panel Execution
            </h4>
            <p className="font-sans text-xs sm:text-sm font-medium text-charcoal/70 leading-relaxed">
              See the code line-by-line highlight on the left while watching indices, 
              pointers, and arrays re-render dynamically on the right.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel border border-charcoal/10 rounded-2xl p-5 flex flex-col gap-2.5 hover:border-coral/20 hover:shadow-premium-hover transition-spring hover-spring relative group">
            <div className="absolute top-4 right-4 text-charcoal/10 group-hover:text-coral/20 transition-colors">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="w-8 h-8 rounded-lg bg-coral/5 flex items-center justify-center text-coral mb-1">
              <GitFork className="w-4 h-4" />
            </div>
            <h4 className="font-editorial text-base font-bold text-charcoal">
              Custom Input Engine
            </h4>
            <p className="font-sans text-xs sm:text-sm font-medium text-charcoal/70 leading-relaxed">
              Don&apos;t just watch pre-made traces. Enable Custom Test Cases and feed 
              your own data parameters directly into the sandbox.
            </p>
          </div>
        </div>
      </section>

      {/* 📚 LAB WORKSPACES (CHAPTER CARDS WITH STUNNING DETAILS) */}
      <section className="flex flex-col gap-4">
        <div className="text-center flex flex-col gap-1">
          <h3 className="font-editorial text-xl sm:text-2xl font-bold text-charcoal">
            Explore the Workspaces
          </h3>
          <p className="font-sans text-xs sm:text-sm font-semibold text-charcoal/70 max-w-xl mx-auto">
            Choose a chapter to enter the interactive workspace. Every route features 
            theory explanations and playbacks.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Chapter I: Sorting */}
          <Link
            to="/sorting"
            className="group flex flex-col justify-between p-5 bg-paper border border-charcoal/10 rounded-2xl shadow-sm hover:shadow-premium-hover hover:border-coral/30 transition-spring hover-spring active-spring relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-coral/5 rounded-full filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex flex-col gap-2">
              <div className="w-8 h-8 rounded-lg bg-charcoal/5 group-hover:bg-coral/10 group-hover:text-coral flex items-center justify-center text-charcoal/60 transition-colors">
                <Boxes className="w-4.5 h-4.5" />
              </div>
              <span className="font-sans text-[8px] uppercase tracking-widest text-coral font-extrabold">
                Chapter I
              </span>
              <h4 className="font-editorial text-lg font-bold text-charcoal group-hover:text-coral transition-colors">
                Contiguous Memory & Sorting
              </h4>
              <p className="font-sans text-xs sm:text-sm font-medium text-charcoal/70 leading-relaxed">
                Analyze cache locality, pivot splits, and index swaps. Visualizes Bubble, 
                Insertion, Selection, and Quick Sort algorithms.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[10px] font-sans font-bold uppercase tracking-wider text-coral-dark opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-4px] group-hover:translate-x-0">
              Launch Sandbox <ArrowRight className="w-3 h-3" />
            </div>
          </Link>

          {/* Chapter II: LinkedList */}
          <Link
            to="/linked-list"
            className="group flex flex-col justify-between p-5 bg-paper border border-charcoal/10 rounded-2xl shadow-sm hover:shadow-premium-hover hover:border-coral/30 transition-spring hover-spring active-spring relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-coral/5 rounded-full filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex flex-col gap-2">
              <div className="w-8 h-8 rounded-lg bg-charcoal/5 group-hover:bg-coral/10 group-hover:text-coral flex items-center justify-center text-charcoal/60 transition-colors">
                <GitFork className="w-4.5 h-4.5" />
              </div>
              <span className="font-sans text-[8px] uppercase tracking-widest text-coral font-extrabold">
                Chapter II
              </span>
              <h4 className="font-editorial text-lg font-bold text-charcoal group-hover:text-coral transition-colors">
                Pointers & Linked Lists
              </h4>
              <p className="font-sans text-xs sm:text-sm font-medium text-charcoal/70 leading-relaxed">
                Interact with nodes, dynamic link references, and traverse list indices. 
                Visualize insertion, head/tail manipulation, and item removal.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[10px] font-sans font-bold uppercase tracking-wider text-coral-dark opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-4px] group-hover:translate-x-0">
              Launch Sandbox <ArrowRight className="w-3 h-3" />
            </div>
          </Link>

          {/* Chapter III: Stack & Queue */}
          <Link
            to="/stack-queue"
            className="group flex flex-col justify-between p-5 bg-paper border border-charcoal/10 rounded-2xl shadow-sm hover:shadow-premium-hover hover:border-coral/30 transition-spring hover-spring active-spring relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-coral/5 rounded-full filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex flex-col gap-2">
              <div className="w-8 h-8 rounded-lg bg-charcoal/5 group-hover:bg-coral/10 group-hover:text-coral flex items-center justify-center text-charcoal/60 transition-colors">
                <Database className="w-4.5 h-4.5" />
              </div>
              <span className="font-sans text-[8px] uppercase tracking-widest text-coral font-extrabold">
                Chapter III
              </span>
              <h4 className="font-editorial text-lg font-bold text-charcoal group-hover:text-coral transition-colors">
                Linear Buffers (Stack & Queue)
              </h4>
              <p className="font-sans text-xs sm:text-sm font-medium text-charcoal/70 leading-relaxed">
                Master push/pop and enqueue/dequeue operations. Visualizes frame buffers, 
                spills, and dynamic storage operations.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[10px] font-sans font-bold uppercase tracking-wider text-coral-dark opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-4px] group-hover:translate-x-0">
              Launch Sandbox <ArrowRight className="w-3 h-3" />
            </div>
          </Link>

          {/* Chapter IV: Trees */}
          <Link
            to="/tree"
            className="group flex flex-col justify-between p-5 bg-paper border border-charcoal/10 rounded-2xl shadow-sm hover:shadow-premium-hover hover:border-coral/30 transition-spring hover-spring active-spring relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-coral/5 rounded-full filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex flex-col gap-2">
              <div className="w-8 h-8 rounded-lg bg-charcoal/5 group-hover:bg-coral/10 group-hover:text-coral flex items-center justify-center text-charcoal/60 transition-colors">
                <Code className="w-4.5 h-4.5" />
              </div>
              <span className="font-sans text-[8px] uppercase tracking-widest text-coral font-extrabold">
                Chapter IV
              </span>
              <h4 className="font-editorial text-lg font-bold text-charcoal group-hover:text-coral transition-colors">
                Hierarchical Nodes (Trees)
              </h4>
              <p className="font-sans text-xs sm:text-sm font-medium text-charcoal/70 leading-relaxed">
                Visualize Binary Search Trees (BST), node insertions, parent-child relationships, 
                and branch traversal.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[10px] font-sans font-bold uppercase tracking-wider text-coral-dark opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-4px] group-hover:translate-x-0">
              Launch Sandbox <ArrowRight className="w-3 h-3" />
            </div>
          </Link>

          {/* Chapter V: Search */}
          <Link
            to="/search"
            className="group flex flex-col justify-between p-5 bg-paper border border-charcoal/10 rounded-2xl shadow-sm hover:shadow-premium-hover hover:border-coral/30 transition-spring hover-spring active-spring relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-coral/5 rounded-full filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex flex-col gap-2">
              <div className="w-8 h-8 rounded-lg bg-charcoal/5 group-hover:bg-coral/10 group-hover:text-coral flex items-center justify-center text-charcoal/60 transition-colors">
                <Search className="w-4.5 h-4.5" />
              </div>
              <span className="font-sans text-[8px] uppercase tracking-widest text-coral font-extrabold">
                Chapter V
              </span>
              <h4 className="font-editorial text-lg font-bold text-charcoal group-hover:text-coral transition-colors">
                Search Mechanics
              </h4>
              <p className="font-sans text-xs sm:text-sm font-medium text-charcoal/70 leading-relaxed">
                Compare linear search algorithms with binary lookups, analyzing low/high index 
                pointers and partitioning midpoints.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[10px] font-sans font-bold uppercase tracking-wider text-coral-dark opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-4px] group-hover:translate-x-0">
              Launch Sandbox <ArrowRight className="w-3 h-3" />
            </div>
          </Link>

          {/* Chapter VI: Hash Slots */}
          <Link
            to="/hash-table"
            className="group flex flex-col justify-between p-5 bg-paper border border-charcoal/10 rounded-2xl shadow-sm hover:shadow-premium-hover hover:border-coral/30 transition-spring hover-spring active-spring relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-coral/5 rounded-full filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex flex-col gap-2">
              <div className="w-8 h-8 rounded-lg bg-charcoal/5 group-hover:bg-coral/10 group-hover:text-coral flex items-center justify-center text-charcoal/60 transition-colors">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <span className="font-sans text-[8px] uppercase tracking-widest text-coral font-extrabold">
                Chapter VI
              </span>
              <h4 className="font-editorial text-lg font-bold text-charcoal group-hover:text-coral transition-colors">
                Hash Tables & Graphs
              </h4>
              <p className="font-sans text-xs sm:text-sm font-medium text-charcoal/70 leading-relaxed">
                Analyze hash slot mappings, dynamic graph edge linkages, and node traversals 
                using interactive layouts.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[10px] font-sans font-bold uppercase tracking-wider text-coral-dark opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-4px] group-hover:translate-x-0">
              Launch Sandbox <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
        </div>
      </section>

      {/* 🔮 SENSATIONAL CALL TO ACTION (CTA) CARD */}
      <section className="bg-paper-dark border border-coral/10 rounded-2xl p-5 sm:p-6 text-center flex flex-col items-center gap-3 shadow-premium relative overflow-hidden">
        {/* Glowing halo backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-coral/5 to-violet-500/5 rounded-full filter blur-[90px] -z-10"></div>
        
        <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-charcoal leading-tight">
          Ready to achieve visual fluency?
        </h3>
        <p className="font-editorial text-xs sm:text-sm text-charcoal/70 max-w-xl leading-relaxed">
          Dive into our interactive modules, try solving practice challenges with live 
          trace highlights, and watch data structures materialize in real-time.
        </p>
        <Link
          to="/sorting"
          className="mt-1 flex items-center gap-2 bg-coral hover:bg-coral-dark text-paper border border-transparent px-8 py-2.5 rounded-2xl font-sans text-sm sm:text-base font-bold tracking-wider uppercase shadow-md transition-spring hover-spring active-spring"
        >
          Enter the Lab <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
