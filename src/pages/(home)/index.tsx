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
  Zap
} from "lucide-react";

export function HomePage() {
  return (
    <div className="flex flex-col gap-16 py-10 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Sensational Hero Section */}
      <header className="text-center relative py-12 flex flex-col items-center">
        {/* Glow backdrop texture */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-coral/5 rounded-full filter blur-[100px] -z-10"></div>

        <span className="font-sans text-xs sm:text-sm uppercase tracking-[0.25em] text-coral font-extrabold bg-coral/10 border border-coral/20 px-4 py-2 rounded-full mb-8 shadow-sm flex items-center gap-1.5 animate-pulse">
          <Flame className="w-3.5 h-3.5 fill-current" /> Interactive Algorithm Monograph
        </span>

        <h1 className="font-editorial text-4xl sm:text-5xl md:text-7xl font-black text-charcoal tracking-tight leading-[1.05] mb-8">
          Stop Memorizing Code.<br />
          <span className="italic font-medium text-coral font-editorial">Witness the Mechanics.</span>
        </h1>

        <p className="font-editorial text-base sm:text-lg md:text-xl text-charcoal/80 max-w-3xl mx-auto leading-relaxed mb-10">
          Most developers blindly memorize lines of code they don&apos;t understand. 
          The top 1% visualize the actual clockwork of computer memory. Master 
          data structures and sorting algorithms through beautifully synchronized 
          step-by-step visualizers and interactive workspaces.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <a
            href="/sorting"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-coral hover:bg-coral-dark text-paper border border-transparent px-8 py-4 rounded-2xl font-sans text-sm sm:text-base font-bold tracking-wider uppercase shadow-md transition-spring hover-spring active-spring"
          >
            Enter the Lab <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="/practice/two-sum"
            className="w-full sm:w-auto flex items-center justify-center gap-2 border border-charcoal/20 bg-transparent hover:bg-charcoal/5 text-charcoal px-8 py-4 rounded-2xl font-sans text-sm sm:text-base font-bold tracking-wider uppercase transition-spring hover-spring active-spring"
          >
            Try Challenges
          </a>
        </div>
      </header>

      {/* The Cognitive Leap Section (Why This Works) */}
      <section className="grid md:grid-cols-2 gap-8 items-center bg-paper-dark/40 border border-charcoal/10 rounded-3xl p-6 sm:p-10 md:p-12 shadow-premium relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-coral/5 rounded-full filter blur-3xl -z-10"></div>

        <div className="flex flex-col gap-6">
          <h2 className="font-editorial text-3xl md:text-4xl font-bold text-charcoal leading-tight">
            &ldquo;Code is poetry, visualized.&rdquo;
          </h2>
          <p className="font-editorial text-sm sm:text-base md:text-lg text-charcoal/70 leading-relaxed">
            Reading static tutorials is passive. Watching dynamic bar charts is passive. 
            The only way to truly encode data structures in your mind is to interact, 
            mutate states, scrub execution timelines, and see how individual code 
            statements rewrite pointer vectors.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-sans font-bold tracking-wider uppercase text-coral-dark">
            <span className="flex items-center gap-1.5 bg-paper/60 px-3 py-1.5 rounded-lg border border-charcoal/5">
              <Zap className="w-3.5 h-3.5 text-coral" /> Client-Side Sandbox
            </span>
            <span className="flex items-center gap-1.5 bg-paper/60 px-3 py-1.5 rounded-lg border border-charcoal/5">
              <BookOpen className="w-3.5 h-3.5 text-coral" /> Rich Commentary
            </span>
          </div>
        </div>

        {/* Visualizer Mockup Panel */}
        <div className="bg-paper-light border border-charcoal/10 rounded-2xl p-5 sm:p-6 shadow-sm font-mono text-[11px] sm:text-xs">
          <div className="flex items-center justify-between border-b border-charcoal/5 pb-3 mb-4">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
            </div>
            <span className="text-charcoal/50 font-mono tracking-wider">bubbleSort.js</span>
          </div>

          <div className="space-y-1.5 text-charcoal font-mono leading-relaxed select-none">
            <div>
              <span className="text-coral">function</span>{" "}
              <span className="text-blue-600">bubbleSort</span>(arr: number[]) {"{"}
            </div>
            <div className="pl-4">
              <span className="text-coral">for</span> (<span className="text-coral">let</span> i = 0; i &lt; arr.length; i++) {"{"}
            </div>
            <div className="pl-8 bg-coral/10 border-l-2 border-coral -mx-5 px-5 py-0.5 font-bold">
              <span className="text-coral">for</span> (<span className="text-coral">let</span> j = 0; j &lt; arr.length - i - 1; j++) {"{"}
            </div>
            <div className="pl-12 text-charcoal/40 italic">{"// active sorting visual frame comparison"}</div>
            <div className="pl-12">
              <span className="text-coral">if</span> (arr[j] &gt; arr[j+1]) swap(arr, j, j+1);
            </div>
            <div className="pl-8">{"}"}</div>
            <div className="pl-4">{"}"}</div>
            <div>{"}"}</div>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid (Marketing USP) */}
      <section className="flex flex-col gap-6">
        <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-charcoal text-center mb-2">
          Engineered for Visual Mastery
        </h3>
        
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="glass-panel border border-charcoal/10 rounded-2xl p-6 flex flex-col gap-3 hover:border-coral/20 transition-all duration-300 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-coral/5 flex items-center justify-center text-coral mb-2">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="font-editorial text-lg font-bold text-charcoal">
              Web Worker Sandbox
            </h4>
            <p className="font-editorial text-xs sm:text-sm text-charcoal/60 leading-relaxed">
              We compile and evaluate code dynamically in isolated browser contexts. 
              ES6 Proxies intercept memory changes with zero lag.
            </p>
          </div>

          <div className="glass-panel border border-charcoal/10 rounded-2xl p-6 flex flex-col gap-3 hover:border-coral/20 transition-all duration-300 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-coral/5 flex items-center justify-center text-coral mb-2">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="font-editorial text-lg font-bold text-charcoal">
              Dual-Panel Execution
            </h4>
            <p className="font-editorial text-xs sm:text-sm text-charcoal/60 leading-relaxed">
              See the code line-by-line highlight on the left while watching indices, 
              pointers, and arrays re-render dynamically on the right.
            </p>
          </div>

          <div className="glass-panel border border-charcoal/10 rounded-2xl p-6 flex flex-col gap-3 hover:border-coral/20 transition-all duration-300 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-coral/5 flex items-center justify-center text-coral mb-2">
              <GitFork className="w-5 h-5" />
            </div>
            <h4 className="font-editorial text-lg font-bold text-charcoal">
              Custom Input Engine
            </h4>
            <p className="font-editorial text-xs sm:text-sm text-charcoal/60 leading-relaxed">
              Don&apos;t just watch pre-made traces. Enable Custom Test Cases and feed 
              your own data parameters directly into the sandbox.
            </p>
          </div>
        </div>
      </section>

      {/* Chapters / Lab Workspaces Showcases */}
      <section className="flex flex-col gap-8">
        <div className="text-center flex flex-col gap-2">
          <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-charcoal">
            Explore the Workspaces
          </h3>
          <p className="font-editorial text-sm sm:text-base text-charcoal/60 max-w-xl mx-auto">
            Choose a chapter to enter the interactive workspace. Every route features 
            theory explanations and playbacks.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Workspace Card: Sorting */}
          <a
            href="/sorting"
            className="group flex flex-col justify-between p-6 sm:p-8 bg-paper border border-charcoal/10 rounded-3xl shadow-sm hover:shadow-premium hover:border-coral/30 transition-all duration-300"
          >
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-charcoal/5 group-hover:bg-coral/10 group-hover:text-coral flex items-center justify-center text-charcoal/60 transition-colors">
                <Boxes className="w-5 h-5" />
              </div>
              <h4 className="font-editorial text-xl font-bold text-charcoal group-hover:text-coral transition-colors">
                Contiguous Memory & Sorting
              </h4>
              <p className="font-editorial text-xs sm:text-sm text-charcoal/60 leading-relaxed">
                Analyze cache locality, pivot splits, and index swaps. Visualizes Bubble, 
                Insertion, Selection, and Quick Sort algorithms.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider text-coral-dark opacity-0 group-hover:opacity-100 transition-opacity">
              Launch Sandbox <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Workspace Card: LinkedList */}
          <a
            href="/linked-list"
            className="group flex flex-col justify-between p-6 sm:p-8 bg-paper border border-charcoal/10 rounded-3xl shadow-sm hover:shadow-premium hover:border-coral/30 transition-all duration-300"
          >
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-charcoal/5 group-hover:bg-coral/10 group-hover:text-coral flex items-center justify-center text-charcoal/60 transition-colors">
                <GitFork className="w-5 h-5" />
              </div>
              <h4 className="font-editorial text-xl font-bold text-charcoal group-hover:text-coral transition-colors">
                Pointers & Linked Lists
              </h4>
              <p className="font-editorial text-xs sm:text-sm text-charcoal/60 leading-relaxed">
                Interact with nodes, dynamic link references, and traverse list indices. 
                Visualize insertion, head/tail manipulation, and item removal.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider text-coral-dark opacity-0 group-hover:opacity-100 transition-opacity">
              Launch Sandbox <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Workspace Card: Stack & Queue */}
          <a
            href="/stack-queue"
            className="group flex flex-col justify-between p-6 sm:p-8 bg-paper border border-charcoal/10 rounded-3xl shadow-sm hover:shadow-premium hover:border-coral/30 transition-all duration-300"
          >
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-charcoal/5 group-hover:bg-coral/10 group-hover:text-coral flex items-center justify-center text-charcoal/60 transition-colors">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="font-editorial text-xl font-bold text-charcoal group-hover:text-coral transition-colors">
                Linear Buffers (Stack & Queue)
              </h4>
              <p className="font-editorial text-xs sm:text-sm text-charcoal/60 leading-relaxed">
                Master push/pop and enqueue/dequeue operations. Visualizes frame buffers, 
                spills, and dynamic storage operations.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider text-coral-dark opacity-0 group-hover:opacity-100 transition-opacity">
              Launch Sandbox <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Workspace Card: Trees */}
          <a
            href="/tree"
            className="group flex flex-col justify-between p-6 sm:p-8 bg-paper border border-charcoal/10 rounded-3xl shadow-sm hover:shadow-premium hover:border-coral/30 transition-all duration-300"
          >
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-charcoal/5 group-hover:bg-coral/10 group-hover:text-coral flex items-center justify-center text-charcoal/60 transition-colors">
                <Code className="w-5 h-5" />
              </div>
              <h4 className="font-editorial text-xl font-bold text-charcoal group-hover:text-coral transition-colors">
                Hierarchical Nodes (Trees)
              </h4>
              <p className="font-editorial text-xs sm:text-sm text-charcoal/60 leading-relaxed">
                Visualize Binary Search Trees (BST), node insertions, parent-child relationships, 
                and branch traversal.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider text-coral-dark opacity-0 group-hover:opacity-100 transition-opacity">
              Launch Sandbox <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Workspace Card: Search */}
          <a
            href="/search"
            className="group flex flex-col justify-between p-6 sm:p-8 bg-paper border border-charcoal/10 rounded-3xl shadow-sm hover:shadow-premium hover:border-coral/30 transition-all duration-300"
          >
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-charcoal/5 group-hover:bg-coral/10 group-hover:text-coral flex items-center justify-center text-charcoal/60 transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <h4 className="font-editorial text-xl font-bold text-charcoal group-hover:text-coral transition-colors">
                Search Mechanics
              </h4>
              <p className="font-editorial text-xs sm:text-sm text-charcoal/60 leading-relaxed">
                Compare linear search algorithms with binary lookups, analyzing low/high index 
                pointers and partitioning midpoints.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider text-coral-dark opacity-0 group-hover:opacity-100 transition-opacity">
              Launch Sandbox <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Workspace Card: Hash Tables & Graphs */}
          <a
            href="/hash-table"
            className="group flex flex-col justify-between p-6 sm:p-8 bg-paper border border-charcoal/10 rounded-3xl shadow-sm hover:shadow-premium hover:border-coral/30 transition-all duration-300"
          >
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-charcoal/5 group-hover:bg-coral/10 group-hover:text-coral flex items-center justify-center text-charcoal/60 transition-colors">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-editorial text-xl font-bold text-charcoal group-hover:text-coral transition-colors">
                Hash Tables & Graphs
              </h4>
              <p className="font-editorial text-xs sm:text-sm text-charcoal/60 leading-relaxed">
                Analyze hash slot mappings, dynamic graph edge linkages, and node traversals 
                using interactive layouts.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider text-coral-dark opacity-0 group-hover:opacity-100 transition-opacity">
              Launch Sandbox <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </a>
        </div>
      </section>

      {/* Sensational Call to Action */}
      <section className="bg-paper-dark border border-coral/10 rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center gap-6 shadow-premium relative overflow-hidden">
        {/* Coral halo backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-coral/5 rounded-full filter blur-[80px] -z-10"></div>
        
        <h3 className="font-editorial text-3xl sm:text-4xl font-bold text-charcoal leading-tight">
          Ready to achieve visual fluency?
        </h3>
        <p className="font-editorial text-sm sm:text-base text-charcoal/70 max-w-xl">
          Dive into our interactive modules, try solving practice challenges with live 
          trace highlights, and watch data structures materialize in real-time.
        </p>
        <a
          href="/sorting"
          className="mt-2 flex items-center gap-2 bg-coral hover:bg-coral-dark text-paper border border-transparent px-8 py-3.5 rounded-2xl font-sans text-sm sm:text-base font-bold tracking-wider uppercase shadow-md transition-spring hover-spring active-spring"
        >
          Enter the Lab <ArrowRight className="w-4 h-4" />
        </a>
      </section>
    </div>
  );
}
