import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Activity,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Cpu,
  Layers,
  Sliders,
  ChevronRight,
  Terminal,
} from "lucide-react";

export type PreloaderVariant = "spasoje" | "double-steps" | "steps";

interface PreloaderProps {
  onComplete?: () => void;
  durationMs?: number;
  initialVariant?: PreloaderVariant;
}

const milestoneSteps = [
  {
    step: "01",
    label: "Neural Architecture",
    detail: "EfficientNetB0 weights (16.2 MB) & feature extractor",
    metric: "4.8M Tensors",
  },
  {
    step: "02",
    label: "GLCM Radiomics Kernel",
    detail: "16-level spatial texture matrix & Sobel gradients",
    metric: "16x16 Co-occurrence",
  },
  {
    step: "03",
    label: "Prognostic Resectability",
    detail: "Surrogate response modeling & margin invasiveness",
    metric: "Dynamic Score",
  },
  {
    step: "04",
    label: "Clinical Vault Sync",
    detail: "Encrypted SQLite persistence & PACS DICOMweb",
    metric: "Encrypted DB",
  },
];

const tickerLogs = [
  "Mounting convolutional kernels & synaptic weights...",
  "Synthesizing gray-level spatial co-occurrence tensors...",
  "Calibrating optical reticle coordinate tracking HUD...",
  "Evaluating surrogate resectability & radiation response...",
  "RadCortex AI Radiomics Platform initialized.",
];

const PreloaderModeSwitcher: React.FC<{
  current: PreloaderVariant;
  onSelect: (v: PreloaderVariant) => void;
}> = ({ current, onSelect }) => (
  <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10 text-[11px]">
    <button
      type="button"
      onClick={() => onSelect("spasoje")}
      className={`px-2.5 py-1 rounded transition ${
        current === "spasoje"
          ? "bg-blue-600 text-white font-medium shadow"
          : "text-slate-400 hover:text-white"
      }`}
    >
      Spasoje Wave
    </button>
    <button
      type="button"
      onClick={() => onSelect("double-steps")}
      className={`px-2.5 py-1 rounded transition ${
        current === "double-steps"
          ? "bg-blue-600 text-white font-medium shadow"
          : "text-slate-400 hover:text-white"
      }`}
    >
      Double Steps
    </button>
    <button
      type="button"
      onClick={() => onSelect("steps")}
      className={`px-2.5 py-1 rounded transition ${
        current === "steps"
          ? "bg-blue-600 text-white font-medium shadow"
          : "text-slate-400 hover:text-white"
      }`}
    >
      Milestones
    </button>
  </div>
);

/**
 * Advanced Multi-Mode Diagnostic Preloader
 * Variants:
 *  1. 'spasoje': Inspired by spasoje.dev — Minimalist editorial typography, massive kinetic counter,
 *     and signature curved SVG wave morph curtain reveal.
 *  2. 'double-steps': Dual parallel progress rails (Neural Engine vs Radiomics Matrix) with split shutter exit.
 *  3. 'steps': 4 discrete sequential milestone cards with live checkmark confirmations.
 */
export const DiagnosticPreloader: React.FC<PreloaderProps> = ({
  onComplete,
  durationMs = 2400,
  initialVariant = "spasoje",
}) => {
  const [variant, setVariant] = useState<PreloaderVariant>(initialVariant);
  const [progress, setProgress] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  // Keyboard shortcut: ESC to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        triggerExit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const triggerExit = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 750);
  };

  useEffect(() => {
    const startTime = performance.now();
    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(pct);

      const step = Math.min(
        milestoneSteps.length - 1,
        Math.floor((pct / 100) * milestoneSteps.length)
      );
      setActiveStepIndex(step);

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          triggerExit();
        }, 320);
      }
    }, 24);

    return () => clearInterval(interval);
  }, [durationMs]);

  // Derived Dual-track progress for Double Steps
  const trackAProgress = Math.min(100, Math.round(progress * 1.05));
  const trackBProgress = Math.max(0, Math.min(100, Math.round((progress - 8) * 1.08)));

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[99999] overflow-hidden select-none">
          {/* ========================================================================= */}
          {/* VARIANT 1: SPASOJE.DEV — CURVED SVG WAVE CURTAIN MORPH REVEAL            */}
          {/* ========================================================================= */}
          {variant === "spasoje" && (
            <motion.div
              initial={{ y: 0 }}
              animate={isExiting ? { y: "-100%" } : { y: 0 }}
              transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
              className="relative w-full h-full bg-[#07090e] text-white flex flex-col justify-between p-6 sm:p-12 overflow-hidden"
            >
              {/* Subtle ambient gradient & noise */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.08),transparent_70%)] pointer-events-none" />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

              {/* Top Navigation Bar: spasoje style bracketed headers */}
              <div className="relative z-10 w-full flex flex-wrap items-center justify-between gap-4 font-mono text-xs tracking-wider text-slate-400 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
                  <span className="font-semibold text-white tracking-widest uppercase">
                    [ RADCORTEX // SPASOJE.DEV LOADER ]
                  </span>
                </div>

                {/* Preloader Mode Switcher */}
                <PreloaderModeSwitcher current={variant} onSelect={setVariant} />

                <div className="flex items-center gap-4 text-[11px]">
                  <span className="text-slate-500 hidden md:inline">
                    STEP {milestoneSteps[activeStepIndex].step} / 04
                  </span>
                  <button
                    type="button"
                    onClick={triggerExit}
                    className="border border-white/15 bg-white/5 hover:border-blue-400 hover:text-white px-3 py-1 rounded-md text-slate-300 font-mono transition"
                  >
                    Skip [ESC] &rarr;
                  </button>
                </div>
              </div>

              {/* Center Kinetic Stage: Oversized Number & Spasoje Typographic Layout */}
              <div className="relative z-10 my-auto flex flex-col items-start justify-center max-w-5xl mx-auto w-full">
                <div className="flex items-center gap-3 font-mono text-xs text-blue-400 uppercase tracking-widest mb-3">
                  <Terminal size={14} />
                  <span>Phase {milestoneSteps[activeStepIndex].step} &bull; {milestoneSteps[activeStepIndex].label}</span>
                </div>

                {/* Massive Kinetic Counter */}
                <div className="w-full flex flex-col md:flex-row md:items-baseline justify-between gap-6">
                  <h1 className="font-mono text-7xl sm:text-9xl md:text-[11rem] font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-500">
                    {String(progress).padStart(2, "0")}
                    <span className="text-3xl sm:text-5xl md:text-6xl text-blue-500 font-light ml-1">%</span>
                  </h1>

                  <div className="md:max-w-xs font-mono text-xs text-slate-400 space-y-2 pb-4">
                    <p className="text-slate-200 font-medium">
                      {milestoneSteps[activeStepIndex].detail}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      TELEMETRY: {milestoneSteps[activeStepIndex].metric} &bull; 60 FPS INERTIAL
                    </p>
                  </div>
                </div>

                {/* Single sleek fluid line progress */}
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-4 relative">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-300"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Bottom Editorial Meta Bar */}
              <div className="relative z-10 w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-500 border-t border-white/5 pt-4">
                <div className="flex items-center gap-3">
                  <Activity size={13} className="text-blue-400 animate-spin" />
                  <span className="text-slate-400">{tickerLogs[activeStepIndex]}</span>
                </div>
                <div className="flex items-center gap-4 text-[11px]">
                  <span>IBSI-2 RADIOMICS</span>
                  <span>&bull;</span>
                  <span>EFFICIENTNET-B0</span>
                  <span>&bull;</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <ShieldCheck size={13} /> SECURE WORKBENCH
                  </span>
                </div>
              </div>

              {/* Signature SVG Curved Wave Morph Arch at bottom */}
              <div className="absolute -bottom-1 left-0 right-0 h-28 pointer-events-none overflow-hidden">
                <svg
                  viewBox="0 0 1000 100"
                  preserveAspectRatio="none"
                  className="w-full h-full fill-[#07090e]"
                >
                  <motion.path
                    initial={{ d: "M 0 100 Q 500 100 1000 100 L 1000 0 L 0 0 Z" }}
                    animate={
                      isExiting
                        ? { d: "M 0 0 Q 500 90 1000 0 L 1000 0 L 0 0 Z" }
                        : { d: "M 0 100 Q 500 100 1000 100 L 1000 0 L 0 0 Z" }
                    }
                    transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
                  />
                </svg>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* VARIANT 2: DOUBLE STEPS — DUAL PROGRESS RAILS & SPLIT SHUTTER REVEAL     */}
          {/* ========================================================================= */}
          {variant === "double-steps" && (
            <div className="relative w-full h-full bg-[#05070c] text-white flex flex-col justify-between p-6 sm:p-12 overflow-hidden">
              {/* Top Shutter */}
              <motion.div
                initial={{ y: 0 }}
                animate={isExiting ? { y: "-100%" } : { y: 0 }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                className="absolute inset-0 bg-[#05070c] pointer-events-none"
              />

              {/* Top Header */}
              <div className="relative z-10 w-full flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-slate-400 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded bg-cyan-400 animate-pulse" />
                  <span className="font-semibold text-white tracking-widest uppercase">
                    [ DOUBLE STEPS // DUAL-STREAM CALIBRATION ]
                  </span>
                </div>

                {/* Preloader Mode Switcher */}
                <PreloaderModeSwitcher current={variant} onSelect={setVariant} />

                <button
                  type="button"
                  onClick={triggerExit}
                  className="border border-white/15 bg-white/5 hover:border-cyan-400 hover:text-white px-3 py-1 rounded-md text-slate-300 font-mono text-xs transition"
                >
                  Skip [ESC] &rarr;
                </button>
              </div>

              {/* Double Steps Core Engine: Two Parallel Streams */}
              <div className="relative z-10 my-auto w-full max-w-4xl mx-auto space-y-10">
                {/* Master Badge */}
                <div className="flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Sliders size={16} />
                    <span className="tracking-wider uppercase font-semibold">SYNCHRONIZED DUAL-STREAM BUFFER</span>
                  </div>
                  <span className="text-3xl font-black font-mono tracking-tight text-white">
                    {progress}%
                  </span>
                </div>

                {/* Track A: Deep Learning Neural Stream */}
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-cyan-500/20 backdrop-blur-md space-y-3">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <Cpu size={16} className="text-cyan-400" />
                      <span className="font-semibold text-slate-200">STREAM 01: NEURAL DEEP LEARNING (EfficientNetB0)</span>
                    </div>
                    <span className="text-cyan-400 font-bold">{trackAProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                      style={{ width: `${trackAProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Weights: 16.2 MB &bull; Softmax 4-Class</span>
                    <span>Lat: 180ms</span>
                  </div>
                </div>

                {/* Track B: Mathematical Radiomics Texture Stream */}
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-amber-500/20 backdrop-blur-md space-y-3">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <Layers size={16} className="text-amber-400" />
                      <span className="font-semibold text-slate-200">STREAM 02: HIGH-ORDER RADIOMICS (GLCM 16-Level)</span>
                    </div>
                    <span className="text-amber-400 font-bold">{trackBProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full"
                      style={{ width: `${trackBProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Texture: Contrast, Homogeneity, Entropy</span>
                    <span>Resectability: Active</span>
                  </div>
                </div>

                {/* Stepped Indicators */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {milestoneSteps.map((m, idx) => {
                    const isPassed = progress >= (idx + 1) * 24;
                    const isCurrent = activeStepIndex === idx;
                    return (
                      <div
                        key={m.step}
                        className={`p-3 rounded-xl border font-mono text-xs transition-all ${
                          isPassed
                            ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-300"
                            : isCurrent
                            ? "border-cyan-400 bg-cyan-950/30 text-white"
                            : "border-white/5 bg-white/[0.02] text-slate-500"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold">STEP {m.step}</span>
                          {isPassed && <CheckCircle2 size={13} className="text-emerald-400" />}
                        </div>
                        <p className="text-[11px] truncate">{m.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Footer */}
              <div className="relative z-10 w-full flex items-center justify-between text-xs font-mono text-slate-500 border-t border-white/5 pt-4">
                <span>DOUBLE STEPS ENGINE &bull; DUAL PIPELINE SYNC</span>
                <span className="text-cyan-400">STATUS: INITIALIZING COMPONENT REPOSITORIES</span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VARIANT 3: STEPS — 4 SEQUENTIAL MILESTONE STAGE CARDS                    */}
          {/* ========================================================================= */}
          {variant === "steps" && (
            <motion.div
              initial={{ y: 0 }}
              animate={isExiting ? { y: "-100%" } : { y: 0 }}
              transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
              className="relative w-full h-full bg-[#07090e] text-white flex flex-col justify-between p-6 sm:p-12 overflow-hidden"
            >
              {/* Top Header */}
              <div className="relative z-10 w-full flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-slate-400 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 animate-ping" />
                  <span className="font-semibold text-white tracking-widest uppercase">
                    [ SEQUENTIAL STEPS // 4-STAGE MILESTONE BOOT ]
                  </span>
                </div>

                {/* Preloader Mode Switcher */}
                <PreloaderModeSwitcher current={variant} onSelect={setVariant} />

                <button
                  type="button"
                  onClick={triggerExit}
                  className="border border-white/15 bg-white/5 hover:border-indigo-400 hover:text-white px-3 py-1 rounded-md text-slate-300 font-mono text-xs transition"
                >
                  Skip [ESC] &rarr;
                </button>
              </div>

              {/* 4 Staggered Milestone Cards */}
              <div className="relative z-10 my-auto w-full max-w-4xl mx-auto space-y-6">
                <div className="text-center space-y-2 mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 font-mono text-xs">
                    <Sparkles size={13} />
                    <span>DIAGNOSTIC WORKBENCH INITIALIZATION</span>
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-black font-mono tracking-tight">
                    {progress}% <span className="text-slate-500 text-xl font-normal">COMPLETED</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {milestoneSteps.map((m, idx) => {
                    const isPassed = progress >= (idx + 1) * 24;
                    const isCurrent = activeStepIndex === idx;

                    return (
                      <div
                        key={m.step}
                        className={`p-5 rounded-2xl border font-mono transition-all duration-300 ${
                          isPassed
                            ? "border-emerald-500/40 bg-emerald-950/20 text-white shadow-lg shadow-emerald-950/20"
                            : isCurrent
                            ? "border-indigo-500 bg-indigo-950/30 text-white shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500"
                            : "border-white/5 bg-white/[0.02] text-slate-500 opacity-60"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-indigo-400">STEP {m.step}</span>
                          {isPassed ? (
                            <span className="flex items-center gap-1 text-emerald-400 text-xs">
                              <CheckCircle2 size={14} /> Ready
                            </span>
                          ) : isCurrent ? (
                            <span className="flex items-center gap-1 text-indigo-400 text-xs animate-pulse">
                              <Activity size={14} className="animate-spin" /> In Progress
                            </span>
                          ) : (
                            <span className="text-slate-600 text-xs">Pending</span>
                          )}
                        </div>
                        <h3 className="text-base font-semibold text-white mb-1">{m.label}</h3>
                        <p className="text-xs text-slate-400">{m.detail}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Overall Step Progress */}
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-6">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-400 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Bottom Footer */}
              <div className="relative z-10 w-full flex items-center justify-between text-xs font-mono text-slate-500 border-t border-white/5 pt-4">
                <span>RADCORTEX AI &bull; CLINICAL RADIOMICS PROTOCOL</span>
                <span className="text-indigo-400 font-semibold">{tickerLogs[activeStepIndex]}</span>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
};
