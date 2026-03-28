import React from "react";
import { motion } from "framer-motion";

const DrawOutlineButton = ({ children, className = "", onClick, ...rest }) => {
  return (
    <button
      {...rest}
      onClick={onClick}
      className={`group relative px-6 py-3.5 font-bold transition-colors duration-[400ms] hover:text-white ${className}`}
      style={{
        fontFamily: 'Inter, sans-serif'
      }}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>

      {/* TOP */}
      <span className="absolute left-0 top-0 h-[2px] w-0 transition-all duration-200 group-hover:w-full" style={{ background: 'var(--primary)' }} />

      {/* RIGHT */}
      <span className="absolute right-0 top-0 h-0 w-[2px] transition-all delay-100 duration-200 group-hover:h-full" style={{ background: 'var(--primary)' }} />

      {/* BOTTOM */}
      <span className="absolute bottom-0 right-0 h-[2px] w-0 transition-all delay-200 duration-200 group-hover:w-full" style={{ background: 'var(--primary)' }} />

      {/* LEFT */}
      <span className="absolute bottom-0 left-0 h-0 w-[2px] transition-all delay-300 duration-200 group-hover:h-full" style={{ background: 'var(--primary)' }} />
      
      {/* Background fill on hover (optional) */}
      <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </button>
  );
};

export default DrawOutlineButton;
