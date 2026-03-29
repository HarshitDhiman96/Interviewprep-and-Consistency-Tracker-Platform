import React, { useState } from "react";
import { MotionConfig, motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSkillContext } from "../context/SkillContext";
import { Activity } from "lucide-react";

export const MobileNav = ({ navLinks }) => {
  const [active, setActive] = useState(false);
  const navigate = useNavigate();
  const { isHeatmapVisible, setIsHeatmapVisible } = useSkillContext();

  const handleNavigate = (path) => {
    setActive(false);
    setTimeout(() => {
      if (path.startsWith('#')) {
        window.location.hash = path;
      } else {
        navigate(path);
      }
    }, 300);
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
          className="relative h-12 w-12 rounded-full bg-white/0 transition-colors hover:bg-white/10 z-[60]"
        >
          <motion.span
            variants={VARIANTS.top}
            className="absolute h-[2px] w-6 bg-white"
            style={{ y: "-50%", left: "50%", x: "-50%", top: "35%" }}
          />
          <motion.span
            variants={VARIANTS.middle}
            className="absolute h-[2px] w-6 bg-white"
            style={{ left: "50%", x: "-50%", top: "50%", y: "-50%" }}
          />
          <motion.span
            variants={VARIANTS.bottom}
            className="absolute h-[2px] w-3 bg-white"
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
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed inset-y-0 right-0 w-64 shadow-2xl z-50 p-6 flex flex-col gap-6 border-l border-white/10"
            style={{ background: 'var(--surface-high)' }}
          >
            <div className="mt-16 flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavigate(link.href)}
                  className="text-left text-lg font-medium text-white/70 hover:text-white transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {link.label}
                </button>
              ))}
              <hr className="border-white/10 my-4" />
              <div className="flex items-center justify-between text-white/80">
                 <span className="flex items-center gap-2 text-sm font-bold"><Activity size={16} color="#fd8b00" /> Heatmap Mode</span>
                 <button 
                    onClick={() => setIsHeatmapVisible(!isHeatmapVisible)}
                    className="w-12 h-6 rounded-full relative transition-colors duration-300"
                    style={{ background: isHeatmapVisible ? '#84adff' : 'rgba(255,255,255,0.1)' }}
                 >
                    <motion.div 
                       className="w-5 h-5 bg-white rounded-full absolute top-0.5"
                       animate={{ left: isHeatmapVisible ? "26px" : "2px" }}
                       transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                 </button>
              </div>
              <hr className="border-white/10 my-4" />
              <button
                onClick={() => handleNavigate('/login')}
                className="text-left text-lg font-bold text-white transition-colors hover:text-blue-400"
              >
                Log In
              </button>
              <button
                onClick={() => handleNavigate('/signup')}
                className="text-left text-lg font-bold text-[#84adff] transition-colors hover:text-blue-300"
              >
                Sign Up
              </button>
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
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
