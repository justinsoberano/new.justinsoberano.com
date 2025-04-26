import { useEffect, useRef, useState } from 'react';

export function useGridMetrics() {
  const preRef = useRef(null);
  const [metrics, setMetrics] = useState({ rows: 0, cols: 0 });

  useEffect(() => {
    const measure = () => {
      const el = preRef.current;
      if (!el) return;
      const span = document.createElement('span');
      span.innerText = 'M';
      Object.assign(span.style, {
        fontFamily: 'monospace',
        fontSize: getComputedStyle(el).fontSize,
        lineHeight: getComputedStyle(el).lineHeight,
        position: 'absolute',
        visibility: 'hidden'
      });
      el.appendChild(span);
      const { width: cw, height: ch } = span.getBoundingClientRect();
      el.removeChild(span);

      const cols = Math.ceil(window.innerWidth / cw);
      const rows = Math.ceil(window.innerHeight / ch);
      setMetrics({ rows, cols });
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return { ...metrics, preRef };
}