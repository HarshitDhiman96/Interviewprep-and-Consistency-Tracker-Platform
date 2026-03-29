import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, User, Settings, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileNav from './MobileNav';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Analytics', href: '#analytics' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    setProfileOpen(false);
    setTimeout(() => {
      navigate(path);
    }, 300);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setProfileOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const checkAuth = () => setIsAuthenticated(!!localStorage.getItem('token'));
    checkAuth();
    window.addEventListener('storage', checkAuth);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', checkAuth);
    };
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
            className="font-black text-sm tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400"
            style={{
              fontFamily: 'Manrope, sans-serif',
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
              className="text-sm font-medium transition-colors duration-200 text-zinc-900 hover:text-black dark:text-[rgba(255,255,255,0.55)] dark:hover:text-white"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3 ml-auto">
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleNavigate('/login')}
                className="btn-ghost text-sm px-4 py-2 border border-zinc-300 hover:border-zinc-400 dark:border-[rgba(73,72,71,0.3)]"
                style={{ fontSize: '0.8125rem' }}
              >
                Log In
              </motion.button>
            )}
            <div 
              className="relative hidden md:block" 
              onMouseEnter={() => setProfileOpen(true)}
              onMouseLeave={() => setProfileOpen(false)}
            >
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center w-9 h-9 rounded-full transition-colors bg-white border border-zinc-300 hover:bg-zinc-50 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10"
              >
                <User size={16} className="text-zinc-700 dark:text-white/70" />
              </motion.button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-10 right-0 w-52 rounded-xl shadow-lg shadow-black/5 overflow-hidden pointer-events-auto backdrop-blur-md bg-white border border-zinc-200 dark:border-white/10 dark:bg-[var(--surface-high)]"
                  >
                    <div className="p-3 border-b border-zinc-200 dark:border-white/5">
                      <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-white/50" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {isAuthenticated ? 'My Account' : 'Guest'}
                      </p>
                    </div>
                    <div className="flex flex-col py-1">
                      {isAuthenticated ? (
                        <>
                          <button 
                            onClick={() => handleNavigate('/profile')}
                            className="flex items-center gap-3 px-4 py-2 text-sm transition-colors w-full text-left text-zinc-800 hover:text-zinc-950 hover:bg-zinc-50 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/5"
                          >
                            <UserCircle size={15} />
                            View Profile
                          </button>
                          <button 
                            onClick={() => handleNavigate('/dashboard')}
                            className="flex items-center gap-3 px-4 py-2 text-sm transition-colors w-full text-left text-zinc-800 hover:text-zinc-950 hover:bg-zinc-50 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/5"
                          >
                            <Settings size={15} />
                            Dashboard
                          </button>
                          <button 
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2 text-sm transition-colors w-full text-left text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-500/10"
                          >
                            <Settings size={15} />
                            Log Out
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => handleNavigate('/login')}
                            className="flex items-center gap-3 px-4 py-2 text-sm transition-colors w-full text-left text-zinc-800 hover:text-zinc-950 hover:bg-zinc-50 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/5"
                          >
                            <UserCircle size={15} />
                            Log In
                          </button>
                          <button 
                            onClick={() => handleNavigate('/signup')}
                            className="flex items-center gap-3 px-4 py-2 text-sm transition-colors w-full text-left text-zinc-800 hover:text-zinc-950 hover:bg-zinc-50 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/5"
                          >
                            <Settings size={15} />
                            Sign Up
                          </button>
                        </>
                      )}
                    </div>
                    <div className="px-3 py-2 border-t mt-1 border-zinc-200 dark:border-white/5">
                      <ThemeToggle />
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
