import React, { useRef } from 'react';
import gsap from 'gsap';
import Magnet from './Magnet';

export default function ReturnToTop() {
  const arrowRef = useRef(null);

  const scrollToTop = () => {
    // Scroll animation
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Arrow "airplane" animation using GSAP
    if (arrowRef.current) {
      gsap.to(arrowRef.current, {
        y: -150,
        x: 100,
        opacity: 0,
        rotate: 45,
        duration: 0.6,
        ease: 'power2.in',
        onComplete: () => {
          gsap.to(arrowRef.current, {
            y: 0,
            x: 0,
            opacity: 1,
            rotate: 0, 
            duration: 0.2,
            delay: 0.2
          });
        }
      });
    }
  };

  // Hover animation
  const handleMouseEnter = () => {
    if (arrowRef.current) {
      gsap.to(arrowRef.current, { y: -5, duration: 0.2, ease: 'power1.out' });
    }
  };

  const handleMouseLeave = () => {
    if (arrowRef.current) {
      gsap.to(arrowRef.current, { y: 0, duration: 0.2, ease: 'power1.in' });
    }
  };

  return (
    <Magnet>
      <button 
        onClick={scrollToTop}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative flex items-center justify-center w-[120px] h-[120px] rounded-full bg-transparent group overflow-hidden cursor-pointer"
        style={{ border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
        
        {/* Curved Text SVG */}
        <svg className="absolute inset-0 w-full h-full group-hover:animate-[spin_4s_linear_infinite] transition-transform duration-700" viewBox="0 0 100 100">
          <path
            id="textPath"
            d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
            fill="transparent"
          />
          <text 
            fill="rgba(255,255,255,0.6)" 
            fontSize="10.5" 
            letterSpacing="4" 
            style={{ fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', fontWeight: 600 }}
          >
            <textPath href="#textPath" startOffset="0%">
              RETURN TO TOP • RETURN TO TOP • 
            </textPath>
          </text>
        </svg>

        {/* Center Arrow */}
        <div ref={arrowRef} className="z-10 relative pointer-events-none group-hover:text-[#84adff] transition-colors">
            <svg 
              className="w-7 h-7 transform -rotate-45"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
        </div>
      </button>
    </Magnet>
  );
}
