import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const HeatmapCanvas = () => {
  const canvasRef = useRef(null);
  const location = useLocation();
  const [clicks, setClicks] = useState([]);
  const [docHeight, setDocHeight] = useState(0);

  useEffect(() => {
    // Determine the absolute full scale of the page content
    const updateScale = () => {
      setDocHeight(document.documentElement.scrollHeight);
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    // Poll loosely in case dynamic content extends the page
    const interval = setInterval(updateScale, 2000);

    return () => {
      window.removeEventListener('resize', updateScale);
      clearInterval(interval);
    };
  }, [location.pathname]);

  useEffect(() => {
    // Fetch clicks for current page
    fetch(`/api/analytics/heatmap?route=${encodeURIComponent(location.pathname)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setClicks(data.data);
        }
      })
      .catch(err => console.error('Failed fetching heatmap', err));
  }, [location.pathname]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Explicitly size canvas to document scroll dimensions
    canvas.width = document.documentElement.scrollWidth;
    canvas.height = document.documentElement.scrollHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw glowing spots at exact absolute coordinates
    clicks.forEach(click => {
      const radius = 25;
      const gradient = ctx.createRadialGradient(click.x, click.y, 0, click.x, click.y, radius);
      // Bright cyber-neon heat colors
      gradient.addColorStop(0, 'rgba(253, 139, 0, 0.4)'); // Orange core
      gradient.addColorStop(0.5, 'rgba(132, 173, 255, 0.2)'); // Blue middle
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Fades cleanly
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(click.x, click.y, radius, 0, 2 * Math.PI);
      ctx.fill();
    });
  }, [clicks, docHeight]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: `${docHeight}px`,
        pointerEvents: 'none',
        zIndex: 99999
      }}
    />
  );
};

export default HeatmapCanvas;
