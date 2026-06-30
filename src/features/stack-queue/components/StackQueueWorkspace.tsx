import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StackQueueVisualizer } from "./StackQueueVisualizer";
import { CodeViewer } from "@/features/theory/components/CodeViewer";
import { PlaybackControls } from "@/shared/components/ui/PlaybackControls";
import { usePlayback } from "@/shared/hooks/usePlayback";
import { usePlaybackKeyboard } from "@/shared/hooks/usePlaybackKeyboard";
import {
  generateStackPushPopFrames,
  generateQueueFrames,
} from "../utils/generateFrames";
import { STACK_CODE, QUEUE_CODE } from "../utils/stackQueueCode";
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from "react-resizable-panels";
import { useMediaQuery } from "@mantine/hooks";

type Mode = "stack" | "queue";

export function StackQueueWorkspace() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [mode, setMode] = useState<Mode>("stack");
  const [speed, setSpeed] = useState<number | "">(1);

  // Collapsible code panel state
  const [isCodeCollapsed, setIsCodeCollapsed] = useState(false);

  const frames = useMemo(
    () =>
      mode === "stack" ? generateStackPushPopFrames() : generateQueueFrames(),
    [mode],
  );

  const playback = usePlayback({
    totalFrames: frames.length,
    speed,
    isActive: true,
  });

  usePlaybackKeyboard(playback, {
    totalFrames: frames.length,
    speed,
    setSpeed,
  });

  const handleModeChange = (newMode: Mode) => {
    playback.reset();
    setMode(newMode);
  };

  const currentFrame = frames[playback.stepIndex] || {
    elements: [],
    highlightedMarker: "@init",
    message: "",
  };

  const code = mode === "stack" ? STACK_CODE : QUEUE_CODE;

  // Calculate active line for HUD
  const activeLineIdx = useMemo(() => {
    if (!currentFrame.highlightedMarker) return -1;
    return code.findIndex((line) => line.includes(currentFrame.highlightedMarker));
  }, [currentFrame.highlightedMarker, code]);

  const activeLineNum = activeLineIdx !== -1 ? activeLineIdx + 1 : 0;
  const activeLineCode = useMemo(() => {
    if (activeLineIdx === -1) return '';
    return code[activeLineIdx].replace(/\s*\/\/\s*@[\w-]+/, '').trim();
  }, [activeLineIdx, code]);

  const leftColumnContent = (
    <div className="flex-1 w-full bg-gradient-to-br from-paper to-paper-light border border-charcoal/10 rounded-3xl p-5 sm:p-6 md:p-8 shadow-premium flex flex-col justify-between h-full overflow-y-auto">
      <div>
        <h3 className="font-editorial text-xl sm:text-2xl font-bold text-charcoal mb-4">
          Visual Sandbox
        </h3>
        <StackQueueVisualizer
          mode={mode}
          onModeChange={handleModeChange}
          frame={currentFrame}
        />
      </div>
      {isCodeCollapsed && activeLineCode && (
        <div className="mt-6 bg-paper-dark/65 border border-coral/20 rounded-2xl px-5 py-3 shadow-inner flex items-center gap-3">
          <span className="text-[10px] font-sans font-bold uppercase tracking-widest bg-coral/10 text-coral px-2.5 py-1 rounded-lg">
            Line {activeLineNum}
          </span>
          <span className="font-mono text-sm text-charcoal truncate flex-1 font-semibold">
            {activeLineCode}
          </span>
        </div>
      )}
    </div>
  );

  const rightColumnContent = !isCodeCollapsed ? (
    <div className="w-full h-full bg-gradient-to-br from-paper to-paper-light border border-charcoal/10 rounded-3xl p-5 sm:p-6 md:p-8 shadow-premium flex flex-col transition-all duration-300 min-w-0 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-editorial text-xl sm:text-2xl font-bold text-charcoal">
          Implementation
        </h3>
        <button
          onClick={() => setIsCodeCollapsed(true)}
          title="Collapse Code Panel"
          className="p-1.5 rounded-lg border border-charcoal/15 bg-paper hover:bg-charcoal/5 text-charcoal transition-spring hover-spring active-spring"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <CodeViewer
        codeLines={code}
        fileName={mode === "stack" ? "Stack.js" : "Queue.js"}
        highlightedMarker={currentFrame.highlightedMarker}
      />
    </div>
  ) : (
    <div
      onClick={() => setIsCodeCollapsed(false)}
      title="Expand Code Panel"
      className="w-[48px] h-full bg-paper border border-charcoal/10 rounded-3xl p-3 shadow-sm flex flex-col items-center justify-start cursor-pointer hover:bg-charcoal/5 group transition-all duration-300"
    >
      <button className="p-1 rounded-lg border border-charcoal/15 bg-paper group-hover:bg-charcoal/10 text-charcoal mb-8">
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>
      <div className="text-[10px] font-sans font-extrabold uppercase tracking-widest text-charcoal/30 select-none whitespace-nowrap rotate-90 mt-16 origin-center">
        Code Viewer
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      <PlaybackControls
        isPlaying={playback.isPlaying}
        onPlay={playback.handlePlay}
        onPause={playback.handlePause}
        onStepForward={playback.handleStepForward}
        onStepBackward={playback.handleStepBackward}
        onReset={playback.reset}
        onScrub={playback.scrubTo}
        speed={speed}
        onSpeedChange={setSpeed}
        stepIndex={playback.stepIndex}
        totalSteps={Math.max(0, frames.length - 1)}
      />

      {isDesktop ? (
        <div className="h-[740px] w-full flex relative">
          <PanelGroup direction="horizontal" className="w-full gap-0 h-full items-stretch">
            <Panel defaultSize={60} minSize={35} className="flex flex-col min-w-0 pr-1 h-full">
              {leftColumnContent}
            </Panel>
            <PanelResizeHandle className="w-5 flex items-center justify-center cursor-col-resize group transition-all duration-200 self-stretch select-none mx-1.5 rounded-full">
              <div className="w-1 h-16 rounded-full bg-charcoal/10 group-hover:bg-coral group-active:bg-coral-dark transition-colors duration-200" />
            </PanelResizeHandle>
            <Panel defaultSize={40} minSize={25} className="flex flex-col min-w-0 pl-1 h-full">
              {rightColumnContent}
            </Panel>
          </PanelGroup>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="h-[640px]">{leftColumnContent}</div>
          <div>{rightColumnContent}</div>
        </div>
      )}
    </div>
  );
}
