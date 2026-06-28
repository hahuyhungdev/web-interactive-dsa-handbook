# Project: Web Interactive DSA Handbook

## Architecture
- **Framework**: React (v18) + Vite + Tailwind CSS.
- **Routing**: React Router DOM v7 (in `src/app/App.tsx`).
- **Layout**: `MainLayout` wraps the entire app, providing a global `Navbar`, dynamic `TableOfContents`, and a `KeyboardHelpOverlay`.
- **Feature Modules** (under `src/features/`):
  - `sorting`: Sorting algorithms visualizer (Bubble, Selection, Insertion, Quick, Merge).
  - `linked-list`: Singly/Doubly Linked List operations visualizer.
  - `hash-table`: Hash table collision resolution visualizer.
  - `graph`: Graph traversals (BFS, DFS) and shortest path visualizer.
  - `tree`: Binary Search Tree (BST) operations visualizer.
  - `stack-queue`: Stack and Queue operations visualizer.
  - `search`: Linear and Binary Search visualizer.
  - `theory`: Markdown/interactive theory pages.
  - `practice`: Practice challenges.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | M1: Browser-Based Audit | Perform Playwright-driven audit of all visualizers and theory guides to identify all bugs, errors, layout breaks, and UX shortcomings. | None | PLANNED |
| 2 | M2: Refactor UI/UX & Styling | Implement premium, cohesive design system, responsive styles, smooth animations, and visualizer improvements. | M1 | PLANNED |
| 3 | M3: Enhance Interactive Features | Fix playback controls, CodeMirror integration, dynamic highlighting, speed slider, step backward/forward logic, and node states. | M2 | PLANNED |
| 4 | M4: E2E Test Suite | Expand and update Playwright tests to ensure 100% test pass rate and prevent regressions. | M3 | PLANNED |
| 5 | M5: Hardening & Auditing | Forensic integrity audit & adversarial hardening. | M4 | PLANNED |

## Interface Contracts
- Visualizer components must conform to the `VisualizerFrame` state management and control parameters.
- CodeViewer components must sync highlight markers with visualizer step index.
- Layout must be responsive on mobile (≤640px), tablet (640px - 1024px), and desktop (≥1024px).
