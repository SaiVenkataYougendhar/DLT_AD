import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

export type TermItem = {
  id: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
};

interface TermSectionProps {
  term: TermItem;
  index: number;
  setActiveTerm: (index: number) => void;
  children: React.ReactNode;
}

const TermSection: React.FC<TermSectionProps> = ({
  term,
  index,
  setActiveTerm,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    amount: 0.25,
    margin: "-80px 0px -40% 0px",
  });

  useEffect(() => {
    if (isInView) {
      setActiveTerm(index);
    }
  }, [isInView, index, setActiveTerm]);

  return (
    <div ref={ref} id={term.id} className="scroll-mt-28 space-y-4 md:space-y-6">
      {children}
    </div>
  );
};

interface Skiper60Props {
  title?: string;
  subtitle?: string;
  terms: TermItem[];
  className?: string;
}

/**
 * Skiper60 - Side Scroll Navigation
 * Official layout from https://skiper-ui.com/v1/skiper60
 * Features sticky left navigation with active spring indicator, scrollspy, and clean section anchors.
 */
export const Skiper60: React.FC<Skiper60Props> = ({
  title = "Clinical Documentation & Radiomics Guide",
  subtitle = "Step-by-step operating manual for deep learning classification and quantitative radiomic biomarker extraction.",
  terms,
  className = "",
}) => {
  const [activeTerm, setActiveTerm] = useState<number>(0);

  return (
    <div className={`min-h-screen px-4 py-8 lg:px-12 lg:py-12 ${className}`}>
      {/* Header */}
      <div className="max-w-4xl mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          User Manual & Clinical Protocol
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400 md:text-lg">
            {subtitle}
          </p>
        )}
      </div>

      {/* Main Layout: Sticky Sidebar + Content Stream */}
      <div className="relative mb-[30vh] flex flex-col lg:flex-row gap-12 py-6 md:py-10">
        {/* Sticky Sidebar Navigation (Skiper60) */}
        <div className="lg:w-80 shrink-0">
          <div className="sticky top-24 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-5 shadow-sm backdrop-blur-md">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
              Table of Contents
            </h3>
            <ul className="border-l border-slate-200 dark:border-slate-800 space-y-3.5">
              {terms.map((term, index) => {
                const isActive = activeTerm === index;
                return (
                  <li key={term.id} className="relative cursor-pointer pl-4">
                    <a
                      href={`#${term.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById(term.id);
                        if (el) {
                          el.scrollIntoView({ behavior: "smooth" });
                          setActiveTerm(index);
                        }
                      }}
                      className="group block"
                    >
                      {isActive && (
                        <motion.span
                          layoutId="active-term"
                          className="absolute -left-[1.5px] top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full bg-blue-600 dark:bg-blue-400"
                          transition={{ type: "spring", stiffness: 450, damping: 32 }}
                        />
                      )}
                      <p
                        className={`text-sm font-medium transition-colors duration-200 ${
                          isActive
                            ? "text-blue-600 dark:text-blue-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                        }`}
                      >
                        {term.title}
                      </p>
                      {term.subtitle && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                          {term.subtitle}
                        </p>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>

            {/* Quick action button in sidebar */}
            <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800">
              <a
                href="/classify"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
              >
                Launch Radiomics Workbench
              </a>
            </div>
          </div>
        </div>

        {/* Content Stream */}
        <div className="flex-1 flex flex-col gap-12 md:gap-16 max-w-4xl">
          {terms.map((term, index) => (
            <TermSection
              key={term.id}
              term={term}
              index={index}
              setActiveTerm={setActiveTerm}
            >
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-xs font-bold text-blue-600 dark:text-blue-400">
                    0{index + 1}
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                    {term.title}
                  </h2>
                </div>
                <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                  {term.content}
                </div>
              </div>
            </TermSection>
          ))}
        </div>
      </div>
    </div>
  );
};

