import type { Chapter } from "@/shared/types";

export const CHAPTERS: Chapter[] = [
  {
    id: "arrays",
    number: "I",
    title: "Contiguous Memory & Arrays",
    description:
      "Explore linear memory layouts, memory addressing, and fundamental array manipulation algorithms.",
    lessons: [
      {
        title: "The Contiguous Memory Model",
        type: "theory",
        duration: "10 min",
      },
      {
        title: "Linear Search & Binary Search",
        type: "visualizer",
        duration: "15 min",
      },
      { title: "Challenge: Two Sum", type: "practice", duration: "20 min" },
    ],
  },
  {
    id: "sorting",
    number: "II",
    title: "The Art of Sorting",
    description:
      "Understand comparison-based sorting paradigms. Visualize five algorithms — from quadratic swaps to logarithmic divide-and-conquer — step-by-step.",
    lessons: [
      {
        title: "Sorting Taxonomy & Complexity",
        type: "theory",
        duration: "12 min",
      },
      {
        title: "Bubble Sort Visualizer",
        type: "visualizer",
        duration: "25 min",
      },
      {
        title: "Selection Sort Visualizer",
        type: "visualizer",
        duration: "20 min",
      },
      {
        title: "Insertion Sort Visualizer",
        type: "visualizer",
        duration: "18 min",
      },
      {
        title: "Quick Sort Visualizer",
        type: "visualizer",
        duration: "22 min",
      },
      {
        title: "Merge Sort Visualizer",
        type: "visualizer",
        duration: "24 min",
      },
      {
        title: "Challenge: Max Value in Array",
        type: "practice",
        duration: "15 min",
      },
    ],
  },
  {
    id: "linked-lists",
    number: "III",
    title: "Dynamic Nodes & Linked Lists",
    description:
      "Break free from contiguous blocks. Master node structures, pointer manipulation, and traversal mechanics.",
    lessons: [
      {
        title: "Nodes, Pointers & References",
        type: "theory",
        duration: "15 min",
      },
      {
        title: "Singly Linked List Visualizer",
        type: "visualizer",
        duration: "30 min",
      },
      {
        title: "Challenge: Reverse Linked List",
        type: "practice",
        duration: "25 min",
      },
    ],
  },
];
