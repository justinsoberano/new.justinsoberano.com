import React, { useEffect, useState, useRef } from 'react';
import { randomSymbols, asciiJustin, asciiSoberano, sentences, sentences2 } from '../constants/ascii';
import { preStyle } from '../styles/VortexStyles';

function Vortex() {
  const preRef = useRef();
  const [grid, setGrid] = useState({ cols: 0, rows: 0 });
  const [frame, setFrame] = useState('');
  const sourceRef = useRef([]);
  const tRef = useRef(0);
  const rafRef = useRef();

  const fizzleDuration = 10.0;

  useEffect(() => {
    function updateGrid() {
      if (!preRef.current) return;
      const span = document.createElement('span');
      span.innerText = 'M';
      Object.assign(span.style, {
        fontFamily: 'monospace',
        fontSize: window.getComputedStyle(preRef.current).fontSize,
        lineHeight: window.getComputedStyle(preRef.current).lineHeight,
        position: 'absolute',
        visibility: 'hidden',
      });
      preRef.current.appendChild(span);
      const { width: cw, height: ch } = span.getBoundingClientRect();
      preRef.current.removeChild(span);

      const cols = Math.ceil(window.innerWidth / cw);
      const rows = Math.ceil(window.innerHeight / ch);
      setGrid({ cols, rows });

      const rows75 = Math.floor(rows * 0.75);

      const src = Array.from({ length: rows }, () => Array(cols).fill(' '));

      for (let r = 0; r < rows; r++) {
        const isBottom = r >= rows75;
        const pool = isBottom ? sentences2 : sentences;
        const idx = isBottom ? ((r - rows75) % pool.length) : (r % pool.length);
        const line = pool[idx];
        for (let c = 0; c < cols && c < line.length; c++) {
          src[r][c] = line[c];
        }
      }
      sourceRef.current = src;
    }

    updateGrid();
    window.addEventListener('resize', updateGrid);
    return () => {
      window.removeEventListener('resize', updateGrid);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const spacer = 0;

    const animate = () => {
      const { cols, rows } = grid;
      if (cols === 0 || rows === 0) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      const src = sourceRef.current;
      const lines = [];
      const cx = cols / 2;
      const cy = rows / 2;
      const hX = cols * 0.15;
      const hY = rows * 0.08;
      const t = tRef.current;

      const fizzleProgress = Math.min(1, t / fizzleDuration);

      let overlay;
      if (rows > cols) {
        overlay = [...asciiJustin, ...asciiSoberano];
      } else {
        const w1 = Math.max(...asciiJustin.map(l => l.length));
        const w2 = Math.max(...asciiSoberano.map(l => l.length));
        overlay = asciiJustin.map((line, i) => {
          const right = asciiSoberano[i] || ''.padEnd(w2, ' ');
          return line.padEnd(w1, ' ') + ' '.repeat(spacer) + right;
        });
      }
      const artH = overlay.length;
      const artW = Math.max(...overlay.map(l => l.length));
      const startRow = Math.floor(cy - artH / 2);
      const startCol = Math.floor(cx - artW / 2);

      for (let y = 0; y < rows; y++) {
        let rowStr = '';
        const dy = y - cy;
        for (let x = 0; x < cols; x++) {
          const dx = x - cx;
          const ex = dx / hX;
          const ey = dy / hY;
          const rNorm = Math.sqrt(ex*ex + ey*ey);
          const theta = Math.atan2(ey, ex);
          const falloff = Math.exp(-rNorm);
          const swirl = (1.5 * fizzleProgress)*Math.exp(-3*rNorm) + t*0.4*falloff;
          const newTheta = theta + swirl;
          const ex2 = rNorm * Math.cos(newTheta);
          const ey2 = rNorm * Math.sin(newTheta);
          let rx = ex2 * hX;
          let ry = ey2 * hY;
          const jAmp = 0.3 * (1 - Math.min(1,rNorm)) * (0.6 + 0.4 * Math.sin(t*0.3 + rNorm*2));
          rx += jAmp * (Math.random()-0.5);
          ry += jAmp * (Math.random()-0.5);
          const sx = ((Math.round(rx + cx) % cols) + cols) % cols;
          const sy = ((Math.round(ry + cy) % rows) + rows) % rows;
          rowStr += src[sy] && src[sy][sx] ? src[sy][sx] : ' ';
        }
        lines.push(rowStr);
      }

      for (let i = 0; i < artH; i++) {
        const rowIndex = startRow + i;
        if (rowIndex < 0 || rowIndex >= rows) continue;
        const arr = lines[rowIndex].split('');
        const artLine = overlay[i].padEnd(artW, ' ');
        for (let j = 0; j < artW; j++) {
          const colIndex = startCol + j;
          if (colIndex < 0 || colIndex >= cols) continue;
          const char = artLine[j];
          if (char !== ' ') {
            arr[colIndex] = fizzleProgress < 1
              ? (Math.random() < (1 - fizzleProgress)
                  ? randomSymbols[Math.floor(Math.random()*randomSymbols.length)]
                  : char)
              : char;
          }
        }
        lines[rowIndex] = arr.join('');
      }

      setFrame(lines.join('\n'));
      tRef.current += 0.1;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [grid]);

  return (
    <pre
      ref={preRef}
      style={preStyle}
    >
      {frame}
    </pre>
  );
}

export default Vortex; 