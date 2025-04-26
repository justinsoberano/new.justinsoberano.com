import { useState, useEffect } from 'react';

const DEFAULT_BREAKPOINT = 768;

export function IsMobile(breakpoint = DEFAULT_BREAKPOINT) {
  const [isMobile, setIsMobile] = useState(() =>
    /Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent) ||
    window.innerWidth <= breakpoint
  );

  useEffect(() => {
    const onResize = () => {
      setIsMobile(
        /Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent) ||
        window.innerWidth <= breakpoint
      );
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);

  return isMobile;
}
