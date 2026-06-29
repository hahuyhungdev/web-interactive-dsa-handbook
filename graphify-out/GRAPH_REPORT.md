# Graph Report - web-interactive-dsa-handbook  (2026-06-29)

## Corpus Check
- 146 files · ~369,778 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 912 nodes · 1150 edges · 96 communities (66 shown, 30 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4d189db7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 91|Community 91]]
- [[_COMMUNITY_Community 92|Community 92]]
- [[_COMMUNITY_Community 93|Community 93]]
- [[_COMMUNITY_Community 94|Community 94]]
- [[_COMMUNITY_Community 95|Community 95]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 20 edges
2. `main()` - 15 edges
3. `main()` - 15 edges
4. `main()` - 15 edges
5. `usePlayback()` - 15 edges
6. `usePlaybackKeyboard()` - 15 edges
7. `makeFrame()` - 11 edges
8. `BRIEFING — 2026-06-28T20:57:39+07:00` - 11 edges
9. `BRIEFING — 2026-06-28T10:51:10Z` - 11 edges
10. `BRIEFING — 2026-06-28T20:53:00+07:00` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Interactive DSA Handbook Feature Model` --semantically_similar_to--> `Architecture`  [INFERRED] [semantically similar]
  CARTESIAN_ANALYSIS.md → PROJECT.md
- `Record-then-Replay Pattern` --conceptually_related_to--> `Interactive DSA Handbook Feature Model`  [INFERRED]
  INTERACTIVE_UPGRADE.md → CARTESIAN_ANALYSIS.md
- `TestGroupAnagrams` --uses--> `Solution`  [INFERRED]
  scratch/leetcode/test_group_anagrams.py → scratch/leetcode/group_anagrams.py
- `ChaptersPage()` --calls--> `useActiveLesson()`  [EXTRACTED]
  src/pages/chapters/index.tsx → src/app/lesson-sync.tsx
- `HashTableWorkspace()` --calls--> `usePlayback()`  [EXTRACTED]
  src/features/hash-table/components/HashTableWorkspace.tsx → src/shared/hooks/usePlayback.ts

## Import Cycles
- 1-file cycle: `src/pages/graph/index.tsx -> src/pages/graph/index.tsx`
- 1-file cycle: `src/pages/hash-table/index.tsx -> src/pages/hash-table/index.tsx`
- 1-file cycle: `src/pages/linked-list/index.tsx -> src/pages/linked-list/index.tsx`
- 1-file cycle: `src/pages/search/index.tsx -> src/pages/search/index.tsx`
- 1-file cycle: `src/pages/sorting/index.tsx -> src/pages/sorting/index.tsx`
- 1-file cycle: `src/pages/stack-queue/index.tsx -> src/pages/stack-queue/index.tsx`
- 1-file cycle: `src/pages/tree/index.tsx -> src/pages/tree/index.tsx`

## Hyperedges (group relationships)
- **Record-then-Replay Architecture Flow** — interactive_upgrade_record_replay, interactive_upgrade_generate_frames, interactive_upgrade_sorting_workspace, interactive_upgrade_sorting_visualizer, interactive_upgrade_code_viewer [EXTRACTED 0.95]
- **E2E Test Interface Selector Contracts** — test_infra_playback_controls, test_infra_sorting_visualizer, test_infra_linked_list_visualizer, test_infra_practice_challenges [EXTRACTED 0.90]

## Communities (96 total, 30 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (35): App(), ChaptersPage, GraphPage, HashTablePage, HomePage, LinkedListPage, NotFoundPage, PracticePage (+27 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (34): InsertPosition, LinkedListVisualizer(), LinkedListVisualizerProps, SortingArrayEditor(), SortingArrayEditorProps, SortingVisualizer(), SortingVisualizerProps, STATUS_STYLE (+26 more)

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (36): NODE_FILL, NODE_STROKE, TreeVisualizer(), TreeVisualizerProps, CODE_MAP, makeIdleFrame(), OP_TABS, TreeOp (+28 more)

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (37): dependencies, @codemirror/lang-javascript, @codemirror/view, lucide-react, motion, @radix-ui/react-slider, react, react-dom (+29 more)

### Community 4 - "Community 4"
Cohesion: 0.12
Nodes (24): BUCKET_STYLE, ENTRY_STYLE, HashTableVisualizer(), HashTableVisualizerProps, CODE_MAP, HashOp, HashTableWorkspace(), makeIdleFrame() (+16 more)

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (12): BinarySearchVisualizerProps, BOILERPLATES, CodeVisualizerProps, PracticeSection(), PracticeSectionProps, StackParenthesesVisualizerProps, TabId, TEST_CASES (+4 more)

### Community 6 - "Community 6"
Cohesion: 0.09
Nodes (22): compilerOptions, allowImportingTsExtensions, baseUrl, esModuleInterop, isolatedModules, jsx, lib, module (+14 more)

### Community 7 - "Community 7"
Cohesion: 0.19
Nodes (19): _clean_command_name(), combined_tool_content(), get_graphify_count(), graph_json_denial(), graph_report_denial(), graphify_skill_denial(), is_doc_context_file(), is_exact_file_path() (+11 more)

### Community 8 - "Community 8"
Cohesion: 0.19
Nodes (19): _clean_command_name(), combined_tool_content(), get_graphify_count(), graph_json_denial(), graph_report_denial(), graphify_skill_denial(), is_doc_context_file(), is_exact_file_path() (+11 more)

### Community 9 - "Community 9"
Cohesion: 0.17
Nodes (17): EDGE_STYLES, GraphVisualizer(), GraphVisualizerProps, NODE_COLORS, NODE_IDS, cloneNodes(), makeFrame(), cloneEdges() (+9 more)

### Community 10 - "Community 10"
Cohesion: 0.19
Nodes (19): _clean_command_name(), combined_tool_content(), get_graphify_count(), graph_json_denial(), graph_report_denial(), graphify_skill_denial(), is_doc_context_file(), is_exact_file_path() (+11 more)

### Community 11 - "Community 11"
Cohesion: 0.11
Nodes (17): 1. Main Layout Sidebar Collapse, 1. Observation, 2. BST SVG Scrollable Container, 2. Logic Chain, 3. Caveats, 3. Hash Table Buckets Flex Alignment, 4. Conclusion, 4. Graph Visualizer Node Text Size & Code Viewer Fixes (+9 more)

### Community 12 - "Community 12"
Cohesion: 0.06
Nodes (33): 1. Record-then-replay (the core mental model), 2. Registry pattern (data-driven, single source of truth), 3. Code ↔ frame sync via markers, 4. The animation technique (and the flicker fix), 5. URL as state (deep-linkable tabs), 6. Component seam (state vs. render), a. Stable identity, not position, b. `layout="position"` — slide, never scale (+25 more)

### Community 13 - "Community 13"
Cohesion: 0.12
Nodes (17): 1. Observation, 2. Logic Chain, 3. Caveats, 4. Conclusion & Recommended Fix Strategies, 5. Verification Method, Cross-Workspace Layout Parity, General Stability, Handoff Report — Browser-Based Visualizer Audit (+9 more)

### Community 14 - "Community 14"
Cohesion: 0.13
Nodes (14): 1. Smoke & Network Pass, 2. Responsive Visual Pass, 3. Accessibility (A11y) Pass, 🔍 Browser QA Checklists, 📊 E2E Test Report Template, 📦 Page Object Model (POM) Design, Phase 1: Boot & Port Check, Phase 2: Spec Execution with Observability (+6 more)

### Community 15 - "Community 15"
Cohesion: 0.20
Nodes (6): SearchArrayEditorProps, SearchFrame, VisualFrame, PlaybackControls(), PlaybackControlsProps, SHORTCUTS

### Community 16 - "Community 16"
Cohesion: 0.31
Nodes (8): GraphWorkspace(), CODE_SNIPPETS, LinkedListWorkspace(), SearchVisualizer(), StackQueueWorkspace(), usePlayback(), UsePlaybackOptions, usePlaybackKeyboard()

### Community 17 - "Community 17"
Cohesion: 0.15
Nodes (12): 1. Premium UI & Table of Contents, 2. Playback Controls, 3. Sorting Visualizer, 4. Linked List Visualizer, 5. Practice Challenges & Sandbox, Coverage Thresholds, E2E Test Infra: Web-Based Interactive DSA Handbook, Feature Inventory (+4 more)

### Community 18 - "Community 18"
Cohesion: 0.15
Nodes (12): Continuous Mode, Integration with Hooks, Output Format, Phase 1: Build Verification, Phase 2: Type Check, Phase 3: Lint Check, Phase 4: Test Suite, Phase 5: Security Scan (+4 more)

### Community 19 - "Community 19"
Cohesion: 0.15
Nodes (12): 10. Playback Scrubber Touch Target, 1. Main Layout Table of Contents (TOC) Mobile Stacking, 2026-06-28T10:32:22Z, 2. BST (Tree) Visualizer Legibility, 3. Hash Table Buckets scroll origin, 4. Graph Visualizer Node Text Size & Code Viewer Fixes, 5. Search Visualizer Array Responsiveness, 6. Sorting Visualizer Responsive Bar Widths (+4 more)

### Community 20 - "Community 20"
Cohesion: 0.15
Nodes (12): Continuous Mode, Integration with Hooks, Output Format, Phase 1: Build Verification, Phase 2: Type Check, Phase 3: Lint Check, Phase 4: Test Suite, Phase 5: Security Scan (+4 more)

### Community 21 - "Community 21"
Cohesion: 0.17
Nodes (11): Active Timers, Artifact Index, BRIEFING — 2026-06-28T20:57:39+07:00, Current Parent, 🔒 Key Constraints, Key Decisions Made, Mission, 🔒 My Identity (+3 more)

### Community 22 - "Community 22"
Cohesion: 0.17
Nodes (11): Artifact Index, BRIEFING — 2026-06-28T10:51:10Z, Change Tracker, Current Parent, 🔒 Key Constraints, Key Decisions Made, Loaded Skills, Mission (+3 more)

### Community 23 - "Community 23"
Cohesion: 0.17
Nodes (11): Artifact Index, BRIEFING — 2026-06-28T20:53:00+07:00, Change Tracker, Current Parent, 🔒 Key Constraints, Key Decisions Made, Loaded Skills, Mission (+3 more)

### Community 24 - "Community 24"
Cohesion: 0.17
Nodes (11): Artifact Index, BRIEFING — 2026-06-28T13:57:33Z, Change Tracker, Current Parent, 🔒 Key Constraints, Key Decisions Made, Loaded Skills, Mission (+3 more)

### Community 25 - "Community 25"
Cohesion: 0.17
Nodes (11): Artifact Index, BRIEFING — 2026-06-28T17:33:00+07:00, Change Tracker, Current Parent, 🔒 Key Constraints, Key Decisions Made, Loaded Skills, Mission (+3 more)

### Community 26 - "Community 26"
Cohesion: 0.18
Nodes (10): Acceptance Criteria, Initial Request — 2026-06-28T17:08:24Z, Original User Request, R1. Real-Browser Interactive Audit, R2. Premium UI/UX Polish, R3. Automated Test Verification, Requirements, Technical & Functional (+2 more)

### Community 27 - "Community 27"
Cohesion: 0.15
Nodes (14): Cartesian.app Feature Set, Interactive DSA Handbook Feature Model, CodeViewer, generateFrames.ts, Record-then-Replay Pattern, sortRegistry.ts, SortingVisualizer, SortingWorkspace (+6 more)

### Community 28 - "Community 28"
Cohesion: 0.18
Nodes (10): Acceptance Criteria, Initial Request — 2026-06-28T17:08:24Z, Original User Request, R1. Real-Browser Interactive Audit, R2. Premium UI/UX Polish, R3. Automated Test Verification, Requirements, Technical & Functional (+2 more)

### Community 29 - "Community 29"
Cohesion: 0.18
Nodes (10): 1. Observation, 2. Logic Chain, 3. Caveats, 4. Conclusion, 5. Verification Method, Command Executed, Comprehensive Browser-Based Audit Report, Direct Outputs and Results (+2 more)

### Community 30 - "Community 30"
Cohesion: 0.17
Nodes (11): 1. What is Cartesian.app?, 2. Core Feature Analysis, 3. Structural Comparison Matrix, 4. Recommendations for Expanding Our Repo, A. Procedural & Interactive Visualizations, Analysis of Cartesian.app Features and Comparison with Our Repository, B. Playback Controls & Frame Steppers, C. Synchronized Code Playback (Visual Debugger) (+3 more)

### Community 31 - "Community 31"
Cohesion: 0.16
Nodes (11): Mode, MODES, StackQueueVisualizer(), StackQueueVisualizerProps, STATUS_STYLE, Mode, generateQueueFrames(), generateStackPushPopFrames() (+3 more)

### Community 32 - "Community 32"
Cohesion: 0.20
Nodes (9): 1. Core Workflow, 2.5. Anti-Loop Debugging, 2. Token & Context Management, 3. MCP & Tools Integration, 4. UI/UX Aesthetics, 5. Specialized Agents, 6. Graphify — Knowledge Graph Navigation, Global Copilot Instructions for ECC (+1 more)

### Community 33 - "Community 33"
Cohesion: 0.20
Nodes (9): Artifact Index, Audit Progress, Audit Scope, BRIEFING — 2026-06-28T13:54:35Z, Current Parent, 🔒 Key Constraints, Key Decisions Made, Mission (+1 more)

### Community 34 - "Community 34"
Cohesion: 0.20
Nodes (9): Artifact Index, Audit Progress, Audit Scope, BRIEFING — 2026-06-28T20:57:30+07:00, Current Parent, 🔒 Key Constraints, Key Decisions Made, Mission (+1 more)

### Community 35 - "Community 35"
Cohesion: 0.16
Nodes (10): BINARY_SEARCH_CODE, CodeViewer(), CodeViewerProps, LINEAR_SEARCH_CODE, LINKED_LIST_CODE, THEORY_CONTENT, TheoryContent(), TheoryContentProps (+2 more)

### Community 36 - "Community 36"
Cohesion: 0.27
Nodes (5): AlgoId, GraphSection(), buildDefaultGraph(), BFS_CODE, DFS_CODE

### Community 37 - "Community 37"
Cohesion: 0.22
Nodes (8): Artifact Index, BRIEFING — 2026-06-28T17:08:24+07:00, 🔒 Key Constraints, Mission, 🔒 My Identity, Project Status, User Context, Victory Audit Status

### Community 38 - "Community 38"
Cohesion: 0.22
Nodes (8): 1. Observation, 2. Logic Chain, 3. Caveats, 4. Conclusion, 5. Verification Method, Forensic Audit Report, Handoff Report — Forensic Integrity Audit, Phase Results

### Community 39 - "Community 39"
Cohesion: 0.22
Nodes (8): Artifact Index, BRIEFING — 2026-06-28T17:14:30+07:00, Current Parent, Investigation State, 🔒 Key Constraints, Key Decisions Made, Mission, 🔒 My Identity

### Community 40 - "Community 40"
Cohesion: 0.22
Nodes (8): Artifact Index, BRIEFING — 2026-06-28T17:13:00+07:00, Current Parent, Investigation State, 🔒 Key Constraints, Key Decisions Made, Mission, 🔒 My Identity

### Community 41 - "Community 41"
Cohesion: 0.22
Nodes (8): Artifact Index, BRIEFING — 2026-06-28T17:35:00+07:00, Current Parent, Investigation State, 🔒 Key Constraints, Key Decisions Made, Mission, 🔒 My Identity

### Community 43 - "Community 43"
Cohesion: 0.29
Nodes (6): Active Subagents, Handoff Report — 2026-06-28T20:54:45+07:00, Key Artifacts, Milestone State, Pending Decisions, Remaining Work

### Community 44 - "Community 44"
Cohesion: 0.29
Nodes (6): Caveats, Conclusion, Handoff Report — Sentinel Initial Setup, Logic Chain, Observation, Verification Method

### Community 45 - "Community 45"
Cohesion: 0.29
Nodes (6): 1. Observation, 2. Logic Chain, 3. Caveats, 4. Conclusion, 5. Verification Method, Handoff Report — E2E Test Fixes

### Community 46 - "Community 46"
Cohesion: 0.29
Nodes (6): 1. Observation, 2. Logic Chain, 3. Caveats, 4. Conclusion, 5. Verification Method, Handoff Report — Frontend Responsive Enhancements and Layout Refactoring

### Community 47 - "Community 47"
Cohesion: 0.29
Nodes (6): 1. Observation, 2. Logic Chain, 3. Caveats, 4. Conclusion, 5. Verification Method, Handoff Report — Victory Audit

### Community 49 - "Community 49"
Cohesion: 0.33
Nodes (5): Milestones and Roles, Phase 1: Real-Browser Interactive Audit, Phase 2: Premium UI/UX Polish, Phase 3: Automated Test Verification, Project Plan - Browser-Based Audit and Premium UI/UX Polish

### Community 50 - "Community 50"
Cohesion: 0.40
Nodes (4): Meta Commands, RTK - Rust Token Killer (Google Antigravity), Rule, Why

### Community 51 - "Community 51"
Cohesion: 0.40
Nodes (3): consoleLogs, pageErrors, viewports

### Community 52 - "Community 52"
Cohesion: 0.40
Nodes (4): 2026-06-28T13:25:28Z, 2026-06-28T13:39:13Z, DIAGNOSTIC DETAILS & FIXES:, MANDATORY INTEGRITY WARNING:

### Community 53 - "Community 53"
Cohesion: 0.40
Nodes (4): 2026-06-28T13:57:33Z, CAUSE of TIMEOUT:, FIX STRATEGY:, MANDATORY INTEGRITY WARNING:

### Community 54 - "Community 54"
Cohesion: 0.40
Nodes (4): Coverage Summary, E2E Test Suite Ready, Feature Checklist, Test Runner

### Community 55 - "Community 55"
Cohesion: 0.50
Nodes (3): 1. Surfaces Sitemap (Offline Subdocs), 2. Smart Hybrid Retrieval: When to Fetch Live Docs, Google Antigravity (AGY) Guide & Sitemap

### Community 56 - "Community 56"
Cohesion: 0.50
Nodes (3): Current Status, Steps, Victory Auditor Progress Log

### Community 62 - "Community 62"
Cohesion: 0.67
Nodes (3): Linked List Visualizer Test Specs, Playback Controls Test Specs, Sorting Visualizer Test Specs

### Community 63 - "Community 63"
Cohesion: 0.67
Nodes (3): Blue-Purple Linear Gradient, Yellow-Orange Linear Gradient, Vite Logo

## Knowledge Gaps
- **453 isolated node(s):** `consoleErrors`, `pageErrors`, `name`, `private`, `version` (+448 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `usePlaybackKeyboard()` connect `Community 16` to `Community 1`, `Community 2`, `Community 36`, `Community 4`, `Community 15`, `Community 93`, `Community 31`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Why does `usePlayback()` connect `Community 16` to `Community 1`, `Community 2`, `Community 36`, `Community 4`, `Community 15`, `Community 31`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Why does `CodeViewer()` connect `Community 35` to `Community 1`, `Community 2`, `Community 36`, `Community 4`, `Community 15`, `Community 16`, `Community 31`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **What connects `consoleErrors`, `pageErrors`, `name` to the rest of the system?**
  _453 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05803921568627451 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.07013574660633484 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.10570824524312897 - nodes in this community are weakly interconnected._