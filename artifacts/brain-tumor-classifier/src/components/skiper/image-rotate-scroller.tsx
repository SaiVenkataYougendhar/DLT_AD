import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Sparkles, Activity, CheckCircle2, ChevronLeft, ChevronRight, Layers, Eye, Compass } from "lucide-react";

export interface ScrollerCardData {
  id: string | number;
  title: string;
  organ: string;
  modality: string;
  image: string;
  prediction: string;
  confidence: string;
  biomarker: string;
  resectability: string;
  direction: "ccw" | "cw";
  baseAngle: number;
}

const defaultCards: ScrollerCardData[] = [
  {
    id: 1,
    title: "Neuro-Oncology Cranial T2ce",
    organ: "Brain / CNS",
    modality: "T1ce Axial MRI",
    image: "/samples/sample-meningioma.jpg",
    prediction: "Meningioma",
    confidence: "82.9%",
    biomarker: "Sobel Margin: Sharp (0.84)",
    resectability: "GTR Feasibility: 84.5%",
    direction: "ccw",
    baseAngle: -14, // Counter-Clockwise
  },
  {
    id: 2,
    title: "Infiltrative High-Grade Glioma",
    organ: "Frontal Lobe",
    modality: "T2-FLAIR Contrast",
    image: "/samples/sample-glioma.jpg",
    prediction: "Glioma",
    confidence: "87.3%",
    biomarker: "GLCM Contrast: Elevated (78.2)",
    resectability: "GTR Feasibility: 45.0%",
    direction: "cw",
    baseAngle: 15, // Clockwise
  },
  {
    id: 3,
    title: "Pituitary Sellar Macroadenoma",
    organ: "Sellar Region",
    modality: "Coronal Pituitary MRI",
    image: "/samples/sample-pituitary.jpg",
    prediction: "Pituitary Adenoma",
    confidence: "70.8%",
    biomarker: "Entropy: High (0.89)",
    resectability: "Transsphenoidal: 88.0%",
    direction: "ccw",
    baseAngle: -16, // Counter-Clockwise
  },
  {
    id: 4,
    title: "Healthy Cranial Parenchyma",
    organ: "Normal Brain",
    modality: "T1 Control Axial",
    image: "/samples/sample-notumor.jpg",
    prediction: "No Tumor (Healthy)",
    confidence: "94.2%",
    biomarker: "Homogeneity: Normal (0.91)",
    resectability: "N/A (Intact Architecture)",
    direction: "cw",
    baseAngle: 13, // Clockwise
  },
];

/**
 * Individual Scroll-Animated Card that rotates in its signature alternating direction
 * as the user scrolls down the page with Lenis smooth scroll.
 */
const ScrollAnimatedImageCard: React.FC<{
  card: ScrollerCardData;
  index: number;
  scrollYProgress: any;
}> = ({ card, index, scrollYProgress }) => {
  const isCCW = card.direction === "ccw";
  const startAngle = isCCW ? -(16 + index * 2) : 16 + index * 2;
  const midAngle = isCCW ? -(6 + index) : 6 + index;
  const endAngle = isCCW ? 2 : -2;

  const rawRotate = useTransform(
    scrollYProgress,
    [0.1, 0.5, 0.9],
    [startAngle, midAngle, endAngle]
  );
  const smoothRotate = useSpring(rawRotate, { stiffness: 120, damping: 18 });

  const rawY = useTransform(
    scrollYProgress,
    [0, 1],
    [index % 2 === 0 ? 40 : -40, index % 2 === 0 ? -40 : 40]
  );
  const smoothY = useSpring(rawY, { stiffness: 90, damping: 20 });

  const scale = useTransform(scrollYProgress, [0, 0.45, 0.9], [0.92, 1, 0.96]);

  return (
    <motion.div
      style={{
        rotate: smoothRotate,
        y: smoothY,
        scale,
      }}
      whileHover={{
        scale: 1.04,
        rotate: 0,
        zIndex: 50,
        transition: { duration: 0.35, ease: "easeOut" },
      }}
      className="metallic-card group relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 shadow-xl transition-shadow duration-300 hover:shadow-2xl"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-lg text-[10px] font-mono font-bold ${
              isCCW
                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
            }`}
          >
            0{index + 1}
          </span>
          <span className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200 truncate max-w-[170px]">
            {card.title}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
            {isCCW ? "↺ Counter-Clockwise (-14°)" : "↻ Clockwise (+15°)"}
          </span>
        </div>
      </div>

      {/* MRI Viewport with Bullseye Inspection Reticle */}
      <div className="relative my-3.5 aspect-square rounded-2xl overflow-hidden bg-black flex items-center justify-center">
        <img
          src={card.image}
          alt={card.title}
          className="w-full h-full object-contain select-none transition-transform duration-500 group-hover:scale-108"
        />

        {/* Dynamic Target Reticle Overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="h-16 w-16 rounded-full border border-blue-400/80 shadow-[0_0_12px_rgba(59,130,246,0.6)] flex items-center justify-center">
            <div className="h-7 w-7 rounded-full border border-blue-300/70" />
            <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
          </div>
          <div className="absolute h-full w-px bg-blue-400/40" />
          <div className="absolute w-full h-px bg-blue-400/40" />
        </div>

        {/* Metallic telemetry strip */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md text-white text-xs border border-white/10">
          <span className="font-bold text-blue-400 text-[11px] truncate max-w-[120px]">{card.prediction}</span>
          <span className="font-mono text-emerald-400 font-bold text-[11px]">{card.confidence}</span>
        </div>
      </div>

      {/* Telemetry Footer */}
      <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono">
        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5 truncate">
            <Activity size={12} className="text-blue-500 shrink-0" />
            <span className="truncate">{card.biomarker}</span>
          </span>
        </div>
        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5 truncate">
            <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
            <span className="truncate">{card.resectability}</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Skiper17 - Scroll-Driven Dynamic Alternating Image Scroller
 * As the user scrolls down the page, each image card rotates smoothly in an alternating
 * direction (Card 0 rotates CCW, Card 1 rotates CW, Card 2 rotates CCW, Card 3 rotates CW),
 * creating an ultra-responsive kinetic showcase that works in harmony with buttery smooth scroll.
 */
export const ImageRotateScroller: React.FC<{ cards?: ScrollerCardData[]; className?: string }> = ({
  cards = defaultCards,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <div
      ref={containerRef}
      className={`relative w-full py-24 px-6 max-w-7xl mx-auto overflow-hidden ${className}`}
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/25 mb-3">
            <Sparkles size={13} className="text-accent" />
            <span>KINETIC PROJECTION HORIZON // DYNAMIC TORSION ALIGNMENT</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black font-serif text-foreground tracking-tight">
            Multi-Angle Volumetric Reticle Scanner
          </h2>
          <p className="mt-3.5 text-sm md:text-base text-muted-foreground leading-relaxed">
            Interactive scroll-driven rotational alignment. Alternating counter-clockwise (CCW ↺) and clockwise (CW ↻)
            perspective shifting reveals sub-visual lesion contours, dural tails, and 3D infiltrative margins with zero spatial distortion.
            Hover over any card to level the inspection horizon to 0°.
          </p>
        </div>

        {/* Scroll Indicator Badge */}
        <div className="panel metallic-pill hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono text-foreground border-border/80">
          <Compass size={14} className="text-accent animate-spin" />
          <span>Scroll-Driven Directional Physics</span>
        </div>
      </div>

      {/* 4-Card Responsive Grid with Alternating Scroll-Driven Rotation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 pt-4 pb-12">
        {cards.map((card, idx) => (
          <ScrollAnimatedImageCard
            key={card.id}
            card={card}
            index={idx}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>

      {/* Bottom Kinetic Telemetry Strip */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card/60 p-4 text-xs font-mono text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
          <span>KINETIC TORSION: Lesions 01 & 03 (Counter-Clockwise -14° Negative Pitch) · Lesions 02 & 04 (Clockwise +15° Positive Pitch)</span>
        </div>
        <div className="text-[11px] text-accent font-bold">
          HOVER ANY CARD TO LEVEL INSPECTION HORIZON TO 0°
        </div>
      </div>
    </div>
  );
};
