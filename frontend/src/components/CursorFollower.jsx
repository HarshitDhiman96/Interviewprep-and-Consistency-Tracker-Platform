import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CursorFollower() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation with slower speed than cursor
  const smoothX = useSpring(mouseX, {
    stiffness: 100,
    damping: 30,
    mass: 1.5,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 100,
    damping: 30,
    mass: 1.5,
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed pointer-events-none z-[9999]"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      {/* Glowing Circular Ball */}
      <div
        className="relative"
        style={{
          width: '20px',
          height: '20px',
        }}
      >
        {/* Core Circle */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, rgba(37, 99, 235, 0.4) 50%, transparent 70%)',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.3)',
          }}
        />
        
        {/* Outer Glow Ring */}
        <div
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            border: '1px solid rgba(59, 130, 246, 0.3)',
            transform: 'scale(1.5)',
            opacity: 0.5,
          }}
        />
      </div>
    </motion.div>
  );
}
