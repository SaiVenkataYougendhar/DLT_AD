import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

interface BrainThemeToggleProps {
  className?: string;
}

/**
 * Skiper26 + Skiper4:
 * Animated Brain Theme Toggle with Synaptic Illumination and View Transition API circular expansion ripple.
 * Works symmetrically in both directions: light -> dark AND dark -> light with zero adjacent text.
 */
export const BrainThemeToggle: React.FC<BrainThemeToggleProps> = ({ className = "" }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return (
        document.documentElement.classList.contains("dark") ||
        localStorage.getItem("radcortex-theme") === "dark" ||
        (!localStorage.getItem("radcortex-theme") &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("radcortex-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("radcortex-theme", "light");
    }
  }, [isDark]);

  const toggleTheme = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const nextDark = !isDark;

      // Remove any legacy injected style tag to prevent collisions
      if (typeof document !== "undefined") {
        const legacyStyle = document.getElementById("skiper26-circular-transition");
        if (legacyStyle) legacyStyle.remove();
      }

      // Check if browser supports View Transition API (Skiper26)
      if (
        typeof document !== "undefined" &&
        "startViewTransition" in document &&
        typeof (document as any).startViewTransition === "function"
      ) {
        // Calculate exact click coordinates for the circular ripple
        const rect = event.currentTarget.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        const maxRadius = Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y)
        );

        const transition = (document as any).startViewTransition(() => {
          setIsDark(nextDark);
          if (nextDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("radcortex-theme", "dark");
          } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("radcortex-theme", "light");
          }
        });

        transition.ready.then(() => {
          const clipPath = [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ];

          document.documentElement.animate(
            {
              clipPath: clipPath,
            },
            {
              duration: 520,
              easing: "cubic-bezier(0.4, 0, 0.2, 1)",
              pseudoElement: "::view-transition-new(root)",
            }
          );
        });
      } else {
        // Fallback for browsers without View Transitions
        setIsDark(nextDark);
        if (nextDark) {
          document.documentElement.classList.add("dark");
          localStorage.setItem("radcortex-theme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("radcortex-theme", "light");
        }
      }
    },
    [isDark]
  );

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? "Switch to Clinical Light Theme" : "Switch to Dark High-Contrast Theme"}
      aria-label="Toggle Theme"
      className={`group relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-0 text-slate-700 dark:text-slate-200 shadow-sm backdrop-blur transition-all duration-300 hover:border-blue-400 hover:shadow-md active:scale-95 ${className}`}
    >
      <div className="relative flex h-6 w-6 items-center justify-center">
        {/* Animated Synaptic Brain Icon (Skiper4 Bulb Adaptation) */}
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
        >
          {/* Cerebral Cortex Outer Silhouette */}
          <motion.path
            d="M16 4C13.2 4 10.8 5.6 9.6 8C7.5 8.3 5.8 9.8 5.3 11.9C4.5 13.1 4 14.5 4 16C4 18.2 4.9 20.2 6.4 21.6C6.1 22.4 6 23.2 6 24C6 26.8 8.2 29 11 29C12.4 29 13.7 28.4 14.6 27.5C15 27.8 15.5 28 16 28C16.5 28 17 27.8 17.4 27.5C18.3 28.4 19.6 29 21 29C23.8 29 26 26.8 26 24C26 23.2 25.9 22.4 25.6 21.6C27.1 20.2 28 18.2 28 16C28 14.5 27.5 13.1 26.7 11.9C26.2 9.8 24.5 8.3 22.4 8C21.2 5.6 18.8 4 16 4Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-colors duration-300"
          />

          {/* Central Longitudinal Fissure (Hemisphere Divider) */}
          <line
            x1="16"
            y1="7"
            x2="16"
            y2="25"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeDasharray="2 2"
            opacity="0.4"
          />

          {/* Left Hemisphere Synaptic Convolutions */}
          <motion.path
            d="M9 13C10.5 13 11.5 14.2 11.5 16C11.5 17.5 10.5 19 8.5 19"
            stroke={isDark ? "#38bdf8" : "#2563eb"}
            strokeWidth="1.5"
            strokeLinecap="round"
            animate={{
              pathLength: isDark ? 1 : 0.85,
              opacity: isDark ? 1 : 0.7,
            }}
            transition={{ duration: 0.35 }}
          />

          <motion.path
            d="M13 10C13 12 14.5 13 14.5 15"
            stroke={isDark ? "#818cf8" : "#4f46e5"}
            strokeWidth="1.5"
            strokeLinecap="round"
            animate={{
              scale: isDark ? 1.05 : 1,
              opacity: isDark ? 1 : 0.65,
            }}
            transition={{ duration: 0.35 }}
          />

          {/* Right Hemisphere Synaptic Convolutions */}
          <motion.path
            d="M23 13C21.5 13 20.5 14.2 20.5 16C20.5 17.5 21.5 19 23.5 19"
            stroke={isDark ? "#fbbf24" : "#f59e0b"}
            strokeWidth="1.5"
            strokeLinecap="round"
            animate={{
              pathLength: isDark ? 1 : 0.85,
              opacity: isDark ? 1 : 0.7,
            }}
            transition={{ duration: 0.35 }}
          />

          <motion.path
            d="M19 10C19 12 17.5 13 17.5 15"
            stroke={isDark ? "#f43f5e" : "#e11d48"}
            strokeWidth="1.5"
            strokeLinecap="round"
            animate={{
              scale: isDark ? 1.05 : 1,
              opacity: isDark ? 1 : 0.65,
            }}
            transition={{ duration: 0.35 }}
          />

          {/* Dark Mode Synaptic Glow Points */}
          {isDark && (
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <circle cx="11.5" cy="16" r="1.5" fill="#38bdf8" />
              <circle cx="20.5" cy="16" r="1.5" fill="#fbbf24" />
              <circle cx="16" cy="11" r="1.2" fill="#60a5fa" />
              <circle cx="16" cy="22" r="1.2" fill="#a78bfa" />
            </motion.g>
          )}
        </svg>

        {/* Ambient synaptic glow in dark mode */}
        {isDark && (
          <span className="absolute -inset-1 rounded-full bg-blue-500/20 blur-sm pointer-events-none" />
        )}
      </div>
    </button>
  );
};
