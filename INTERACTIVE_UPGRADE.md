# Interactive Feature Upgrade — Progress Tracker

Goal: make every visualizer feel **real, easy, keyboard-controllable**.

Status: **all 12 steps complete · production build green · smoke-tested in headless Chromium**.

## Plan & Status

| #   | Task                                                                   | Status  |
| --- | ---------------------------------------------------------------------- | ------- |
| 1   | Progress tracker + memory                                              | ✅ done |
| 2   | Fix dead speed control (sorting + linked-list)                         | ✅ done |
| 3   | Install `react-hotkeys-hook` + global playback keyboard layer          | ✅ done |
| 4   | Home/End scrub handlers + visible shortcut hints in `PlaybackControls` | ✅ done |
| 5   | Replace step counter with Radix slider scrubber (mouse + keyboard)     | ✅ done |
| 6   | Framer Motion `layout` animation on sorting bars + linked-list nodes   | ✅ done |
| 7   | Sorting array controls: shuffle / size / presets / custom input        | ✅ done |
| 8   | Search target: free integer input (replace `<select>`)                 | ✅ done |
| 9   | Linked-list: insert-at-index + find-with-traverse animation            | ✅ done |
| 10  | CodeMirror editor for `/practice/*` + Cmd/Ctrl+Enter to run            | ✅ done |
| 11  | Help overlay triggered by `?` listing every shortcut                   | ✅ done |
| 12  | `npm run build` smoke verification + headless route check              | ✅ done |

## Libraries Adopted

| Lib                                                                                                | Purpose                                  | Bundle (gz, approx)                                      |
| -------------------------------------------------------------------------------------------------- | ---------------------------------------- | -------------------------------------------------------- |
| `react-hotkeys-hook`                                                                               | declarative shortcuts                    | ~2 KB                                                    |
| `motion` (Framer Motion v11)                                                                       | `<motion.div layout>` swap/insert/delete | ~30 KB                                                   |
| `@radix-ui/react-slider`                                                                           | accessible scrubber                      | ~6 KB                                                    |
| `@uiw/react-codemirror` + `@codemirror/lang-javascript` + `@codemirror/view` + `@codemirror/state` | practice editor                          | ~140 KB (lazy-loaded with the `/practice/*` route chunk) |

## Keyboard Spec (final)

| Key                | Action                        |
| ------------------ | ----------------------------- |
| Space              | Play / Pause                  |
| ← / →              | Step backward / forward       |
| Shift+← / Shift+→  | Skip 10 steps                 |
| Home / End         | Jump to first / last frame    |
| R                  | Reset to frame 0              |
| + / =              | Speed up ×1.25                |
| −                  | Slow down ×0.8                |
| 1 … 9              | Set speed to that integer     |
| ?                  | Toggle help overlay           |
| Esc                | Close help overlay            |
| Cmd / Ctrl + Enter | (practice page only) Run code |

Form fields, the CodeMirror editor, and Radix slider thumbs are excluded from the global playback shortcuts so they never hijack input.

## Verification

- `npx tsc --noEmit` → clean (only the pre-existing `tsconfig.json` `baseUrl` deprecation warning).
- `npm run build` → succeeds in ~2.7s. The practice route chunks the heavy CodeMirror bundle (`index-*.js`, 521 KB raw / 175 KB gz) which loads only on `/practice/*`.
- Headless Chromium smoke:
  - `/sorting` renders array editor, scrubber, reset button, shortcuts FAB; no console errors.
  - `/linked-list` find input drives an animated traversal that advances the playback automatically.
  - `/practice/two-sum` CodeMirror mounts; `Ctrl+Enter` triggers the run pipeline (`Not Evaluated` → `Tests Failed` on boilerplate, as expected).
  - `?` opens the keyboard help overlay; `Esc` closes it.

## Notes for Future Work

- The CodeMirror editor wrapper keeps `id="code-editor"` on a `<div>` so existing Playwright selectors targeting `#code-editor` still match the container. Tests that need to type into the editor must target `#code-editor .cm-content` instead of the old `<textarea>`.
- The `r` reset hotkey is in the global playback layer; if a future page adds a single-letter input outside an `<input>`/`<textarea>`/CodeMirror, scope it via the `enableOnFormTags` option already configured in `usePlaybackKeyboard`.

---

# Sorting Visualizer — Architecture & Interaction Techniques

How the sort topic was made interactive, and the reasoning behind each decision. This is the reference for extending it (new algorithms) or applying the same pattern to other topics.

## 1. Record-then-replay (the core mental model)

The algorithm never runs "live" against the UI. Instead each algorithm runs **once, ahead of time**, and emits an array of immutable snapshots:

```ts
type VisualizerFrame = {
  array?: ArrayItem[];        // full state of every bar at this step
  highlightedMarker?: string; // which source line is "active"
};
```

The UI is then just a **video player** over `frames[stepIndex]`. Playback (play/pause/step/scrub/speed/keyboard) only ever moves an integer cursor — it knows nothing about sorting.

**Why this matters:**

- The algorithm's internals can change freely (fix a bug, swap Lomuto for Hoare) and the UI never changes, as long as `generate()` keeps returning `VisualizerFrame[]`.
- Stepping backward is free (just `stepIndex--`) — no need to "un-run" an algorithm.
- Deterministic and trivially testable: assert on the frames array, no timing/flake.

Generators live in `src/features/sorting/utils/generateFrames.ts`, one pure function per algorithm: `(arr: number[]) => VisualizerFrame[]`.

## 2. Registry pattern (data-driven, single source of truth)

`src/features/sorting/sortRegistry.ts` holds one array, `SORT_ALGOS`, where each entry fully describes an algorithm as data:

```ts
{ id, label, fileName, complexity, generate, code }
```

The literal id union is derived from the data itself:

```ts
export const SORT_ALGOS = [...] as const satisfies readonly SortAlgo[];
export type SortAlgoId = (typeof SORT_ALGOS)[number]['id']; // 'bubble' | 'selection' | ...
```

Everything downstream is generated from this list: the tabs, the active title, the code panel, the URL deep-link guard. **Adding an algorithm = appending one entry** — no UI edits, no switch statements. This is the "isolate change behind a contract" principle: the registry is the seam.

## 3. Code ↔ frame sync via markers

Source snippets live in `utils/sortCode.ts` as string arrays with `// @marker` comments. Each generator tags its frames with a `highlightedMarker` (e.g. `@compare`, `@swap`, `@pivot`). `CodeViewer` strips the marker comment for display but uses it to glow the matching line in lockstep with the animation. Rule: **every marker a generator emits must appear on exactly one snippet line.**

## 4. The animation technique (and the flicker fix)

Bars are `motion.div` elements animated with Framer Motion. Two non-obvious decisions make it smooth:

### a. Stable identity, not position

Each bar is keyed by a permanent per-element id (`item.index`, assigned once at array creation and carried with the object as it moves). React/Framer then treat a swap as "the same element moved", not "two elements replaced" — enabling a real FLIP slide instead of a flicker-remount.

### b. `layout="position"` — slide, never scale

`layout` (full) animates **size** changes by applying a `scaleY` transform, which visually squashes/stretches the bar **and its number label** → that was the flicker. Switching to `layout="position"` animates **only translation**: bars slide horizontally, sizes update instantly without distortion.

### c. Constant heights per identity

For this to be fully flicker-free, an element's height must never change once created. Bubble/Selection/Insertion/Quick already move element *objects*, so heights are constant. **Merge sort was rewritten** from the naive "overwrite values in place" model to **moving the element objects** into their merged order (atomic reposition per merge window). Now every algorithm is pure repositioning → zero `scaleY`, verified at 1.0 throughout live autoplay.

> Pitfall avoided: writing merged objects back one-at-a-time creates a moment where the same object id exists at two indices → duplicate React keys → flicker/warning. The reposition is therefore committed as a single atomic frame.

Status colors are a flat `STATUS_STYLE` lookup (`default / comparing / swapping / pivot / sorted`) with a short CSS `transition` on color only — cheap and compositor-friendly. `pivot` (violet) was added to `ArrayItem.status` specifically for Quick Sort.

## 5. URL as state (deep-linkable tabs)

Each algorithm is also a handbook lesson. The sidebar entries map to `/sorting?algo=<id>` (`ROUTES.SORTING_ALGO`). `SortingSection` reads `?algo=` via `useSearchParams` + an `isSortAlgoId` type guard to pick the initial/active tab, and `lesson-sync` matches `pathname + search` so the correct lesson highlights on refresh. The tab selection is shareable and bookmarkable.

## 6. Component seam (state vs. render)

`SortingWorkspace` owns playback + array state and computes `frames = useMemo(() => algo.generate(array), [algo, array])`. `SortingVisualizer` is a pure render of `currentFrame.array`. This container/presentational split keeps the algorithm, the playback engine, and the pixels independently changeable.

## Extending: add a new sort algorithm

1. Write `generateXxxSortFrames(arr)` in `generateFrames.ts` (move element objects; keep heights constant).
2. Add `XXX_SORT_CODE` (with `// @marker` comments matching the frames) in `sortCode.ts`.
3. Append one entry to `SORT_ALGOS` in `sortRegistry.ts`.
4. Add the lesson to `chapters.ts` and the `/sorting?algo=<id>` route to `LESSON_ROUTE_MAP`.

Tabs, type union, code panel, keyboard, and deep-linking all update automatically.
