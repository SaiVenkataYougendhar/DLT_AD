import React, { useEffect, useState } from "react";
import { Sparkles, Brain, CheckCircle2, Shield } from "lucide-react";

export type PreloaderVariant = "quick" | "spasoje" | "double-steps" | "steps";

export interface PreloaderProps {
  onComplete?: () => void;
  durationMs?: number;
  initialVariant?: PreloaderVariant;
}

/**
 * Savile Velocity Diagnostic Preloader
 * Lightning-fast, ultra-efficient (450ms default), elegant Westminster Gold & Oxford Navy scanline.
 */
export const DiagnosticPreloader: React.FC<PreloaderProps> = ({
  onComplete,
  durationMs = 450,
}) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  // Instant skip on Escape or click
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") triggerExit();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const triggerExit = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 200);
  };

  useEffect(() => {
    const startTime = performance.now();
    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        triggerExit();
      }
    }, 16);

    return () => clearInterval(interval);
  }, [durationMs]);

  if (!isVisible) return null;

  return (
    <div
      onClick={triggerExit}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-md transition-opacity duration-200 select-none cursor-pointer ${
        isExiting ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Top Precision Scan Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary via-accent to-secondary transition-all duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="relative flex flex-col items-center gap-4 text-center px-6 max-w-sm">
        {/* Pulsing Crest Icon */}
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary shadow-xl pulse-gold">
          <Brain size={28} className="animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-accent" />
          </span>
        </div>

        {/* Title & Micro Metadata */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-accent">
            <Sparkles size={11} />
            <span>Savile Clinical Velocity</span>
          </div>
          <h2 className="text-lg font-black tracking-tight text-foreground">
            RadCortex AI Engine
          </h2>
        </div>

        {/* Kinetic Percentage Counter */}
        <div className="flex items-baseline gap-1 font-mono">
          <span className="text-3xl font-black text-primary">{progress}</span>
          <span className="text-sm font-bold text-muted-foreground">%</span>
        </div>

        {/* Quick status line */}
        <span className="text-[11px] text-muted-foreground font-mono">
          {progress < 40 && "Initializing neural tensors..."}
          {progress >= 40 && progress < 80 && "Calibrating IBSI radiomics..."}
          {progress >= 80 && "Connecting 5 frontier engines..."}
        </span>
      </div>
    </div>
  );
};
