import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

// List of motivational quotes for APEX consistency
const MOTIVATIONAL_QUOTES = [
  "Consistency is what transforms average into excellence.",
  "Your future self will thank you for the work you do today.",
  "One step, one session, one streak at a time.",
  "Streaks are built day by day. Show up today!",
  "Focus on the process, and the results will take care of themselves.",
  "Success is the sum of small efforts repeated day in and day out."
];

export default function InteractiveMascot({
  isEmailFocused = false,
  isPasswordFocused = false,
  isTyping = false,
  status = "idle", // 'idle' | 'loading' | 'success' | 'error'
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Quote rotation state
  const [quoteIndex, setQuoteIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Blinking loop for eyes (ticks every 4 seconds)
  const [isBlinking, setIsBlinking] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Mouse tracking springs for pupils
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 220, mass: 0.4 };
  const pupilX = useSpring(mouseX, springConfig);
  const pupilY = useSpring(mouseY, springConfig);

  // Track mouse coordinates relative to the face center
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current || isPasswordFocused || status === "error") return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2 - 20; // adjust for character head height

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 200;
      const strength = Math.min(distance / maxDistance, 1);
      
      // Chibi anime eyes pupil translation limit: max 6px horizontal, 4px vertical
      const maxOffsetH = 6;
      const maxOffsetV = 4;
      const angle = Math.atan2(dy, dx);
      
      mouseX.set(Math.cos(angle) * strength * maxOffsetH);
      mouseY.set(Math.sin(angle) * strength * maxOffsetV);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isPasswordFocused, status, mouseX, mouseY]);

  // Handle focus effects
  useEffect(() => {
    if (isEmailFocused && !isPasswordFocused) {
      // Look down-left towards input fields
      mouseX.set(-4);
      mouseY.set(3);
    } else if (!isEmailFocused && !isPasswordFocused) {
      // Center
      mouseX.set(0);
      mouseY.set(0);
    }
  }, [isEmailFocused, isPasswordFocused, mouseX, mouseY]);

  // Floating background particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles = [];
    const particleCount = 30;

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = -Math.random() * 0.5 - 0.15;
        this.opacity = Math.random() * 0.4 + 0.1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.y < 0 || this.x < 0 || this.x > width) {
          this.reset();
          this.y = height;
        }
      }

      draw() {
        ctx.fillStyle = `rgba(132, 173, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const characterShake = {
    idle: { scale: 1 },
    error: {
      x: [0, -8, 8, -8, 8, -4, 4, 0],
      transition: { duration: 0.5 }
    },
    success: {
      scale: [1, 1.12, 0.96, 1.04, 1],
      transition: { duration: 0.6 }
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full flex flex-col items-center justify-center select-none"
    >
      {/* Background Particles Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-[320px] pointer-events-none opacity-50" />

      {/* Glow Backdrop */}
      <div className="absolute w-[240px] h-[240px] rounded-full filter blur-[70px] opacity-25 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-purple-950 pointer-events-none top-8" />

      {/* SVG Container holding the Chibi anime character */}
      <motion.div
        variants={characterShake}
        animate={status === "error" ? "error" : status === "success" ? "success" : "idle"}
        className="relative w-[280px] h-[280px] flex items-center justify-center"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_4px_20px_rgba(59,130,246,0.15)]">
          <defs>
            <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#312E81" /> {/* dark indigo */}
              <stop offset="50%" stopColor="#1E1B4B" />
              <stop offset="100%" stopColor="#4338CA" /> {/* royal purple */}
            </linearGradient>
            <linearGradient id="headphoneGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <radialGradient id="cheekBlush" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(244, 63, 94, 0.45)" />
              <stop offset="100%" stopColor="rgba(244, 63, 94, 0)" />
            </radialGradient>
            <linearGradient id="eyeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
            <linearGradient id="cyberLight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#00D8FF" />
            </linearGradient>
          </defs>

          {/* 1. Back hair (behind head) */}
          <path
            d="M 50 110 C 35 150 40 180 55 180 C 65 180 75 160 75 130 Z"
            fill="url(#hairGrad)"
          />
          <path
            d="M 150 110 C 165 150 160 180 145 180 C 135 180 125 160 125 130 Z"
            fill="url(#hairGrad)"
          />

          {/* 2. Cybernetic Headphone Arch / Band */}
          <path
            d="M 45 105 A 62 62 0 0 1 155 105"
            fill="none"
            stroke="url(#headphoneGrad)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Cyber light accents on headphone band */}
          <path
            d="M 65 65 A 50 50 0 0 1 135 65"
            fill="none"
            stroke="url(#cyberLight)"
            strokeWidth="2"
            strokeDasharray="8 6"
            className={status === "loading" ? "animate-pulse" : ""}
          />

          {/* 3. Chibi Head / Face outline */}
          <rect x="52" y="75" width="96" height="80" rx="36" fill="#FFF2E6" />
          
          {/* Cute neck */}
          <rect x="94" y="150" width="12" height="15" fill="#FFE5CC" rx="4" />
          
          {/* Cyber collar/shoulder visual at bottom */}
          <path
            d="M 70 162 C 70 162 82 170 100 170 C 118 170 130 162 130 162 L 138 180 L 62 180 Z"
            fill="#1E293B"
          />
          {/* Neon collar light */}
          <path
            d="M 76 163 Q 100 171 124 163"
            fill="none"
            stroke="url(#cyberLight)"
            strokeWidth="2.5"
          />

          {/* 4. Cyber Headphone Ear Pads */}
          <rect x="36" y="90" width="18" height="34" rx="9" fill="#1E293B" stroke="url(#headphoneGrad)" strokeWidth="2" />
          <rect x="146" y="90" width="18" height="34" rx="9" fill="#1E293B" stroke="url(#headphoneGrad)" strokeWidth="2" />
          {/* Glowing central node on headphone */}
          <circle cx="45" cy="107" r="4" fill="#00D8FF" className="animate-ping" style={{ animationDuration: "2.5s" }} />
          <circle cx="45" cy="107" r="3.5" fill="#00D8FF" />
          <circle cx="155" cy="107" r="4" fill="#00D8FF" className="animate-ping" style={{ animationDuration: "2.5s" }} />
          <circle cx="155" cy="107" r="3.5" fill="#00D8FF" />

          {/* 5. Blushing cheeks */}
          <circle cx="68" cy="128" r="10" fill="url(#cheekBlush)" />
          <circle cx="132" cy="128" r="10" fill="url(#cheekBlush)" />

          {/* 6. Expressive Anime Eyes */}
          <g>
            {/* --- PASSWORD FOCUS STATE: Eyes shut tight '>_<' --- */}
            {isPasswordFocused ? (
              <g stroke="#1E1B4B" strokeWidth="3" strokeLinecap="round" fill="none">
                {/* Left Shut Eye */}
                <path d="M 60 115 L 72 121 L 60 127" />
                {/* Right Shut Eye */}
                <path d="M 140 115 L 128 121 L 140 127" />
              </g>
            ) : status === "error" ? (
              /* --- ERROR STATE: Dizzy spiral eyes '@_@' --- */
              <g stroke="#EF4444" strokeWidth="2.5" fill="none">
                {/* Left Spiral */}
                <path d="M 68 121 C 60 121, 60 113, 68 113 C 74 113, 74 125, 66 125 C 58 125, 58 111, 70 111" />
                {/* Right Spiral */}
                <path d="M 132 121 C 124 121, 124 113, 132 113 C 138 113, 138 125, 130 125 C 122 125, 122 111, 134 111" />
              </g>
            ) : status === "success" ? (
              /* --- SUCCESS STATE: Happy curved smiling eyes '^ _ ^' --- */
              <g stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" fill="none">
                <path d="M 58 124 Q 68 112 78 124" />
                <path d="M 122 124 Q 132 112 142 124" />
              </g>
            ) : (
              /* --- NORMAL STATE: Cursor Tracking Anime Eyes --- */
              <>
                {/* Top eyelashes curves */}
                <path d="M 55 116 C 63 109, 73 109, 81 116" fill="none" stroke="#1E1B4B" strokeWidth="3" strokeLinecap="round" />
                <path d="M 119 116 C 127 109, 137 109, 145 116" fill="none" stroke="#1E1B4B" strokeWidth="3" strokeLinecap="round" />

                {/* Left Eye Ball Window Mask */}
                <g>
                  {/* Left Iris */}
                  <rect x="59" y="113" width="19" height="24" rx="9.5" fill="url(#eyeGrad)" />
                  {/* Left Pupil (mouse tracking offset) */}
                  <motion.g style={{ x: pupilX, y: pupilY }}>
                    <ellipse
                      cx="68.5"
                      cy="125"
                      rx="6"
                      ry="8"
                      fill="#0C0A3E"
                    />
                    
                    {/* Glowing highlight in loading mode */}
                    {status === "loading" ? (
                      <polygon points="68.5,121 70.5,125 73.5,125 71,127 72,130 68.5,128 65,130 66,127 63.5,125 66.5,125" fill="#60A5FA" />
                    ) : (
                      <>
                        {/* Primary specular highlight */}
                        <circle cx="65.5" cy="120" r="3" fill="#FFFFFF" />
                        {/* Secondary tiny sparkle */}
                        <circle cx="71.5" cy="128" r="1.5" fill="#FFFFFF" />
                      </>
                    )}
                  </motion.g>
                </g>

                {/* Right Eye Ball Window Mask */}
                <g>
                  {/* Right Iris */}
                  <rect x="122" y="113" width="19" height="24" rx="9.5" fill="url(#eyeGrad)" />
                  {/* Right Pupil (mouse tracking offset) */}
                  <motion.g style={{ x: pupilX, y: pupilY }}>
                    <ellipse
                      cx="131.5"
                      cy="125"
                      rx="6"
                      ry="8"
                      fill="#0C0A3E"
                    />
                    {status === "loading" ? (
                      <polygon points="131.5,121 133.5,125 136.5,125 134,127 135,130 131.5,128 128,130 129,127 126.5,125 129.5,125" fill="#60A5FA" />
                    ) : (
                      <>
                        {/* Primary specular highlight */}
                        <circle cx="128.5" cy="120" r="3" fill="#FFFFFF" />
                        {/* Secondary tiny sparkle */}
                        <circle cx="134.5" cy="128" r="1.5" fill="#FFFFFF" />
                      </>
                    )}
                  </motion.g>
                </g>

                {/* Blink overlay: slides over eyes dynamically */}
                <AnimatePresence>
                  {isBlinking && (
                    <motion.rect
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      exit={{ scaleY: 0 }}
                      x="54"
                      y="110"
                      width="92"
                      height="20"
                      fill="#FFF2E6"
                      style={{ transformOrigin: "top center" }}
                      transition={{ duration: 0.1 }}
                    />
                  )}
                </AnimatePresence>
              </>
            )}
          </g>

          {/* 7. Cute Mouth */}
          <g>
            {isPasswordFocused ? (
              /* Surprised 'o' mouth when covering eyes */
              <circle cx="100" cy="138" r="3.5" fill="#4B1220" />
            ) : status === "error" ? (
              /* Sad curved mouth */
              <path d="M 96 141 Q 100 136 104 141" fill="none" stroke="#1E1B4B" strokeWidth="2" strokeLinecap="round" />
            ) : status === "success" ? (
              /* Wide open happy mouth */
              <path d="M 94 135 Q 100 146 106 135 Z" fill="#E11D48" stroke="#1E1B4B" strokeWidth="1.5" />
            ) : (
              /* Gentle smiling curve */
              <path d="M 96 137 Q 100 141 104 137" fill="none" stroke="#1E1B4B" strokeWidth="2" strokeLinecap="round" />
            )}
          </g>

          {/* 8. Front Bangs / Hair details */}
          <path
            d="M 50 82 C 60 70 90 70 100 85 C 110 70 140 70 150 82 L 154 98 C 130 92 120 98 116 106 C 110 92 88 92 84 106 C 80 98 70 92 46 98 Z"
            fill="url(#hairGrad)"
          />
          {/* Side hair strands framing face */}
          <path d="M 52 95 C 48 120 48 135 52 144" fill="none" stroke="url(#hairGrad)" strokeWidth="4" strokeLinecap="round" />
          <path d="M 148 95 C 152 120 152 135 148 144" fill="none" stroke="url(#hairGrad)" strokeWidth="4" strokeLinecap="round" />

          {/* 9. Hands covering eyes on password focus */}
          <g>
            {/* Left Hand */}
            <motion.circle
              cx="64"
              cy="185"
              r="10"
              fill="#FFF2E6"
              stroke="#E5E7EB"
              strokeWidth="1"
              animate={isPasswordFocused ? { y: -62, x: 2 } : { y: 0, x: 0 }}
              transition={{ type: "spring", stiffness: 140, damping: 15 }}
            />
            {/* Right Hand */}
            <motion.circle
              cx="136"
              cy="185"
              r="10"
              fill="#FFF2E6"
              stroke="#E5E7EB"
              strokeWidth="1"
              animate={isPasswordFocused ? { y: -62, x: -2 } : { y: 0, x: 0 }}
              transition={{ type: "spring", stiffness: 140, damping: 15 }}
            />
          </g>
        </svg>

        {/* Small floating HUD tag for high-tech look */}
        <div className="absolute top-[8%] left-[8%] text-[8px] font-mono tracking-widest text-blue-500/40 uppercase pointer-events-none">
          SYS_SECURE: {isPasswordFocused ? "HIGH" : "STABLE"}
        </div>
      </motion.div>

      {/* Motivational Quotes Widget underneath character */}
      <div className="w-full max-w-[280px] min-h-[50px] mt-2 text-center relative px-4 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={quoteIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="text-xs text-zinc-500 dark:text-zinc-400 italic font-medium leading-relaxed"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            "{MOTIVATIONAL_QUOTES[quoteIndex]}"
          </motion.p>
        </AnimatePresence>
      </div>

    </div>
  );
}
