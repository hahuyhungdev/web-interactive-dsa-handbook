import { useState, useEffect } from 'react';
import { BookOpen, Sparkles, AlertCircle, CheckCircle, XCircle, HelpCircle } from 'lucide-react';

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
        <p className="font-sans text-base uppercase tracking-widest text-coral-dark font-bold bg-coral/5 px-3 py-1 rounded-full border border-coral-dark/20 inline-block font-sans">
          Syllabus Core I.I
        </p>
        <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-coral first-letter:float-left first-letter:mr-3 first-letter:mt-1">
          Memory is fundamentally a linear tape. In modern hardware architectures, this tape is partitioned into bytes, each identified by a unique hexadecimal address. When we allocate an <strong>Array</strong>, the system guarantees a block of physical memory where elements are stored back-to-back—or <em>contiguously</em>.
        </p>

        <div className="bg-paper-dark border border-charcoal/10 rounded-2xl p-6 font-mono text-base my-8 shadow-inner">
          <h4 className="font-sans font-bold text-sm text-charcoal/60 uppercase tracking-wider mb-4 font-sans">Memory Map Layout (e.g. 32-bit Integer Array)</h4>
          <div className="flex flex-wrap gap-2 items-center justify-start">
            <div className="border border-charcoal/15 bg-paper p-3 rounded-lg text-center shrink-0 shadow-sm">
              <span className="block text-xs text-charcoal/50">BaseAddress (0x104)</span>
              <strong className="text-coral text-base">Index [0]</strong>
            </div>
            <div className="text-charcoal/30 text-base">➔</div>
            <div className="border border-charcoal/15 bg-paper p-3 rounded-lg text-center shrink-0 shadow-sm">
              <span className="block text-xs text-charcoal/50">Base + 4 Bytes (0x108)</span>
              <strong className="text-charcoal text-base">Index [1]</strong>
            </div>
            <div className="text-charcoal/30 text-base">➔</div>
            <div className="border border-charcoal/15 bg-paper p-3 rounded-lg text-center shrink-0 shadow-sm">
              <span className="block text-xs text-charcoal/50">Base + 8 Bytes (0x10C)</span>
              <strong className="text-charcoal text-base">Index [2]</strong>
            </div>
            <div className="text-charcoal/30 text-base">➔</div>
            <div className="border border-charcoal/15 bg-paper p-3 rounded-lg text-center shrink-0 shadow-sm">
              <span className="block text-xs text-charcoal/50">Base + 12 Bytes (0x110)</span>
              <strong className="text-charcoal text-base">Index [3]</strong>
            </div>
          </div>
        </div>

        <h3 className="font-editorial text-2xl font-bold text-charcoal pt-4">The Constant-Time Access Formula</h3>
        <p>
          Because elements are sized uniformly and arranged contiguously, finding the exact memory location of any index requires simple arithmetic rather than linear search:
        </p>
        <blockquote className="border-l-4 border-coral pl-4 italic bg-paper-dark/30 py-2.5 my-4 rounded-r-xl font-mono text-sm md:text-base text-charcoal/90">
          Address(Index i) = BaseAddress + (i × ElementSize)
        </blockquote>
        <p>
          This multiplication and addition is executed in a single CPU cycle. Thus, lookup in an array is <strong>O(1)</strong> (Constant Time), regardless of whether the array has 10 elements or 10 million.
        </p>

        <h3 className="font-editorial text-2xl font-bold text-charcoal pt-4">Core Array Operations & Complexities</h3>
        <div className="overflow-x-auto my-6 border border-charcoal/10 rounded-2xl">
          <table className="w-full text-left font-sans text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-charcoal/5 border-b border-charcoal/10">
                <th className="p-3 font-bold uppercase tracking-wider text-charcoal/70">Operation</th>
                <th className="p-3 font-bold uppercase tracking-wider text-charcoal/70">Complexity</th>
                <th className="p-3 font-bold uppercase tracking-wider text-charcoal/70">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5">
              <tr>
                <td className="p-3 font-mono font-bold">Access (by index)</td>
                <td className="p-3 text-coral font-bold font-mono">O(1)</td>
                <td className="p-3 text-charcoal/70">Direct memory addressing via base offset lookup.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold">Search (by value)</td>
                <td className="p-3 text-amber-600 font-bold font-mono">O(N)</td>
                <td className="p-3 text-charcoal/70">Requires scanning elements sequentially (Linear Search).</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold">Insert at Start</td>
                <td className="p-3 text-red-500 font-bold font-mono">O(N)</td>
                <td className="p-3 text-charcoal/70">Every existing element must shift one index to the right.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold">Insert at End</td>
                <td className="p-3 text-coral font-bold font-mono">O(1)*</td>
                <td className="p-3 text-charcoal/70">Constant time, unless a dynamic array capacity resize occurs.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold">Delete (from start/mid)</td>
                <td className="p-3 text-red-500 font-bold font-mono">O(N)</td>
                <td className="p-3 text-charcoal/70">Must shift subsequent elements left to close the memory gap.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="font-editorial text-2xl font-bold text-charcoal pt-4">Fixed-Size vs. Dynamic Arrays</h3>
        <p>
          Standard physical arrays are allocated with a <strong>fixed capacity</strong>. To overcome this limitation, modern languages implement <strong>Dynamic Arrays</strong> (e.g., JavaScript Arrays, Python Lists, or Java ArrayLists).
        </p>
        <p>
          A dynamic array wraps a fixed-size array. When elements are appended and the array fills up:
        </p>
        <ol className="list-decimal pl-6 space-y-2 text-base md:text-lg font-sans text-charcoal/80">
          <li>The system allocates a new internal array, typically <strong>doubling</strong> the capacity.</li>
          <li>All elements are copied over to the new contiguous block (an <code>O(N)</code> operation).</li>
          <li>The old memory block is freed.</li>
        </ol>
        <p>
          Because resizing occurs infrequently (exponentially rarer as the size grows), the <code>O(N)</code> cost is distributed across many insertions, resulting in an <strong>Amortized O(1)</strong> push complexity.
        </p>

        <h3 className="font-editorial text-2xl font-bold text-charcoal pt-4">Row-Major vs. Column-Major Layouts</h3>
        <p>
          Multi-dimensional arrays (like matrices) are also flattened contiguously in memory. In <strong>Row-Major</strong> ordering (used by JavaScript, C, and Python), matrices are stored row-by-row sequentially. In <strong>Column-Major</strong> ordering (used by Fortran and MATLAB), they are stored column-by-column.
        </p>
        <p>
          Understanding this layout is critical for nested loop optimization: walking a Row-Major array row-by-row utilizes cache correctly, whereas looping column-by-column causes constant cache misses.
        </p>

        <div className="border border-coral/20 bg-coral/5 p-5 rounded-2xl flex gap-3.5 items-start my-6 shadow-sm">
          <Sparkles className="w-5 h-5 text-coral shrink-0 mt-0.5 animate-pulse" />
          <div>
            <h4 className="font-sans font-bold text-base text-coral-dark uppercase tracking-wider">Cache Locality & The 64-Byte Cache Line</h4>
            <p className="text-base font-sans text-charcoal mt-1 leading-relaxed">
              When the CPU requests a byte from RAM, it retrieves a full <strong>64-byte block (a Cache Line)</strong> containing that byte and its neighbors. Because array elements reside back-to-back, fetching Index 0 automatically pre-loads subsequent indices into the super-fast L1 cache. This spatial locality makes iterating arrays significantly faster than traversing linked nodes dispersed across the heap.
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
  },
  'stack-queue-intro': {
    title: 'Stack & Queue Fundamentals',
    chapter: 'Chapter IV: Stacks & Queues',
    duration: '10 min',
    content: (
      <div className="space-y-6 font-editorial text-charcoal leading-relaxed text-base md:text-lg">
        <p className="font-sans text-base uppercase tracking-widest text-coral-dark font-bold bg-coral/5 px-3 py-1 rounded-full border border-coral-dark/20 inline-block">
          Syllabus Core IV.I
        </p>
        <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-coral first-letter:float-left first-letter:mr-3 first-letter:mt-1">
          Stacks and Queues are restricted linear data structures. Unlike general arrays or linked lists where elements can be accessed or modified at any arbitrary index, stacks and queues enforce strict policies on where operations can occur.
        </p>

        <h3 className="font-editorial text-2xl font-bold text-charcoal pt-4">The Stack: LIFO (Last-In, First-Out)</h3>
        <p>
          A Stack functions like a stack of plates: the last plate placed on top is the first one to be removed.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-base md:text-lg font-sans text-charcoal">
          <li><strong>Push:</strong> Add an element to the top of the stack — <strong>O(1)</strong> time.</li>
          <li><strong>Pop:</strong> Remove the element from the top of the stack — <strong>O(1)</strong> time.</li>
          <li><strong>Peek:</strong> View the top element without removing it — <strong>O(1)</strong> time.</li>
        </ul>

        <h3 className="font-editorial text-2xl font-bold text-charcoal pt-4">The Queue: FIFO (First-In, First-Out)</h3>
        <p>
          A Queue represents a waiting line: the first person to join the queue is the first to be served.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-base md:text-lg font-sans text-charcoal">
          <li><strong>Enqueue:</strong> Add an element to the rear (back) of the queue — <strong>O(1)</strong> time.</li>
          <li><strong>Dequeue:</strong> Remove the element from the front of the queue — <strong>O(1)</strong> time.</li>
          <li><strong>Front:</strong> View the front element without removing it — <strong>O(1)</strong> time.</li>
        </ul>
      </div>
    )
  },
  'bst-intro': {
    title: 'Binary Search Tree Fundamentals',
    chapter: 'Chapter V: Trees & Binary Search Trees',
    duration: '15 min',
    content: (
      <div className="space-y-6 font-editorial text-charcoal leading-relaxed text-base md:text-lg">
        <p className="font-sans text-base uppercase tracking-widest text-coral-dark font-bold bg-coral/5 px-3 py-1 rounded-full border border-coral-dark/20 inline-block">
          Syllabus Core V.I
        </p>
        <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-coral first-letter:float-left first-letter:mr-3 first-letter:mt-1">
          A Tree is a hierarchical non-linear data structure. A <strong>Binary Tree</strong> is a special tree where each node has at most two children: a left child and a right child.
        </p>

        <h3 className="font-editorial text-2xl font-bold text-charcoal pt-4">The Binary Search Tree Property</h3>
        <p>
          A <strong>Binary Search Tree (BST)</strong> enforces an ordering constraint on its nodes:
        </p>
        <blockquote className="border-l-4 border-coral pl-4 italic bg-paper-dark/30 py-2 my-4 rounded-r-xl font-sans text-base">
          For any node N, all values in N's left subtree are strictly less than N's value, and all values in N's right subtree are strictly greater than N's value.
        </blockquote>

        <h3 className="font-editorial text-2xl font-bold text-charcoal pt-4">BST Time Complexities</h3>
        <p>
          This property enables fast search, insertion, and deletion:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-base md:text-lg font-sans text-charcoal">
          <li><strong>Balanced Tree:</strong> Operations take logarithmic time — <strong>O(log N)</strong>.</li>
          <li><strong>Skewed Tree:</strong> (Worst case, where the tree degrades into a linked list) — <strong>O(N)</strong>.</li>
        </ul>
      </div>
    )
  },
  'hash-table-intro': {
    title: 'Hash Table Fundamentals',
    chapter: 'Chapter VI: Hash Tables & Hashing',
    duration: '12 min',
    content: (
      <div className="space-y-6 font-editorial text-charcoal leading-relaxed text-base md:text-lg">
        <p className="font-sans text-base uppercase tracking-widest text-coral-dark font-bold bg-coral/5 px-3 py-1 rounded-full border border-coral-dark/20 inline-block">
          Syllabus Core VI.I
        </p>
        <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-coral first-letter:float-left first-letter:mr-3 first-letter:mt-1">
          A Hash Table is a data structure that implements an associative array abstract data type, mapping keys to values. It uses a mathematical <strong>Hash Function</strong> to compute an index into an array of buckets or slots.
        </p>

        <h3 className="font-editorial text-2xl font-bold text-charcoal pt-4">The Hashing Mechanism</h3>
        <p>
          The hashing process consists of two primary steps:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-base md:text-lg font-sans text-charcoal">
          <li><strong>Hash Computation:</strong> Transforming a variable-length key (like a string) into a numeric hash code.</li>
          <li><strong>Modulo Compression:</strong> Compressing the hash code into the array size using the modulo operator (<code>index = hashCode % arraySize</code>).</li>
        </ul>

        <h3 className="font-editorial text-2xl font-bold text-charcoal pt-4">Collision Resolution</h3>
        <p>
          Since two distinct keys can hash to the same bucket index, we need collision resolution. <strong>Separate Chaining</strong> builds a linked list (or chain) of entries inside each bucket to store multiple key-value pairs at the same index.
        </p>
      </div>
    )
  },
  'graph-intro': {
    title: 'Graph Representation & Traversals',
    chapter: 'Chapter VII: Graphs & Traversals',
    duration: '15 min',
    content: (
      <div className="space-y-6 font-editorial text-charcoal leading-relaxed text-base md:text-lg">
        <p className="font-sans text-base uppercase tracking-widest text-coral-dark font-bold bg-coral/5 px-3 py-1 rounded-full border border-coral-dark/20 inline-block">
          Syllabus Core VII.I
        </p>
        <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-coral first-letter:float-left first-letter:mr-3 first-letter:mt-1">
          A Graph is a non-linear network consisting of a set of <strong>Vertices (Nodes)</strong> and a set of <strong>Edges</strong> connecting them. Graphs are ideal for modeling networks like social connections, maps, or dependencies.
        </p>

        <h3 className="font-editorial text-2xl font-bold text-charcoal pt-4">Graph Traversals: BFS & DFS</h3>
        <p>
          Traversal means visiting all nodes in a graph systematically:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-base md:text-lg font-sans text-charcoal">
          <li><strong>Breadth-First Search (BFS):</strong> Explores node layer-by-layer, visiting all neighbors first before going deeper. Uses a <strong>Queue</strong> (FIFO).</li>
          <li><strong>Depth-First Search (DFS):</strong> Explores as deep as possible down each branch before backtracking. Uses a <strong>Stack</strong> (LIFO) or recursion.</li>
        </ul>
      </div>
    )
  }
};

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const QUIZ_DATA: Record<string, QuizQuestion[]> = {
  'contiguous-memory': [
    {
      question: "Which formula is used to calculate the exact physical memory address of index i in a contiguous array?",
      options: [
        "Address(i) = BaseAddress + i",
        "Address(i) = BaseAddress + (i × ElementSize)",
        "Address(i) = BaseAddress × (i + ElementSize)",
        "Address(i) = BaseAddress + (i / ElementSize)"
      ],
      correctAnswer: 1,
      explanation: "Since array elements are stored back-to-back contiguously in memory, we compute the offset by multiplying the index by the uniform size of each element, then adding it to the starting base address: Address(i) = BaseAddress + (i × ElementSize)."
    },
    {
      question: "What is the amortized time complexity of inserting an element at the end of a Dynamic Array?",
      options: [
        "O(N)",
        "O(log N)",
        "O(1)",
        "O(N²)"
      ],
      correctAnswer: 2,
      explanation: "Appends to a dynamic array run in O(1) time. Although resizing the array to double its capacity is an O(N) operation, this capacity doubling happens very rarely (exponentially decreasing frequency), distributing the cost so the average/amortized cost is constant O(1)."
    }
  ],
  'sorting-taxonomy': [
    {
      question: "What does it mean for a sorting algorithm to be 'Stable'?",
      options: [
        "It uses O(1) auxiliary memory.",
        "It preserves the relative order of elements with equal keys/values.",
        "It always runs in O(N log N) time regardless of input ordering.",
        "It does not perform any element swaps during execution."
      ],
      correctAnswer: 1,
      explanation: "Stability in sorting means that if two elements have equal keys/values, their relative sequence/order is preserved in the sorted output just as they appeared in the unsorted input."
    },
    {
      question: "Which of the following sorting algorithms is NOT comparison-based?",
      options: [
        "Quick Sort",
        "Merge Sort",
        "Radix Sort",
        "Selection Sort"
      ],
      correctAnswer: 2,
      explanation: "Radix Sort is a non-comparison sort that sorts keys by processing individual digits. It bypasses the comparison-based O(N log N) theoretical limit, achieving O(N) complexity under specific numeric constraints."
    }
  ],
  'pointers-references': [
    {
      question: "What is the time complexity of accessing the k-th node in a Singly Linked List?",
      options: [
        "O(1)",
        "O(k)",
        "O(N)",
        "O(log N)"
      ],
      correctAnswer: 2,
      explanation: "Unlike arrays with contiguous memory addressing, linked list nodes are scattered across the heap. To reach node k, we must start at the Head node and traverse pointers sequentially, taking O(N) time in the worst case (or proportional to k)."
    },
    {
      question: "Why does traversing an array sequentially generally perform faster than traversing a linked list of equal size in real hardware?",
      options: [
        "Linked lists have larger values which take more CPU cycles to process.",
        "Arrays benefit from cache locality because contiguous memory is pre-loaded into CPU cache lines.",
        "Array addresses are smaller in size than pointer addresses.",
        "Linked lists require recursive traversal which adds call stack overhead."
      ],
      correctAnswer: 1,
      explanation: "Arrays exhibit strong spatial locality because elements reside contiguously. When the CPU fetches an array element from RAM, it loads an entire 64-byte Cache Line containing adjacent elements. Linked list nodes are scattered, resulting in frequent cache misses."
    }
  ],
  'stack-queue-intro': [
    {
      question: "Which operations are supported by a Stack, and what is its access order policy?",
      options: [
        "Enqueue & Dequeue, FIFO (First-In, First-Out)",
        "Push & Pop, LIFO (Last-In, First-Out)",
        "Insert & Remove, LIFO (Last-In, First-Out)",
        "Add & Extract, FIFO (First-In, First-Out)"
      ],
      correctAnswer: 1,
      explanation: "A Stack is a LIFO (Last-In, First-Out) structure where the most recently added element (Pushed) is the first to be retrieved (Popped)."
    },
    {
      question: "Which data structure is typically used to manage nodes in a Breadth-First Search (BFS) graph traversal?",
      options: [
        "Stack",
        "Queue",
        "Binary Tree",
        "Priority Queue"
      ],
      correctAnswer: 1,
      explanation: "BFS explores nodes level-by-level, meaning neighbors are visited in the order they are discovered (FIFO). A Queue is used to track neighbors waiting to be expanded."
    }
  ],
  'bst-intro': [
    {
      question: "In a Binary Search Tree (BST), what is the relationship between any node N and its subtrees?",
      options: [
        "All nodes in the left subtree are greater than N, and all nodes in the right subtree are less than N.",
        "Both subtrees must have the exact same height.",
        "All nodes in the left subtree are less than N, and all nodes in the right subtree are greater than N.",
        "Every node can have any arbitrary number of child nodes."
      ],
      correctAnswer: 2,
      explanation: "The defining BST property is that for any node N, all values in N's left subtree are strictly less than N's value, and all values in N's right subtree are strictly greater than N's value."
    }
  ],
  'hash-table-intro': [
    {
      question: "What is Separate Chaining in Hash Tables?",
      options: [
        "A method of sizing the array to be a prime number.",
        "A collision resolution technique where each bucket stores a linked list of colliding elements.",
        "A technique to compute the modulo compression without Division.",
        "A mechanism to encrypt keys for secure lookups."
      ],
      correctAnswer: 1,
      explanation: "Separate Chaining is a collision resolution technique. When multiple keys hash to the same bucket index, we store them as a chain (typically a linked list) within that index bucket."
    }
  ],
  'graph-intro': [
    {
      question: "What is the time complexity of Depth-First Search (DFS) on a graph represented as an Adjacency List with V vertices and E edges?",
      options: [
        "O(V)",
        "O(E)",
        "O(V + E)",
        "O(V × E)"
      ],
      correctAnswer: 2,
      explanation: "DFS visits every vertex exactly once and checks all of its outgoing edges once, resulting in O(V + E) complexity."
    }
  ]
};

interface TheoryContentProps {
  lessonId: string | undefined;
}

export function TheoryContent({ lessonId }: TheoryContentProps) {
  const lesson = lessonId ? THEORY_CONTENT[lessonId] : null;

  // Quiz state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  // Reset quiz on lesson change
  useEffect(() => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsSubmitted(false);
    setIsFinished(false);
    setScore(0);
  }, [lessonId]);

  if (!lesson) {
    return (
      <section className="py-12 px-6 max-w-3xl mx-auto text-center font-sans">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-charcoal mb-2">Lesson Not Found</h2>
        <p className="text-base text-charcoal">Please select a valid theory lesson from the Table of Contents syllabus.</p>
      </section>
    );
  }

  const quizQuestions = lessonId ? QUIZ_DATA[lessonId] || [] : [];
  const hasQuiz = quizQuestions.length > 0;
  const currentQuestion = quizQuestions[currentIdx];

  const handleOptionSelect = (optIndex: number) => {
    if (isSubmitted) return;
    setSelectedOpt(optIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedOpt === null || isSubmitted) return;
    setIsSubmitted(true);
    if (selectedOpt === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOpt(null);
    setIsSubmitted(false);
    if (currentIdx + 1 < quizQuestions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsSubmitted(false);
    setIsFinished(false);
    setScore(0);
  };

  return (
    <article className="py-10 px-4 md:px-6 max-w-3xl mx-auto">
      <div className="border border-charcoal/10 bg-paper-light rounded-3xl p-6 md:p-10 shadow-premium relative overflow-hidden">
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

        {/* Quiz Section */}
        {hasQuiz && (
          <div className="mt-12 pt-8 border-t border-charcoal/10">
            <div className="border border-charcoal/10 bg-paper-dark/30 rounded-2xl p-6 md:p-8 shadow-inner">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="w-5 h-5 text-coral shrink-0" />
                <h3 className="font-editorial text-xl font-bold text-charcoal">
                  Knowledge Check
                </h3>
              </div>

              {!isFinished ? (
                <div className="space-y-6">
                  {/* Progress bar */}
                  <div className="flex items-center justify-between gap-4 shrink-0">
                    <span className="font-sans text-xs font-black uppercase tracking-wider text-charcoal/45">
                      Question {currentIdx + 1} of {quizQuestions.length}
                    </span>
                    <div className="flex gap-1">
                      {quizQuestions.map((_, i) => (
                        <span
                          key={i}
                          className={`w-4 h-1 rounded-full transition-all duration-300 ${
                            i === currentIdx
                              ? "bg-coral w-6"
                              : i < currentIdx
                                ? "bg-emerald-500"
                                : "bg-charcoal/10"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="font-sans font-bold text-charcoal text-base md:text-lg leading-snug">
                    {currentQuestion.question}
                  </p>

                  <div className="space-y-2.5">
                    {currentQuestion.options.map((opt, optIdx) => {
                      const isSelected = selectedOpt === optIdx;
                      const isCorrect = optIdx === currentQuestion.correctAnswer;

                      let btnStyle = "border-charcoal/15 bg-paper hover:bg-charcoal/[0.03] text-charcoal";
                      let indicatorStyle = "border-charcoal/20";

                      if (isSubmitted) {
                        if (isCorrect) {
                          btnStyle = "border-emerald-500 bg-emerald-50/50 text-emerald-800 font-extrabold";
                          indicatorStyle = "border-emerald-500 bg-emerald-500 text-paper";
                        } else if (isSelected) {
                          btnStyle = "border-red-400 bg-red-50/50 text-red-800";
                          indicatorStyle = "border-red-500 bg-red-500 text-paper";
                        } else {
                          btnStyle = "border-charcoal/5 bg-paper/30 text-charcoal/40 opacity-60";
                        }
                      } else if (isSelected) {
                        btnStyle = "border-coral bg-coral/[0.02] text-charcoal shadow-sm ring-1 ring-coral/20";
                        indicatorStyle = "border-coral bg-coral text-paper";
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleOptionSelect(optIdx)}
                          disabled={isSubmitted}
                          className={`flex items-center gap-3.5 w-full text-left p-3.5 rounded-xl border font-sans text-sm font-semibold transition-all duration-150 ${btnStyle}`}
                        >
                          <span className={`w-5 h-5 rounded-full border flex items-center justify-center font-mono text-[10px] shrink-0 transition-colors ${indicatorStyle}`}>
                            {isSubmitted && isCorrect ? (
                              <CheckCircle className="w-3.5 h-3.5 text-paper" />
                            ) : isSubmitted && isSelected ? (
                              <XCircle className="w-3.5 h-3.5 text-paper" />
                            ) : (
                              String.fromCharCode(65 + optIdx)
                            )}
                          </span>
                          <span className="flex-1 leading-snug">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Submission and Explanations */}
                  {isSubmitted && (
                    <div className="bg-paper border border-charcoal/5 rounded-xl p-4 shadow-sm space-y-2">
                      <div className="flex items-center gap-2">
                        {selectedOpt === currentQuestion.correctAnswer ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                            <span className="font-sans font-bold text-emerald-700 uppercase tracking-wider text-xs">Correct!</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                            <span className="font-sans font-bold text-red-600 uppercase tracking-wider text-xs">Incorrect</span>
                          </>
                        )}
                      </div>
                      <p className="font-sans text-xs text-charcoal/70 leading-relaxed">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    {!isSubmitted ? (
                      <button
                        type="button"
                        onClick={handleSubmitAnswer}
                        disabled={selectedOpt === null}
                        className={`px-5 py-2.5 rounded-xl font-sans text-xs font-black uppercase tracking-wider transition-spring shadow-sm ${
                          selectedOpt === null
                            ? "bg-charcoal/10 text-charcoal/40 cursor-not-allowed border border-charcoal/5"
                            : "bg-coral text-paper hover-spring active-spring cursor-pointer"
                        }`}
                      >
                        Submit Answer
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleNextQuestion}
                        className="px-5 py-2.5 bg-charcoal text-paper rounded-xl font-sans text-xs font-black uppercase tracking-wider transition-spring hover-spring active-spring cursor-pointer"
                      >
                        {currentIdx + 1 < quizQuestions.length ? "Next Question" : "Finish Quiz"}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 space-y-6">
                  <div className="flex justify-center">
                    <Sparkles className="w-12 h-12 text-coral animate-bounce" />
                  </div>
                  <div>
                    <h4 className="font-editorial text-2xl font-bold text-charcoal">
                      Quiz Completed!
                    </h4>
                    <p className="font-sans text-base text-charcoal/70 mt-1">
                      You scored <strong className="text-coral font-mono text-lg">{score}</strong> out of <strong className="font-mono text-lg">{quizQuestions.length}</strong> correct.
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={handleRestartQuiz}
                      className="px-6 py-3 bg-coral text-paper rounded-xl font-sans text-sm font-bold uppercase tracking-wider shadow-sm transition-spring hover-spring active-spring cursor-pointer"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
