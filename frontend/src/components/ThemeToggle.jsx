import React from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const TOGGLE_CLASSES =
  "text-xs font-medium flex items-center gap-1.5 px-3 py-1.5 transition-colors relative z-10 w-full justify-center";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative flex w-full items-center rounded-xl p-1" style={{ background: 'var(--surface-highest)' }}>
      <button
        className={`${TOGGLE_CLASSES} ${
          theme === "light" ? "text-white" : "text-[var(--text-dim)]"
        }`}
        onClick={() => toggleTheme("light")}
      >
        <Sun size={14} className="relative z-10" />
        <span className="relative z-10">Light</span>
      </button>
      <button
        className={`${TOGGLE_CLASSES} ${
          theme === "dark" ? "text-white" : "text-[var(--text-dim)]"
        }`}
        onClick={() => toggleTheme("dark")}
      >
        <Moon size={14} className="relative z-10" />
        <span className="relative z-10">Dark</span>
      </button>
      <div
        className={`absolute inset-0 z-0 flex p-1 ${
          theme === "dark" ? "justify-end" : "justify-start"
        }`}
      >
        <motion.span
          layout
          transition={{ type: "spring", damping: 15, stiffness: 250 }}
          className="h-full w-1/2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600"
        />
      </div>
    </div>
  );
}
