import React, { useState } from "react";
import { motion } from "framer-motion";

/**
 * Skiper42 - Micro-interaction Animated Icons with Framer Motion
 * Includes:
 * - Animated Sidebar Toggle
 * - Copy Telemetry Icon with checkmark transition
 * - Source Code Icon
 * - Secure Lock Icon
 * - Pulse Activity Indicator
 * - Multi-Organ Scanner Icon
 */

export const AnimatedSidebarIcon: React.FC<{ className?: string; isOpen?: boolean; onClick?: () => void }> = ({
  className = "size-5",
  isOpen = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="relative flex cursor-pointer items-center justify-center p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      title="Toggle Sidebar"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.327 2.638C0 3.28 0 4.12 0 5.8V10.2C0 11.88 0 12.72 0.327 13.362C0.615 13.927 1.074 14.385 1.638 14.673C2.28 15 3.12 15 4.8 15H11.2C12.88 15 13.72 15 14.362 14.673C14.927 14.385 15.385 13.927 15.673 13.362C16 12.72 16 11.88 16 10.2V5.8C16 4.12 16 3.28 15.673 2.638C15.385 2.074 14.927 1.615 14.362 1.327C13.72 1 12.88 1 11.2 1H4.8C3.12 1 2.28 1 1.638 1.327C1.074 1.615 0.615 2.074 0.327 2.638Z"
          fill="currentColor"
          opacity="0.9"
        />
      </svg>
      {/* Dynamic Animated Panel Bar inside Sidebar Icon */}
      <motion.div
        className="absolute left-[7px] top-[7px] bottom-[7px] bg-white dark:bg-slate-900 rounded-[1px]"
        animate={{ width: isOpen ? "6px" : "2px" }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      />
    </div>
  );
};

export const AnimatedCopyIcon: React.FC<{ textToCopy: string; className?: string }> = ({
  textToCopy,
  className = "size-4",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      title="Copy to Clipboard"
    >
      <div className="relative flex items-center justify-center">
        {copied ? (
          <motion.svg
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`${className} text-emerald-500`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </motion.svg>
        ) : (
          <motion.svg
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </motion.svg>
        )}
      </div>
      <span>{copied ? "Copied" : "Copy"}</span>
    </button>
  );
};

export const AnimatedPulseSpinner: React.FC<{ size?: number; color?: string }> = ({
  size = 18,
  color = "currentColor",
}) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </motion.svg>
  );
};

export const AnimatedOrganIcon: React.FC<{
  type: "brain" | "lung" | "liver" | "bone" | "prostate";
  className?: string;
}> = ({ type, className = "size-5" }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.12, rotate: [0, -4, 4, 0] }}
      transition={{ duration: 0.3 }}
      className={`inline-flex items-center justify-center ${className}`}
    >
      {type === "brain" && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54Z" />
          <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54Z" />
        </svg>
      )}
      {type === "lung" && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
          <path d="M12 4v7" />
          <path d="M7 6c-2.5 1-4 3.5-4 7 0 4 2.5 7 5.5 7 2 0 3.5-1.5 3.5-3.5V11" />
          <path d="M17 6c2.5 1 4 3.5 4 7 0 4-2.5 7-5.5 7-2 0-3.5-1.5-3.5-3.5V11" />
        </svg>
      )}
      {type === "liver" && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
          <path d="M3 11c0-4 4-7 11-7 5 0 7 3 7 7 0 5-4 9-10 9-5 0-8-4-8-9Z" />
          <path d="M14 4c0 4-1 8-5 11" strokeDasharray="2 2" />
        </svg>
      )}
      {type === "bone" && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
          <path d="M17 10c.7-.7 1.6-1 2.5-1 2 0 3.5 1.5 3.5 3.5 0 1-.4 1.8-1 2.5l-8 8c-.7.7-1.5 1-2.5 1-2 0-3.5-1.5-3.5-3.5 0-.9.3-1.8 1-2.5l8-8Z" />
          <path d="m14 7 3 3" />
        </svg>
      )}
      {type === "prostate" && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v8" />
          <path d="M8 12h8" />
        </svg>
      )}
    </motion.div>
  );
};

