import { BookOpen, Sparkles, AlertCircle } from 'lucide-react';

const THEORY_CONTENT: Record<string, {
  title: string;
  chapter: string;
  duration: string;
  content: JSX.Element;
}> = {
  'contiguous-memory': {
    title: 'The Contiguous Memory Model',
    chapter: 'Chapter I: Contiguous Memory & Arrays',
    duration: '10 min',
    content: (
      <div className="space-y-6 font-editorial text-charcoal leading-relaxed text-base md:text-lg">
        <p className="font-sans text-base uppercase tracking-widest text-coral-dark font-bold bg-coral/5 px-3 py-1 rounded-full border border-coral-dark/20 inline-block">
          Syllabus Core I.I
        </p>
        <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-coral first-letter:float-left first-letter:mr-3 first-letter:mt-1">
          Memory is fundamentally a linear tape. In modern systems, this tape is partitioned into bytes, each identified by a unique hexadecimal address. When we allocate an <strong>Array</strong>, the system guarantees a block of memory where elements are stored back-to-back—or <em>contiguously</em>.
        </p>

        <div className="bg-paper-dark border border-charcoal/10 rounded-2xl p-6 font-mono text-base my-8 shadow-inner">
          <h4 className="font-sans font-bold text-base text-charcoal uppercase tracking-wider mb-3">Memory Map Representation</h4>
          <div className="flex flex-wrap gap-2 items-center justify-start">
            <div className="border border-charcoal/20 bg-paper p-3 rounded-lg text-center shrink-0">
              <span className="block text-base text-charcoal">Addr 0x104</span>
              <strong className="text-coral text-base">Index [0]</strong>
            </div>
            <div className="text-charcoal text-base">➔</div>
            <div className="border border-charcoal/20 bg-paper p-3 rounded-lg text-center shrink-0">
              <span className="block text-base text-charcoal">Addr 0x108</span>
              <strong className="text-base">Index [1]</strong>
            </div>
            <div className="text-charcoal text-base">➔</div>
            <div className="border border-charcoal/20 bg-paper p-3 rounded-lg text-center shrink-0">
              <span className="block text-base text-charcoal">Addr 0x10C</span>
              <strong className="text-base">Index [2]</strong>
            </div>
            <div className="text-charcoal text-base">➔</div>
            <div className="border border-charcoal/20 bg-paper p-3 rounded-lg text-center shrink-0">
              <span className="block text-base text-charcoal">Addr 0x110</span>
              <strong className="text-base">Index [3]</strong>
            </div>
          </div>
        </div>

        <h3 className="font-editorial text-2xl font-bold text-charcoal pt-4">The Constant-Time Access Formula</h3>
        <p>
          Because elements are sized uniformly and arranged contiguously, finding any index requires simple arithmetic rather than searching:
        </p>
        <blockquote className="border-l-4 border-coral pl-4 italic bg-paper-dark/30 py-2 my-4 rounded-r-xl">
          Address(Index i) = BaseAddress + (i × ElementSize)
        </blockquote>
        <p>
          This multiplication and addition is executed in a single CPU cycle. Thus, lookup in an array is <strong>O(1)</strong> (Constant Time).
        </p>

        <div className="border border-coral/20 bg-coral/5 p-4 rounded-xl flex gap-3 items-start my-6">
          <Sparkles className="w-5 h-5 text-coral shrink-0 mt-0.5" />
          <div>
            <h4 className="font-sans font-bold text-base text-coral-dark">Cache Locality Benefit</h4>
            <p className="text-base font-sans text-charcoal mt-1">
              CPUs do not load single bytes from RAM; they load a full 64-byte block (a Cache Line). Because arrays are contiguous, loading index 0 automatically fetches indices 1, 2, and 3 into L1 Cache, resulting in blazing fast iterations.
            </p>
          </div>
        </div>
      </div>
    )
  },
  'sorting-taxonomy': {
    title: 'Sorting Taxonomy & Complexity',
    chapter: 'Chapter II: The Art of Sorting',
    duration: '12 min',
    content: (
      <div className="space-y-6 font-editorial text-charcoal leading-relaxed text-base md:text-lg">
        <p className="font-sans text-base uppercase tracking-widest text-coral-dark font-bold bg-coral/5 px-3 py-1 rounded-full border border-coral-dark/20 inline-block">
          Syllabus Core II.I
        </p>
        <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-coral first-letter:float-left first-letter:mr-3 first-letter:mt-1">
          Sorting is the process of arranging data into a uniform order (ascending or descending). Not all sorting algorithms are built equal. We analyze and categorize them using a distinct taxonomy.
        </p>

        <h3 className="font-editorial text-2xl font-bold text-charcoal pt-4">Key Criteria in Sorting Taxonomy</h3>

        <div className="grid md:grid-cols-3 gap-6 my-8">
          <div className="border border-charcoal/10 bg-paper-light p-5 rounded-2xl shadow-sm">
            <h4 className="font-sans font-bold text-base text-charcoal mb-2">1. Time Complexity</h4>
            <p className="text-base font-sans text-charcoal leading-relaxed">
              Comparison-based sorting has a mathematical boundary of <strong>O(N log N)</strong> in the average/worst cases. Algorithms like Bubble Sort run in <strong>O(N²)</strong>.
            </p>
          </div>
          <div className="border border-charcoal/10 bg-paper-light p-5 rounded-2xl shadow-sm">
            <h4 className="font-sans font-bold text-base text-charcoal mb-2">2. Space Complexity</h4>
            <p className="text-base font-sans text-charcoal leading-relaxed">
              <strong>In-Place</strong> algorithms modify the original array directly without allocating extra helper arrays, maintaining <strong>O(1)</strong> auxiliary memory.
            </p>
          </div>
          <div className="border border-charcoal/10 bg-paper-light p-5 rounded-2xl shadow-sm">
            <h4 className="font-sans font-bold text-base text-charcoal mb-2">3. Stability</h4>
            <p className="text-base font-sans text-charcoal leading-relaxed">
              A sort is <strong>Stable</strong> if elements with equal values preserve their relative ordering after sorting. Vital when sorting items by multiple criteria.
            </p>
          </div>
        </div>

        <h3 className="font-editorial text-2xl font-bold text-charcoal pt-4">Comparison vs. Non-Comparison</h3>
        <p>
          Algorithms like Quick Sort, Merge Sort, Bubble Sort, and Selection Sort are <strong>Comparison-based</strong>—they must compare elements against each other. Non-comparison sorts like Radix or Counting Sort exploit mathematical keys and bypass the O(N log N) limit, running in <strong>O(N)</strong> but requiring specialized key constraints.
        </p>
      </div>
    )
  },
  'pointers-references': {
    title: 'Nodes, Pointers & References',
    chapter: 'Chapter III: Dynamic Nodes & Linked Lists',
    duration: '15 min',
    content: (
      <div className="space-y-6 font-editorial text-charcoal leading-relaxed text-base md:text-lg">
        <p className="font-sans text-base uppercase tracking-widest text-coral-dark font-bold bg-coral/5 px-3 py-1 rounded-full border border-coral-dark/20 inline-block">
          Syllabus Core III.I
        </p>
        <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-coral first-letter:float-left first-letter:mr-3 first-letter:mt-1">
          While arrays demand solid blocks of memory, <strong>Linked Lists</strong> offer modularity. Rather than allocating a monolithic block, we distribute data across isolated objects called <strong>Nodes</strong>.
        </p>

        <h3 className="font-editorial text-2xl font-bold text-charcoal pt-4">Anatomy of a Node</h3>
        <p>
          A Node is a small composite data structure consisting of two properties:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-base md:text-lg font-sans text-charcoal">
          <li><strong>Data (val):</strong> The actual value or reference to payload.</li>
          <li><strong>Pointer (next):</strong> A memory address reference pointing to the succeeding node.</li>
        </ul>

        <div className="bg-paper-dark border border-charcoal/10 rounded-3xl p-6 font-mono text-base my-8 shadow-inner">
          <h4 className="font-sans font-bold text-base text-charcoal uppercase tracking-wider mb-3">Linked Node Topology</h4>
          <div className="flex gap-4 items-center justify-start overflow-x-auto py-2">
            <div className="border border-charcoal/20 bg-paper p-3 rounded-xl">
              <span className="block text-base text-charcoal">Node [0x7f01]</span>
              <strong className="text-base">Value: 15</strong>
              <span className="block text-base text-coral font-bold mt-1">next: 0x9a44</span>
            </div>
            <div className="text-coral-dark font-bold text-base">➔</div>
            <div className="border border-charcoal/20 bg-paper p-3 rounded-xl">
              <span className="block text-base text-charcoal">Node [0x9a44]</span>
              <strong className="text-base">Value: 30</strong>
              <span className="block text-base text-coral font-bold mt-1">next: null</span>
            </div>
          </div>
        </div>

        <h3 className="font-editorial text-2xl font-bold text-charcoal pt-4">References vs. Contiguous Offsets</h3>
        <p>
          Unlike arrays, nodes are allocated randomly in Heap memory wherever space is available. We cannot compute a Node's address. To access Node index <em>k</em>, we must start at the <strong>Head</strong> node and follow the pointer links sequentially <em>k</em> times.
        </p>
        <p>
          This makes Node lookup an <strong>O(N)</strong> operation (Linear Time), but dynamic inserts and deletions can be completed in <strong>O(1)</strong> once the target position is reached.
        </p>
      </div>
    )
  }
};

interface TheoryContentProps {
  lessonId: string | undefined;
}

export function TheoryContent({ lessonId }: TheoryContentProps) {
  const lesson = lessonId ? THEORY_CONTENT[lessonId] : null;

  if (!lesson) {
    return (
      <section className="py-24 px-6 max-w-3xl mx-auto text-center font-sans">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-charcoal mb-2">Lesson Not Found</h2>
        <p className="text-base text-charcoal">Please select a valid theory lesson from the Table of Contents syllabus.</p>
      </section>
    );
  }

  return (
    <article className="py-24 px-6 max-w-3xl mx-auto">
      <div className="border border-charcoal/10 bg-paper-light rounded-3xl p-8 md:p-12 shadow-premium relative overflow-hidden">
        <header className="border-b border-charcoal/10 pb-6 mb-8">
          <span className="font-sans text-base uppercase tracking-wider text-charcoal font-semibold">
            {lesson.chapter}
          </span>
          <h1 className="font-editorial text-3xl md:text-4xl font-bold text-charcoal tracking-tight mt-2 mb-4">
            {lesson.title}
          </h1>
          <div className="flex items-center gap-1.5 text-charcoal font-sans text-base">
            <BookOpen className="w-4 h-4 text-coral" />
            <span>Reading Duration: {lesson.duration}</span>
          </div>
        </header>

        {lesson.content}
      </div>
    </article>
  );
}
