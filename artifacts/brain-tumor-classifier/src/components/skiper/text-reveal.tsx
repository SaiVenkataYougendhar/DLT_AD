import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { Sparkles, ArrowDown } from "lucide-react";

interface WordProps {
  word: string;
  index: number;
  totalWords: number;
  scrollProgress: MotionValue<number>;
}

const Word: React.FC<WordProps> = ({
  word,
  index,
  totalWords,
  scrollProgress,
}) => {
  const step = 1 / Math.max(1, totalWords);
  const start = index * step * 0.8;
  const end = Math.min(1, start + step * 2.2);

  const opacity = useTransform(scrollProgress, [start, end], [0.18, 1]);
  const y = useTransform(scrollProgress, [start, end], [4, 0]);

  return (
    <motion.span
      className="mr-2 sm:mr-3.5 inline-block font-extrabold tracking-tight transition-colors"
      style={{ y, opacity }}
    >
      {word}
    </motion.span>
  );
};

interface SkiperTextRevealProps {
  children?: string;
  eyebrow?: string;
  className?: string;
}

/**
 * Skiper72 - Responsive Kinetic Text Reveal
 * Words glide horizontally into view with smooth opacity as the user scrolls,
 * without hijacking the scrollbar or creating excessive blank space.
 */
export const SkiperTextReveal: React.FC<SkiperTextRevealProps> = ({
  children = "From Raw Medical Pixels To Objective Biological Signals — We Transform Visual Interpretation Into Reproducible Mathematical Biomarkers And Precision Treatment Pathways.",
  eyebrow = "Clinical Core Manifesto",
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 30%"],
  });

  const words = children.split(" ");

  return (
    <div
      ref={containerRef}
      className={`relative w-full py-20 md:py-28 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto ${className}`}
    >
      <div className="flex flex-col justify-center">
        {eyebrow && (
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 w-fit">
            <Sparkles size={13} />
            <span>{eyebrow}</span>
          </div>
        )}

        <div className="max-w-5xl">
          <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.15] text-slate-900 dark:text-white">
            {words.map((word, i) => (
              <Word
                key={i}
                word={word}
                index={i}
                totalWords={words.length}
                scrollProgress={scrollYProgress}
              />
            ))}
          </p>
        </div>

        <div className="mt-8 flex items-center gap-3 text-xs font-mono text-slate-400">
          <ArrowDown size={14} className="text-blue-500 animate-bounce" />
          <span>CONTINUE SCROLLING FOR RADIOMICS MODALITIES</span>
        </div>
      </div>
    </div>
  );
};
