import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Activity, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

interface PreloaderProps {
  onComplete?: () => void;
  durationMs?: number;
}

const bootLogs = [
  "Initializing EfficientNetB0 neural weights (16.2 MB)...",
  "Calibrating IBSI 16-level GLCM texture matrix kernel...",
  "Synthesizing Sobel margin gradients & Shannon entropy...",
  "Connecting to encrypted SQLite clinical telemetry...",
  "RadCortex AI Radiomics Decision Support Engine Ready.",
];

/**
 * Skiper9 - Full-screen Diagnostic Preloader
 * Features animated synaptic brain, live progress counter (0-100%),
 * clinical diagnostic boot messages, and smooth slide-up curtain exit.
 */
export const DiagnosticPreloader: React.FC<PreloaderProps> = ({
  onComplete,
  durationMs = 2200,
}) => {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsVisible(false);
        onComplete?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onComplete]);

  useEffect(() => {
    const startTime = performance.now();
    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(pct);

      const step = Math.min(
        bootLogs.length - 1,
        Math.floor((pct / 100) * bootLogs.length)
      );
      setLogIndex(step);

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsVisible(false);
          onComplete?.();
        }, 300);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [durationMs, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 0 }}
          exit={{
            y: "-100%",
            transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-slate-950 text-white px-6 py-10 select-none overflow-hidden"
        >
          {/* Subtle background radiomic grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

          {/* Top telemetry bar */}
          <div className="relative z-10 w-full max-w-5xl flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
              <span className="font-bold text-slate-200">RADCORTEX AI // BOOT_SEQUENCE</span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="hidden sm:inline">TENSORFLOW 2.x</span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline">IBSI RADIOMICS v2.4</span>
              <button
                type="button"
                onClick={() => {
                  setIsVisible(false);
                  onComplete?.();
                }}
                className="rounded-lg border border-slate-700 bg-slate-900/90 px-2.5 py-1 text-[11px] font-mono text-slate-300 hover:border-blue-400 hover:text-white transition"
              >
                Skip Boot [ESC] &rarr;
              </button>
            </div>
          </div>

          {/* Center Stage: Synaptic Pulse & Progress */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto">
            {/* Glowing synaptic icon with scanning ring */}
            <div className="relative flex items-center justify-center mb-8">
              <div className="absolute -inset-6 rounded-full bg-blue-500/15 blur-xl animate-pulse" />
              
              {/* Spinning outer calibration ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="absolute h-28 w-28 rounded-full border-2 border-dashed border-blue-500/30"
              />

              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-blue-500/40 bg-slate-900/90 shadow-2xl backdrop-blur-md">
                <Brain size={40} className="text-blue-400 animate-pulse" />
                <motion.div
                  className="absolute inset-0 rounded-2xl border border-blue-400"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.8, 0, 0.8] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                />
              </div>
            </div>

            {/* Huge numeric progress counter */}
            <div className="text-center font-mono">
              <div className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500">
                {String(progress).padStart(2, "0")}
                <span className="text-3xl md:text-4xl text-blue-500 ml-1">%</span>
              </div>
            </div>

            {/* Progress Track */}
            <div className="w-72 md:w-96 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-6 relative">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Dynamic log step */}
            <div className="h-6 mt-4 flex items-center justify-center">
              <p className="text-xs font-mono text-slate-400 text-center tracking-wide flex items-center gap-2">
                <Activity size={12} className="text-blue-400 animate-spin" />
                {bootLogs[logIndex]}
              </p>
            </div>
          </div>

          {/* Bottom compliance footer */}
          <div className="relative z-10 w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500 border-t border-slate-900 pt-4 gap-2">
            <div>
              <span>SECURE PROTOCOL · ENCRYPTED LOCAL WORKBENCH</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckCircle2 size={13} />
              <span>SYSTEM READY</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

