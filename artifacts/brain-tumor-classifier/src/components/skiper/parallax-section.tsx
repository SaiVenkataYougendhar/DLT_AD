import React, { useRef } from "react";
import { Link } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";
import { Brain, Layers, Activity, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";

interface ParallaxSectionProps {
  children?: React.ReactNode;
  className?: string;
  speed?: number;
}

/**
 * Skiper55 - Parallax Depth Showcase
 * Enhances any section with smooth scroll-driven vertical parallax, floating biomarker badges,
 * and holographic depth layers.
 */
export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  className = "",
  speed = 35,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax transforms at multiple speeds
  const bgY = useTransform(scrollYProgress, [0, 1], ["-10%", `${speed}%`]);
  const floatingLayerY = useTransform(scrollYProgress, [0, 1], ["15%", `-${speed * 1.2}%`]);
  const cardY = useTransform(scrollYProgress, [0, 1], ["5%", `-${speed * 0.6}%`]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden py-24 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-white shadow-2xl my-16 ${className}`}
    >
      {/* Background Holographic Layer */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500 via-indigo-900 to-transparent"
      />

      {/* Subtle Anatomical Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f610_1px,transparent_1px),linear-gradient(to_bottom,#3b82f610_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Floating Differential Telemetry Badges (Skiper55 Parallax Effect) */}
      <motion.div
        style={{ y: floatingLayerY }}
        className="absolute top-12 left-8 md:left-16 z-10 hidden sm:flex items-center gap-2 rounded-2xl border border-blue-500/30 bg-slate-950/80 px-4 py-2.5 backdrop-blur-md shadow-xl"
      >
        <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
        <span className="text-xs font-mono font-bold text-blue-300">
          GLCM Dissimilarity: 2.14 · Homogeneity: 0.82
        </span>
      </motion.div>

      <motion.div
        style={{ y: floatingLayerY }}
        className="absolute bottom-16 right-8 md:right-16 z-10 hidden sm:flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-slate-950/80 px-4 py-2.5 backdrop-blur-md shadow-xl"
      >
        <ShieldCheck size={14} className="text-emerald-400" />
        <span className="text-xs font-mono font-bold text-emerald-300">
          GTR Feasibility: 84.5% (High Resectability)
        </span>
      </motion.div>

      {/* Center Interactive Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
        {children ? (
          children
        ) : (
          <motion.div style={{ y: cardY }} className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Sparkles size={13} />
              <span>Depth-Calibrated Feature Engine</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              Mathematical Phenotypes In Every Voxel
            </h2>

            <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed">
              Moving beyond surface impressions: our IBSI radiomics pipeline calculates second-order spatial gray-level
              dependencies, quantifying microvascular density, cellular necrosis, and margin infiltration across 3D scan volumes.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/classify"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-500 active:scale-95"
              >
                <span>Analyze Scan in Studio</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/radiomics"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3.5 text-xs font-bold text-slate-200 transition hover:bg-slate-700 active:scale-95"
              >
                <Layers size={14} className="text-blue-400" />
                <span>Explore Multi-Organ Modalities</span>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

