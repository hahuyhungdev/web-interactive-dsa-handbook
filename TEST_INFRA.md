# E2E Test Infra: Web-Based Interactive DSA Handbook

## Test Philosophy
- Opaque-box, requirement-driven. No dependency on implementation design.
- Methodology: Category-Partition + BVA + Pairwise + Workload Testing.

## Feature Inventory
| # | Feature | Source (requirement) | Tier 1 | Tier 2 | Tier 3 |
|---|---------|---------------------|:------:|:------:|:------:|
| 1 | Premium UI, Navigation, & Theme | R1, Acceptance Criteria | 5 | 5 | ✓ |
| 2 | Playback Controls | R2, Acceptance Criteria | 5 | 5 | ✓ |
| 3 | Sorting Visualizers | R2 (X1), Acceptance Criteria | 5 | 5 | ✓ |
| 4 | Linked List Visualizer | R2 (X2), Acceptance Criteria | 5 | 5 | ✓ |
| 5 | Practice Challenges & Sandbox | R3, Acceptance Criteria | 5 | 5 | ✓ |

## Test Architecture
- **Test Runner**: Playwright (`@playwright/test`)
- **Invocation**: `npx playwright test`
- **Directory Layout**:
  - Tests reside in `./web-interactive-dsa-handbook/e2e/`
  - Playwright configuration in `./web-interactive-dsa-handbook/playwright.config.ts`

## Selectors & Interface Contracts
To maintain strict opaque-box testing while ensuring the test suite is robust, the implementation must expose the following DOM element attributes/IDs:

### 1. Premium UI & Table of Contents
- Chapter accordion buttons: `#chapter-btn-arrays`, `#chapter-btn-sorting`, `#chapter-btn-linked-lists`
- Chapter panel containers: `#chapter-panel-arrays`, `#chapter-panel-sorting`, `#chapter-panel-linked-lists`
- Lesson item buttons: Inside the panels, having `role="button"` and `tabindex="0"`
- Active visualizer/practice screen containers:
  - Sorting Visualizer: `#sorting-visualizer-section`
  - Linked List Visualizer: `#linked-list-visualizer-section`
  - Practice Section: `#practice-challenge-section`

### 2. Playback Controls
- Play button: `#btn-play`
- Pause button: `#btn-pause`
- Step Forward button: `#btn-step-forward`
- Step Backward button: `#btn-step-backward`
- Speed slider/input: `#input-speed` (min/max range matching speed adjustments)
- Current playback frame step index: `#playback-step-info`
- Code Viewer container: `#code-viewer`
- Active highlighted code line: `[data-line-active="true"]` or class `.code-line-active`

### 3. Sorting Visualizer
- Array visualizer container: `#sorting-visualizer-container`
- Sorting choice tab/buttons: `#btn-select-bubble-sort`, `#btn-select-selection-sort`
- Individual array element bars: `[data-element-type="array-item"]` or `.array-bar` with:
  - `data-value`: Numeric value of the element
  - `data-index`: 0-indexed position in the array
  - `data-status`: "default" | "comparing" | "swapping" | "sorted"

### 4. Linked List Visualizer
- Linked list visualizer container: `#linked-list-visualizer-container`
- Dynamic node elements: `[data-element-type="linked-list-node"]` or `.list-node` with:
  - `data-value`: Numeric/string value of the node
  - `data-status`: "default" | "active" | "traversing" | "inserted" | "deleted"
- Pointer connector lines/arrows: `[data-element-type="linked-list-pointer"]` or `.list-pointer`
- Interaction control buttons (e.g. for inserts/deletes):
  - Insert Node button: `#btn-list-insert`
  - Insert input value: `#input-list-val`
  - Delete Node button: `#btn-list-delete`
  - Delete input value: `#input-list-delete-val`

### 5. Practice Challenges & Sandbox
- Challenge selector/tabs: `#challenge-tab-two-sum`, `#challenge-tab-reverse-list`, `#challenge-tab-find-max`
- Code editor textarea: `#code-editor`
- Run/Evaluate button: `#btn-run-code`
- Test result drawer/container: `#test-results-drawer`
- Individual test case items: `[data-test-status]` (values: "passed", "failed")
- Overall submission summary: `#test-summary`

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | Complete Sorting Workflow | TOC, Sorting Tab, Playback Play/Pause, Step, Speed, Array elements update | High |
| 2 | Complete Linked List Operations | TOC, LL Visualizer, Insert, Playback Steps, Delete, Node visual updates | High |
| 3 | Solving Two Sum Challenge | TOC, Challenge Tab, Editor typing, Run code, Pass verification | High |
| 4 | Solving Reverse Linked List Challenge | TOC, Challenge Tab, Editor typing, Run code, Pass verification | High |
| 5 | Keyboard Nav & UI Theme Checks | Navbar scroll transition, TOC accordion expand/collapse, visual theme verification | Medium |

## Coverage Thresholds
- Tier 1: Feature Coverage (≥5 per feature, 25 total)
- Tier 2: Boundary & Corner Cases (≥5 per feature, 25 total)
- Tier 3: Cross-Feature Combinations (pairwise, 5 total)
- Tier 4: Real-World Application Scenarios (5 total)
