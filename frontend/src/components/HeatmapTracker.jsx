import React, { useEffect, useRef } from 'react';
import { saveHeatmapClicks } from '../services/analyticsService';

const HeatmapTracker = () => {
  const clickBuffer = useRef([]);

  useEffect(() => {
    let timeout;
    const trackClick = (e) => {
      // Use pageX/pageY for absolute document coordinates
      clickBuffer.current.push({
        x: e.pageX,
        y: e.pageY,
        route: window.location.pathname,
        elementId: e.target.id || e.target.tagName,
        resolution: `${window.innerWidth}x${window.innerHeight}`
      });

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (clickBuffer.current.length > 0) {
          const payload = [...clickBuffer.current];
          clickBuffer.current = [];
          
          saveHeatmapClicks(payload).catch(err => console.error('Failed to log heatmap clicks', err));
        }
      }, 1000);
    };

    document.addEventListener('click', trackClick);
    return () => document.removeEventListener('click', trackClick);
  }, []);

  return null; // Invisible component
};

export default HeatmapTracker;
