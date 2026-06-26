import { useState, useEffect, useCallback } from "react";

interface UsePlaybackOptions {
  totalFrames: number;
  speed: number | "";
  isActive: boolean;
}

export function usePlayback({
  totalFrames,
  speed,
  isActive,
}: UsePlaybackOptions) {
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Pause when not active
  useEffect(() => {
    if (!isActive) {
      setIsPlaying(false);
    }
  }, [isActive]);

  // Playback loop
  useEffect(() => {
    if (!isPlaying) return;

    const intervalId = setInterval(
      () => {
        setStepIndex((prev) => {
          if (prev >= totalFrames - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      },
      100 / (typeof speed === "number" ? speed : 1),
    );

    return () => clearInterval(intervalId);
  }, [isPlaying, speed, totalFrames]);

  const handlePlay = useCallback(() => {
    if (stepIndex >= totalFrames - 1) {
      setStepIndex(0);
    }
    setIsPlaying(true);
  }, [stepIndex, totalFrames]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleStepForward = useCallback(() => {
    setIsPlaying(false);
    setStepIndex((prev) => Math.min(totalFrames - 1, prev + 1));
  }, [totalFrames]);

  const handleStepBackward = useCallback(() => {
    setIsPlaying(false);
    setStepIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setStepIndex(0);
  }, []);

  const scrubTo = useCallback(
    (index: number) => {
      setIsPlaying(false);
      setStepIndex(Math.min(Math.max(0, index), Math.max(0, totalFrames - 1)));
    },
    [totalFrames],
  );

  return {
    stepIndex,
    setStepIndex,
    isPlaying,
    setIsPlaying,
    handlePlay,
    handlePause,
    handleStepForward,
    handleStepBackward,
    reset,
    scrubTo,
  };
}
