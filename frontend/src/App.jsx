import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CursorFollower from './components/CursorFollower';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import { SkillProvider } from './context/SkillContext';
import BackToTop from './components/BackToTop';

export default function App() {
  return (
    <SkillProvider>
      <BrowserRouter>
        <div style={{ background: 'var(--surface)', minHeight: '100vh', overflowX: 'hidden' }}>
        <CursorFollower />
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <BackToTop />
        <Footer />
      </div>
      </BrowserRouter>
    </SkillProvider>
  );
}
