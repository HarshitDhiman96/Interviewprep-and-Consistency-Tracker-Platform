import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import FAQ from '../components/FAQ';
import FutureEnhancements from '../components/FutureEnhancements';
import CTA from '../components/CTA';

export default function Landing() {
  return (
    <>
      <Hero />
      <Features />
      <FutureEnhancements />
      <FAQ />
      <CTA />
    </>
  );
}
