import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, User, Settings, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileNav from './MobileNav';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Analytics', href: '#analytics' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    setProfileOpen(false);
    setTimeout(() => {
      navigate(path);
    }, 300);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4"
    >
      <nav
        className={`glass glass-hover flex items-center gap-8 px-6 py-3 rounded-full transition-all duration-500 ${scrolled ? 'shadow-lg shadow-black/30' : ''
          }`}
        style={{ maxWidth: '860px', width: '100%' }}
      >
        {/* Logo */}
        <a onClick={() => handleNavigate('/')} className="flex items-center gap-2 mr-4 shrink-0 group cursor-pointer">
          {/* Removed broken logoimg container here as requested */}
          
          {/* Brand Name */}
          <span
            className="font-black text-sm tracking-tighter"
            style={{
              fontFamily: 'Manrope, sans-serif',
              color: '#fff',
              background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            APEX
          </span>
        </a>

        {/* Links */}
        <div className="hidden md:flex items-center gap-6 flex-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium transition-colors duration-200 hover:text-white"
              style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Inter, sans-serif' }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3 ml-auto">
          <div className="hidden md:flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleNavigate('/login')}
              className="btn-ghost text-sm px-4 py-2"
              style={{ fontSize: '0.8125rem' }}
            >
              Log In
            </motion.button>
            <div 
              className="relative hidden md:block" 
              onMouseEnter={() => setProfileOpen(true)}
              onMouseLeave={() => setProfileOpen(false)}
            >
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <User size={16} className="text-white/70" />
              </motion.button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-10 right-0 w-48 rounded-xl shadow-xl overflow-hidden pointer-events-auto border border-white/10"
                    style={{ background: 'var(--surface-high)', backdropFilter: 'blur(12px)' }}
                  >
                    <div className="p-3 border-b border-white/5">
                      <p className="text-xs font-bold text-white/50 uppercase tracking-widest" style={{ fontFamily: 'Inter, sans-serif' }}>My Account</p>
                    </div>
                    <div className="flex flex-col py-1">
                      <button 
                        onClick={() => handleNavigate('/profile')}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors w-full text-left"
                      >
                        <UserCircle size={15} />
                        View Profile
                      </button>
                      <button 
                        onClick={() => handleNavigate('/settings')}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors w-full text-left"
                      >
                        <Settings size={15} />
                        Settings
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <MobileNav navLinks={navLinks} />
        </div>
      </nav>
    </motion.header>
  );
}
