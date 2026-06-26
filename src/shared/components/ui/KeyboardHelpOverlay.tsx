import { useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { AnimatePresence, motion } from "motion/react";
import { X, Keyboard } from "lucide-react";

interface ShortcutRow {
  keys: string[];
  description: string;
}

interface ShortcutGroup {
  title: string;
  rows: ShortcutRow[];
}

const GROUPS: ShortcutGroup[] = [
  {
    title: "Playback",
    rows: [
      { keys: ["Space"], description: "Play / Pause" },
      { keys: ["←", "→"], description: "Step backward / forward" },
      { keys: ["Shift", "+", "←/→"], description: "Skip 10 steps" },
      { keys: ["Home", "End"], description: "Jump to first / last frame" },
      { keys: ["R"], description: "Reset to first frame" },
      { keys: ["+", "="], description: "Speed up ×1.25" },
      { keys: ["−"], description: "Slow down ×0.8" },
      { keys: ["1"], description: "Speed presets (1=1×, 2=2×, …, 9=9×)" },
    ],
  },
  {
    title: "Code editor",
    rows: [
      {
        keys: ["⌘", "↵"],
        description: "Run code (Ctrl + Enter on Windows / Linux)",
      },
    ],
  },
  {
    title: "Global",
    rows: [
      { keys: ["?"], description: "Open / close this help" },
      { keys: ["Esc"], description: "Close this help" },
    ],
  },
];

interface KeyboardHelpOverlayProps {
  open: boolean;
  onClose: () => void;
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[1.75rem] px-2 py-0.5 rounded-md border border-charcoal/15 bg-paper-light text-charcoal text-xs font-mono shadow-[0_1px_0_rgba(0,0,0,0.06)]">
      {children}
    </kbd>
  );
}

export function KeyboardHelpOverlay({
  open,
  onClose,
}: KeyboardHelpOverlayProps) {
  useHotkeys(
    "escape",
    () => open && onClose(),
    { enableOnFormTags: true, enableOnContentEditable: true },
    [open, onClose],
  );

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="kbd-overlay"
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="keyboard-help-title"
        >
          <div
            className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            id="keyboard-help-panel"
            className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-paper border border-charcoal/15 rounded-2xl shadow-2xl"
            initial={{ y: 16, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 8, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal/10">
              <div className="flex items-center gap-3">
                <Keyboard className="w-5 h-5 text-coral" />
                <h2
                  id="keyboard-help-title"
                  className="font-sans font-bold uppercase tracking-wider text-charcoal text-base"
                >
                  Keyboard shortcuts
                </h2>
              </div>
              <button
                id="btn-close-keyboard-help"
                type="button"
                onClick={onClose}
                aria-label="Close keyboard help"
                className="p-1.5 rounded-md text-charcoal hover:bg-charcoal/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-6">
              {GROUPS.map((group) => (
                <section key={group.title}>
                  <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-charcoal/60 mb-3">
                    {group.title}
                  </h3>
                  <ul className="space-y-2">
                    {group.rows.map((row) => (
                      <li
                        key={row.description}
                        className="flex items-start justify-between gap-4 text-sm text-charcoal"
                      >
                        <span className="flex-1">{row.description}</span>
                        <span className="flex items-center gap-1 shrink-0">
                          {row.keys.map((k, i) => (
                            <Kbd key={`${row.description}-${i}`}>{k}</Kbd>
                          ))}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
              <p className="text-xs text-charcoal/50 font-sans">
                Tip: most playback shortcuts work whenever the visualizer is on
                screen — you don't need to focus the controls first.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
