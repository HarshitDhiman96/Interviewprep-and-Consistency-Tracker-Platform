import React, { useState } from "react";
import { MotionConfig, motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSkillContext } from "../context/SkillContext";
import { Activity, User, LayoutDashboard, LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../context/AuthContext";

export const MobileNav = ({ navLinks }) => {
  const [active, setActive] = useState(false);
  const navigate = useNavigate();
  const { isHeatmapVisible, setIsHeatmapVisible } = useSkillContext();
  const { isAuthenticated, logout } = useAuth();

  const handleNavigate = (path) => {
    setActive(false);
    if (!path.startsWith('#')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setTimeout(() => {
      if (path.startsWith('#')) {
        window.location.hash = path;
      } else {
        navigate(path);
      }
    }, 300);
  };

  const handleLogout = () => {
    setActive(false);
    logout().finally(() => navigate('/'));
  };

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <MotionConfig
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
      >
        <motion.button
          initial={false}
          animate={active ? "open" : "closed"}
          onClick={() => setActive((pv) => !pv)}
          className="relative h-12 w-12 rounded-full bg-transparent hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors z-[100]"
        >
          <motion.span
            variants={VARIANTS.top}
            className="absolute h-[2px] w-6 bg-zinc-800 dark:bg-white"
            style={{ y: "-50%", left: "50%", x: "-50%", top: "35%" }}
          />
          <motion.span
            variants={VARIANTS.middle}
            className="absolute h-[2px] w-6 bg-zinc-800 dark:bg-white"
            style={{ left: "50%", x: "-50%", top: "50%", y: "-50%" }}
          />
          <motion.span
            variants={VARIANTS.bottom}
            className="absolute h-[2px] w-3 bg-zinc-800 dark:bg-white"
            style={{
              x: "-50%",
              y: "50%",
              bottom: "35%",
              left: "calc(50% + 6px)",
            }}
          />
        </motion.button>
      </MotionConfig>

      {/* Slide-out Panel */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.45 }}
            className="fixed inset-0 w-screen h-screen z-[99] p-8 flex flex-col justify-center items-center bg-zinc-50/98 dark:bg-[#0e0e0e]/98 backdrop-blur-2xl"
          >
            <div className="flex flex-col items-center justify-center gap-6 w-full max-w-xs">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavigate(link.href)}
                  className="text-center text-2xl font-black text-zinc-800 hover:text-blue-600 dark:text-white dark:hover:text-[#84adff] transition-colors"
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                >
                  {link.label}
                </button>
              ))}
              <hr className="w-full border-zinc-200 dark:border-white/10 my-2" />
              <div className="w-full flex justify-center scale-110">
                <ThemeToggle />
              </div>
              <hr className="w-full border-zinc-200 dark:border-white/10 my-2" />
              <div className="w-full flex items-center justify-between text-zinc-800 dark:text-white/80 px-2">
                 <span className="flex items-center gap-2 text-sm font-bold"><Activity size={16} color="#fd8b00" /> Heatmap Mode</span>
                 <button 
                    onClick={() => setIsHeatmapVisible(!isHeatmapVisible)}
                    className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${isHeatmapVisible ? 'bg-blue-600 dark:bg-[#84adff]' : 'bg-zinc-300 dark:bg-white/10'}`}
                 >
                    <motion.div 
                       className="w-5 h-5 bg-white rounded-full absolute top-0.5"
                       animate={{ left: isHeatmapVisible ? "26px" : "2px" }}
                       transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                 </button>
              </div>
              <hr className="w-full border-zinc-200 dark:border-white/10 my-2" />
              {isAuthenticated ? (
                <div className="flex flex-col gap-4 w-full">
                  <button
                    onClick={() => handleNavigate('/dashboard')}
                    className="w-full py-3.5 rounded-2xl font-bold text-center text-zinc-800 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 flex items-center justify-center gap-2 transition-colors border border-zinc-200 dark:border-white/5"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </button>
                  <button
                    onClick={() => handleNavigate('/profile')}
                    className="w-full py-3.5 rounded-2xl font-bold text-center text-zinc-800 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 flex items-center justify-center gap-2 transition-colors border border-zinc-200 dark:border-white/5"
                  >
                    <User size={18} />
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full py-3.5 rounded-2xl font-bold text-center text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 flex items-center justify-center gap-2 transition-colors border border-red-200 dark:border-red-500/20"
                  >
                    <LogOut size={18} />
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4 w-full">
                  <button
                    onClick={() => handleNavigate('/login')}
                    className="w-full py-3.5 rounded-2xl font-bold text-center text-zinc-800 dark:text-white bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 transition-colors border border-zinc-200 dark:border-white/5"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => handleNavigate('/signup')}
                    className="w-full py-3.5 rounded-2xl font-bold text-center bg-blue-600 hover:bg-blue-700 text-white dark:bg-[#84adff] dark:hover:bg-blue-500 dark:text-[#002d64] transition-colors shadow-lg shadow-blue-500/15"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop overlay */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[98] md:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const VARIANTS = {
  top: {
    open: {
      rotate: ["0deg", "0deg", "45deg"],
      top: ["35%", "50%", "50%"],
    },
    closed: {
      rotate: ["45deg", "0deg", "0deg"],
      top: ["50%", "50%", "35%"],
    },
  },
  middle: {
    open: {
      rotate: ["0deg", "0deg", "-45deg"],
    },
    closed: {
      rotate: ["-45deg", "0deg", "0deg"],
    },
  },
  bottom: {
    open: {
      rotate: ["0deg", "0deg", "45deg"],
      bottom: ["35%", "50%", "50%"],
      left: "50%",
    },
    closed: {
      rotate: ["45deg", "0deg", "0deg"],
      bottom: ["50%", "50%", "35%"],
      left: "calc(50% + 6px)",
    },
  },
};
export default MobileNav;
