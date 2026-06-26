import { Play, Pause, SkipForward, SkipBack, Info } from 'lucide-react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  speed: number | '';
  onSpeedChange: (speed: number | '') => void;
  stepIndex: number;
  totalSteps: number;
}

export function PlaybackControls({
  isPlaying,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  speed,
  onSpeedChange,
  stepIndex,
  totalSteps,
}: PlaybackControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-paper-light border border-charcoal/10 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center gap-2">
        {isPlaying ? (
          <button
            id="btn-pause"
            onClick={onPause}
            className="p-2.5 bg-charcoal text-paper hover:bg-coral hover:text-paper rounded-xl transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/50"
            aria-label="Pause"
          >
            <Pause className="w-4 h-4 fill-current" />
          </button>
        ) : (
          <button
            id="btn-play"
            onClick={onPlay}
            className="p-2.5 bg-coral text-paper hover:bg-coral-dark rounded-xl transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/50"
            aria-label="Play"
          >
            <Play className="w-4 h-4 fill-current" />
          </button>
        )}

        <button
          id="btn-step-backward"
          onClick={onStepBackward}
          className="p-2.5 border border-charcoal/20 bg-transparent hover:bg-charcoal/5 text-charcoal rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/50"
          aria-label="Step Backward"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          id="btn-step-forward"
          onClick={onStepForward}
          className="p-2.5 border border-charcoal/20 bg-transparent hover:bg-charcoal/5 text-charcoal rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/50"
          aria-label="Step Forward"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Speed and step info */}
      <div className="flex items-center gap-6 font-sans text-base font-semibold">
        <div className="flex items-center gap-2">
          <span className="text-charcoal uppercase tracking-wider text-base">Speed:</span>
          <input
            id="input-speed"
            type="number"
            min="0.1"
            max="10"
            step="0.1"
            value={speed}
            onChange={(e) => {
              let val = parseFloat(e.target.value);
              if (!isNaN(val)) {
                if (val > 10) val = 10;
                if (val < 0.1) val = 0.1;
                onSpeedChange(val);
              } else {
                onSpeedChange('');
              }
            }}
            onBlur={() => {
              if (speed === '' || isNaN(speed)) {
                onSpeedChange(1);
              }
            }}
            className="w-16 px-2.5 py-1.5 text-base font-mono border border-charcoal/20 bg-paper rounded-xl focus:outline-none focus:ring-1 focus:ring-coral text-charcoal"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-charcoal/5 px-3 py-1.5 rounded-xl border border-charcoal/10 font-mono text-base text-charcoal">
          <Info className="w-4 h-4 text-charcoal" />
          <span>Step:</span>
          <span id="playback-step-info" className="font-bold">{stepIndex}</span>
          <span>/</span>
          <span>{Math.max(0, totalSteps)}</span>
        </div>
      </div>
    </div>
  );
}
