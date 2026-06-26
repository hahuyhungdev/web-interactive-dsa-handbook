import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Info,
  Keyboard,
} from "lucide-react";
import * as Slider from "@radix-ui/react-slider";

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onScrub: (value: number) => void;
  speed: number | "";
  onSpeedChange: (speed: number | "") => void;
  stepIndex: number;
  totalSteps: number;
}

const SHORTCUTS: Array<{ keys: string; label: string }> = [
  { keys: "Space", label: "Play / Pause" },
  { keys: "← / →", label: "Step" },
  { keys: "Shift+← / →", label: "Skip 10" },
  { keys: "Home / End", label: "Jump" },
  { keys: "R", label: "Reset" },
  { keys: "+ / -", label: "Speed ±" },
  { keys: "1 – 9", label: "Speed = n" },
];

export function PlaybackControls({
  isPlaying,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onReset,
  onScrub,
  speed,
  onSpeedChange,
  stepIndex,
  totalSteps,
}: PlaybackControlsProps) {
  const safeMax = Math.max(0, totalSteps);
  const sliderDisabled = safeMax === 0;
  const progressPct = sliderDisabled ? 0 : (stepIndex / safeMax) * 100;

  return (
    <div className="flex flex-col gap-3 bg-paper-light border border-charcoal/10 rounded-2xl p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <button
              id="btn-pause"
              onClick={onPause}
              title="Pause (Space)"
              className="p-2.5 bg-charcoal text-paper hover:bg-coral hover:text-paper rounded-xl transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/50"
              aria-label="Pause"
              aria-keyshortcuts="Space"
            >
              <Pause className="w-4 h-4 fill-current" />
            </button>
          ) : (
            <button
              id="btn-play"
              onClick={onPlay}
              title="Play (Space)"
              className="p-2.5 bg-coral text-paper hover:bg-coral-dark rounded-xl transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/50"
              aria-label="Play"
              aria-keyshortcuts="Space"
            >
              <Play className="w-4 h-4 fill-current" />
            </button>
          )}

          <button
            id="btn-step-backward"
            onClick={onStepBackward}
            title="Step backward (←)"
            className="p-2.5 border border-charcoal/20 bg-transparent hover:bg-charcoal/5 text-charcoal rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/50"
            aria-label="Step Backward"
            aria-keyshortcuts="ArrowLeft"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            id="btn-step-forward"
            onClick={onStepForward}
            title="Step forward (→)"
            className="p-2.5 border border-charcoal/20 bg-transparent hover:bg-charcoal/5 text-charcoal rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/50"
            aria-label="Step Forward"
            aria-keyshortcuts="ArrowRight"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            id="btn-reset"
            onClick={onReset}
            title="Reset (R)"
            className="p-2.5 border border-charcoal/20 bg-transparent hover:bg-charcoal/5 text-charcoal rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/50"
            aria-label="Reset"
            aria-keyshortcuts="R"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Speed and step info */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-6 font-sans text-base font-semibold">
          <div className="flex items-center gap-2">
            <span className="text-charcoal uppercase tracking-wider text-base">
              Speed:
            </span>
            <input
              id="input-speed"
              type="number"
              min="0.1"
              max="10"
              step="0.1"
              value={speed}
              title="Speed (use + / - or 1–9)"
              onChange={(e) => {
                const raw = parseFloat(e.target.value);
                if (!isNaN(raw)) {
                  const clamped = Math.min(10, Math.max(0.1, raw));
                  onSpeedChange(clamped);
                } else {
                  onSpeedChange("");
                }
              }}
              onBlur={() => {
                if (
                  speed === "" ||
                  (typeof speed === "number" && isNaN(speed))
                ) {
                  onSpeedChange(1);
                }
              }}
              className="w-16 px-2.5 py-1.5 text-base font-mono border border-charcoal/20 bg-paper rounded-xl focus:outline-none focus:ring-1 focus:ring-coral text-charcoal"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-charcoal/5 px-3 py-1.5 rounded-xl border border-charcoal/10 font-mono text-base text-charcoal">
            <Info className="w-4 h-4 text-charcoal" />
            <span>Step:</span>
            <span id="playback-step-info" className="font-bold">
              {stepIndex}
            </span>
            <span>/</span>
            <span>{Math.max(0, totalSteps)}</span>
          </div>

          <div className="relative group hidden sm:flex">
            <button
              type="button"
              aria-label="Keyboard shortcuts"
              className="p-2 border border-charcoal/20 bg-transparent hover:bg-charcoal/5 text-charcoal rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/50"
            >
              <Keyboard className="w-4 h-4" />
            </button>
            <div
              role="tooltip"
              className="pointer-events-none absolute right-0 top-[calc(100%+8px)] z-20 w-64 origin-top-right opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:scale-100 transition-all duration-150 bg-paper border border-charcoal/10 rounded-2xl shadow-premium-hover p-4"
            >
              <p className="font-sans text-base font-bold uppercase tracking-wider text-charcoal mb-2">
                Keyboard
              </p>
              <ul className="flex flex-col gap-1.5 font-mono text-sm text-charcoal">
                {SHORTCUTS.map((s) => (
                  <li
                    key={s.keys}
                    className="flex items-center justify-between gap-3"
                  >
                    <kbd className="px-1.5 py-0.5 bg-paper-dark border border-charcoal/15 rounded text-xs">
                      {s.keys}
                    </kbd>
                    <span className="text-charcoal/70 text-xs">{s.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline scrubber */}
      <div className="flex items-center gap-3 px-1">
        <span className="font-mono text-xs text-charcoal/60 tabular-nums w-8 text-right">
          {stepIndex}
        </span>
        <Slider.Root
          id="playback-scrubber"
          className="relative flex items-center select-none touch-none w-full h-5 group"
          min={0}
          max={safeMax}
          step={1}
          value={[Math.min(stepIndex, safeMax)]}
          disabled={sliderDisabled}
          onValueChange={(values) => {
            if (typeof values[0] === "number") onScrub(values[0]);
          }}
          aria-label="Playback timeline"
          data-progress={progressPct.toFixed(2)}
        >
          <Slider.Track className="bg-charcoal/10 relative grow rounded-full h-1.5">
            <Slider.Range className="absolute bg-coral rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb
            className="block w-4 h-4 bg-paper border-2 border-coral rounded-full shadow-sm transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper-light disabled:opacity-40"
            data-element-type="scrubber-thumb"
          />
        </Slider.Root>
        <span className="font-mono text-xs text-charcoal/60 tabular-nums w-8">
          {safeMax}
        </span>
      </div>
    </div>
  );
}
