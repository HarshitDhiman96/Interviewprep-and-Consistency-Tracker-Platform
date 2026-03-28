import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef(null);
  const iconRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e) => {
    if (!buttonRef.current || !iconRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);

    gsap.to(buttonRef.current, { x: x * 0.4, y: y * 0.4, duration: 0.5, ease: 'power2.out' });
    gsap.to(iconRef.current, { x: x * 0.2, y: y * 0.2, duration: 0.5, ease: 'power2.out' });
  };

  const handleMouseLeave = () => {
    if (!buttonRef.current || !iconRef.current) return;
    gsap.to(buttonRef.current, { x: 0, y: 0, duration: 0.5, ease: 'power2.out' });
    gsap.to(iconRef.current, { x: 0, y: 0, duration: 0.5, ease: 'power2.out' });
  };

  const scrollToTop = () => {
    gsap.to(iconRef.current, {
      y: -200,
      x: 100,
      opacity: 0,
      rotate: 45,
      duration: 0.7,
      ease: 'power2.in',
      onComplete: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        gsap.to(iconRef.current, {
          y: 0,
          x: 0,
          opacity: 1,
          rotate: -45, // reset to default orientation
          duration: 0.1,
          delay: 0.5
        });
      }
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-8 right-8 z-[100]"
        >
          <button
            ref={buttonRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={scrollToTop}
            className="w-14 h-14 bg-slate-900 border border-indigo-500/30 text-[#84adff] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(132,173,255,0.2)] transition-colors hover:bg-slate-800"
          >
            <svg
              ref={iconRef}
              className="w-6 h-6 transform -rotate-45"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
