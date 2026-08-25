import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Globe } from 'lucide-react';

// Inline LinkedIn SVG — lucide-react version may not export Linkedin
const LinkedinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
import logoimg from "../assets/custom_logo.png";
import Magnet from './Magnet';
import ReturnToTop from './ReturnToTop';

const links = {
  Product: ['Features', 'Dashboard', 'Roadmap', 'Analytics'],
  Support: ['Docs', 'About', 'Contact', 'Twitter'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Status'],
};

export default function Footer() {
  return (
    <footer
      className="w-full px-4 pt-14 pb-8 sm:px-6 sm:pt-16 bg-zinc-100 border-t border-zinc-200 dark:bg-[#050505] dark:border-white/5 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2
            className="font-black leading-none select-none mb-4 flex items-center gap-4"
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: 'clamp(3.5rem, 12vw, 8rem)',
              letterSpacing: '-0.04em',
            }}
          >
            <img src={logoimg} alt="APEX Logo" className="w-[1em] h-[1em] object-contain inline-block drop-shadow-[0_0_15px_rgba(132,173,255,0.3)] dark:mix-blend-screen dark:invert-0 mix-blend-multiply invert" />
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-500">APEX</span>
          </h2>
          <p
            className="max-w-sm text-sm text-zinc-700"
            style={{ fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}
          >
            Precision tools designed for those who demand the absolute maximum from their journey.
          </p>
        </motion.div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <p className="text-xs uppercase tracking-widest mb-6 font-bold text-zinc-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                {category}
              </p>
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm transition-all duration-200 text-zinc-700 hover:text-black hover:translate-x-1 inline-block dark:text-zinc-400 dark:hover:text-white"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social Icons Section */}
          <div>
            <p className="text-xs uppercase tracking-widest mb-6 font-bold text-zinc-700" style={{ fontFamily: 'Inter, sans-serif' }}>
              Connect
            </p>
            <div className="flex flex-col gap-4">
              <Magnet>
                <a
                  href="https://github.com/HarshitDhiman96"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-fit items-center gap-3 text-sm transition-colors duration-200 text-zinc-700 hover:text-black dark:text-zinc-400 dark:hover:text-white"
                >
                  <Globe size={16} />
                  GitHub
                </a>
              </Magnet>
              <Magnet>
                <a
                  href="https://www.linkedin.com/in/harshit-dhiman-135b25287"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                  className="flex w-fit items-center gap-3 text-sm transition-colors duration-200 text-zinc-700 hover:text-black dark:text-zinc-400 dark:hover:text-white"
                >
                  <LinkedinIcon />
                  LinkedIn
                </a>
              </Magnet>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Updated for Light Mode */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-zinc-200 dark:border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center">
              <Zap size={14} className="text-blue-600" />
            </div>
            <span className="text-xs font-medium tracking-tighter text-zinc-700" style={{ fontFamily: 'Inter, sans-serif' }}>
              APEX
            </span>
          </div>

          <p className="text-[10px] uppercase tracking-widest text-zinc-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            © {new Date().getFullYear()} APEX. All rights reserved.
          </p>

          {/* Replaces the standard bottom bar gap on larger screens to house the Return To Top */}
          <div className="md:ml-auto">
             <ReturnToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}
