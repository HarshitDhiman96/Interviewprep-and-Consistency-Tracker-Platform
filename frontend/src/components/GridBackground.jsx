import { useEffect, useState } from 'react';

/**
 * Decorative, app-wide grid. It never receives pointer events, so it cannot
 * interfere with buttons, form fields, or any other interactive UI.
 */
export default function GridBackground() {
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    let frameId;

    const updatePosition = () => {
      frameId = undefined;
      setScrollOffset(window.scrollY * 0.12);
    };

    const onScroll = () => {
      if (!frameId) frameId = window.requestAnimationFrame(updatePosition);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div
      className="site-grid-background"
      aria-hidden="true"
      style={{ '--grid-scroll-offset': `${scrollOffset}px` }}
    />
  );
}
