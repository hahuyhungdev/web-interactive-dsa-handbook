import { useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";

interface PlaybackHandle {
  isPlaying: boolean;
  stepIndex: number;
  setStepIndex: React.Dispatch<React.SetStateAction<number>>;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  handlePlay: () => void;
  handlePause: () => void;
  reset: () => void;
}

interface Options {
  totalFrames: number;
  speed: number | "";
  setSpeed: (n: number | "") => void;
  enabled?: boolean;
}

const clamp = (n: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, n));

export function usePlaybackKeyboard(
  pb: PlaybackHandle,
  { totalFrames, speed, setSpeed, enabled = true }: Options,
) {
  const lastIndex = Math.max(0, totalFrames - 1);

  const togglePlay = useCallback(() => {
    if (pb.isPlaying) {
      pb.handlePause();
    } else {
      pb.handlePlay();
    }
  }, [pb]);

  const skip = useCallback(
    (delta: number) => {
      pb.setIsPlaying(false);
      pb.setStepIndex((prev) => clamp(prev + delta, 0, lastIndex));
    },
    [pb, lastIndex],
  );

  const jumpStart = useCallback(() => {
    pb.setIsPlaying(false);
    pb.setStepIndex(0);
  }, [pb]);

  const jumpEnd = useCallback(() => {
    pb.setIsPlaying(false);
    pb.setStepIndex(lastIndex);
  }, [pb, lastIndex]);

  const adjustSpeed = useCallback(
    (mul: number) => {
      const current = typeof speed === "number" && speed > 0 ? speed : 1;
      setSpeed(Number(clamp(current * mul, 0.1, 10).toFixed(2)));
    },
    [speed, setSpeed],
  );

  const opts = { enabled, preventDefault: true };

  // The Radix scrubber thumb already moves by ±1 on arrow keys when focused;
  // suppress our global arrow hotkeys in that case so the user doesn't get a
  // double step.
  const arrowOpts = {
    ...opts,
    ignoreEventWhen: (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      return !!target?.closest('[role="slider"], input[type="range"]');
    },
  };

  useHotkeys("space", togglePlay, opts, [togglePlay]);
  useHotkeys("arrowleft", () => skip(-1), arrowOpts, [skip]);
  useHotkeys("arrowright", () => skip(1), arrowOpts, [skip]);
  useHotkeys("shift+arrowleft", () => skip(-10), arrowOpts, [skip]);
  useHotkeys("shift+arrowright", () => skip(10), arrowOpts, [skip]);
  useHotkeys("home", jumpStart, opts, [jumpStart]);
  useHotkeys("end", jumpEnd, opts, [jumpEnd]);
  useHotkeys("r", pb.reset, opts, [pb.reset]);
  useHotkeys(["=", "+"], () => adjustSpeed(1.25), opts, [adjustSpeed]);
  useHotkeys("-", () => adjustSpeed(1 / 1.25), opts, [adjustSpeed]);
  useHotkeys(
    ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    (_, handler) => {
      const pressed = handler.keys?.[0];
      const n = Number(pressed);
      if (Number.isFinite(n) && n >= 1 && n <= 9) {
        setSpeed(n);
      }
    },
    opts,
    [setSpeed],
  );
}
