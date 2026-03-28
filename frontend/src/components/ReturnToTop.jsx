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
      const tl = gsap.timeline();
      tl.to(arrowRef.current, {
        y: -40,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in'
      })
      .set(arrowRef.current, { y: 40 })
      .to(arrowRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
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
            width="28" 
            height="28" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="12" y1="19" x2="12" y2="5"></line>
            <polyline points="5 12 12 5 19 12"></polyline>
          </svg>
        </div>
      </button>
    </Magnet>
  );
}
