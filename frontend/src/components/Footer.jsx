import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Globe, MessageCircle } from 'lucide-react';
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
      // Changed to hex for testing; replace with var(--surface) once CSS is set
      style={{ background: '#050505', borderTop: '1px solid rgba(255,255,255,0.04)' }}
      className="px-6 pt-16 pb-8 w-full"
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
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(132,173,255,0.4) 50%, rgba(255,255,255,0.1) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1,
              whiteSpace: 'nowrap'
            }}
          >
            <img src={logoimg} alt="APEX Logo" className="w-[1em] h-[1em] object-contain inline-block drop-shadow-[0_0_15px_rgba(132,173,255,0.3)]" />
            APEX
          </h2>
          <p
            className="max-w-sm text-sm"
            style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}
          >
            Precision tools designed for those who demand the absolute maximum from their journey.
          </p>
        </motion.div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <p className="text-xs uppercase tracking-widest mb-6 font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {category}
              </p>
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm transition-all duration-200 hover:text-white hover:translate-x-1 inline-block"
                      style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Inter, sans-serif' }}
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
            <p className="text-xs uppercase tracking-widest mb-6 font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Connect
            </p>
            <div className="flex flex-col gap-4">
              {[
                { Icon: Globe, label: 'GitHub' },
                { Icon: MessageCircle, label: 'Twitter' }
                // { Icon: Linkedin, label: 'LinkedIn' },
              ].map(({ Icon, label }) => (
                <Magnet key={label}>
                  <a
                    href="#"
                    className="flex w-fit items-center gap-3 text-sm transition-colors duration-200 hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    <Icon size={16} />
                    {label}
                  </a>
                </Magnet>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center">
              <Zap size={14} className="text-blue-400" />
            </div>
            <span className="text-xs font-medium tracking-tighter" style={{ color: 'rgba(255,255,255,0.5)' }}>
              APEX
            </span>
          </div>

          <p className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>
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