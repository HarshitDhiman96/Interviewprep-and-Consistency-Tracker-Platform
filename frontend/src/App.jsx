import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './index.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CursorFollower from './components/CursorFollower';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import { SkillProvider, useSkillContext } from './context/SkillContext';
import { AuthProvider } from './context/AuthContext';
import BackToTop from './components/BackToTop';
import HeatmapTracker from './components/HeatmapTracker';
import HeatmapCanvas from './components/HeatmapCanvas';
import InconsistencyReasonPopup from './components/InconsistencyReasonPopup';

// ── Scroll to top on every route change ───────────────────────────
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

const HeatmapWrapper = () => {
  const { isHeatmapVisible } = useSkillContext();
  return (
    <>
      <HeatmapTracker />
      {isHeatmapVisible && <HeatmapCanvas />}
    </>
  );
};

// Routes that should NOT show the landing Navbar/Footer
const DASHBOARD_ROUTES = ['/dashboard', '/profile', '/onboarding'];

function AppLayout() {
  const location = useLocation();
  const isDashboardRoute = DASHBOARD_ROUTES.some(r => location.pathname.startsWith(r));

  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh', overflowX: 'hidden' }}>
      <ScrollToTop />
      <CursorFollower />
      <HeatmapWrapper />
      {!isDashboardRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      {/* Toast and Global Overlays */}
      <InconsistencyReasonPopup />
      <BackToTop />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SkillProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </SkillProvider>
    </AuthProvider>
  );
}
