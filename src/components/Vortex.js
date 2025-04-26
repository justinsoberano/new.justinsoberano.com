import React, { useEffect, useRef } from 'react';
import {
  randomSymbols,
  asciiJustin,
  asciiSoberano,
  lyrics_one,
  lyrics_two,
  lyrics_three,
  lyrics_one_mobile,
  lyrics_two_mobile,
  lyrics_three_mobile
} from '../constants/ascii';
import { preStyle } from '../styles/VortexStyles';
import { IsMobile } from '../utils/UAAgent';
import { useGridMetrics } from '../hooks/useGridMetrics';

//TODO: optimize mathhhh

const CONFIG = {
  fps: 60,
  fizzleDuration: 10,
  hXFactor: 0.15,
  hYFactor: 0.08,
  swirl: { base: 1.5, decay: 3, speed: 0.4 },
  lyricSections: [
    { name: 'lyrics_one', percent: 0.25 },
    { name: 'lyrics_two', percent: 0.5 },
    { name: 'lyrics_three', percent: 0.25 }
  ],
  levels: 50
};

function computeOverlay(rows, cols, isMobile) {
  const widthJ = Math.max(...asciiJustin.map(l => l.length));
  const widthS = Math.max(...asciiSoberano.map(l => l.length));

  let lines;
  if (isMobile || rows > cols) {
    const totalWidth = widthS;
    const offset = Math.round((totalWidth - widthJ) / 2);
    const centered = asciiJustin.map(line => ' '.repeat(offset) + line.padEnd(totalWidth - offset));
    const padded = asciiSoberano.map(line => line.padEnd(totalWidth));
    lines = [...centered, ...padded];
  } else {
    lines = asciiJustin.map((l, i) => l.padEnd(widthJ) + (asciiSoberano[i] || '').padEnd(widthS));
  }

  return { lines, artH: lines.length, artW: lines[0].length };
}

export default function Vortex() {
  const { rows, cols, preRef } = useGridMetrics();
  const srcRef = useRef([]);
  const overlayRef = useRef({ lines: [], artH: 0, artW: 0 });
  const cellDataRef = useRef([]);
  const bucketListRef = useRef([]);
  const tRef = useRef(0);
  const lastTimeRef = useRef(0);
  const rafRef = useRef(null);
  const isMobile = IsMobile();

  useEffect(() => {
    if (!rows || !cols) return;

    const sections = CONFIG.lyricSections.map(sec => {
      let pool;
      switch (sec.name) {
        case 'lyrics_one': pool = isMobile ? lyrics_one_mobile : lyrics_one; break;
        case 'lyrics_two': pool = isMobile ? lyrics_two_mobile : lyrics_two; break;
        case 'lyrics_three': pool = isMobile ? lyrics_three_mobile : lyrics_three; break;
        default: pool = [];
      }
      return { pool, percent: sec.percent };
    });
    let acc = 0;
    const boundaries = sections.map(sec => {
      const start = Math.floor(acc * rows);
      acc += sec.percent;
      return { ...sec, start, end: Math.floor(acc * rows) };
    });
    srcRef.current = Array.from({ length: rows }, (_, r) => {
      const b = boundaries.find(b => r >= b.start && r < b.end) || boundaries[boundaries.length - 1];
      const line = b.pool[(r - b.start) % b.pool.length] || '';
      return Array.from({ length: cols }, (_, c) => (c < line.length ? line[c] : ' '));
    });

    overlayRef.current = computeOverlay(rows, cols, isMobile);

    const cx = cols / 2;
    const cy = rows / 2;
    const invHX = 1 / (cols * CONFIG.hXFactor);
    const invHY = 1 / (rows * CONFIG.hYFactor);
    const quant = CONFIG.levels;
    const cells = [];
    const buckets = new Set();
    for (let i = 0; i < rows * cols; i++) {
      const y = Math.floor(i / cols);
      const x = i - y * cols;
      const dx = x - cx;
      const dy = y - cy;
      const rNorm = Math.hypot(dx * invHX, dy * invHY);
      const theta = Math.atan2(dy * invHY, dx * invHX);
      const bucket = Math.round(rNorm * quant);
      buckets.add(bucket);
      cells.push({ rNorm, bucket, cosTheta: Math.cos(theta), sinTheta: Math.sin(theta) });
    }
    cellDataRef.current = cells;
    bucketListRef.current = Array.from(buckets);
  }, [rows, cols, isMobile]);

  useEffect(() => {
    const animate = ts => {
      if (!rows || !cols) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      if (!lastTimeRef.current) lastTimeRef.current = ts;
      const delta = ts - lastTimeRef.current;
      const interval = 1000 / CONFIG.fps;
      if (delta < interval) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTimeRef.current = ts - (delta % interval);

      const { lines: overlayLines, artH, artW } = overlayRef.current;
      const src = srcRef.current;
      const t = tRef.current;
      const fizzle = Math.min(1, t / CONFIG.fizzleDuration);
      const applyingFizzle = fizzle < 1;

      const cosTerm = {};
      const sinTerm = {};
      const expDecay = CONFIG.swirl.decay;
      const { base, speed } = CONFIG.swirl;
      bucketListRef.current.forEach(bucket => {
        const rApprox = bucket / CONFIG.levels;
        const term = base * fizzle * Math.exp(-expDecay * rApprox) + t * speed * Math.exp(-rApprox);
        cosTerm[bucket] = Math.cos(term);
        sinTerm[bucket] = Math.sin(term);
      });

      const buffer = Array(rows * cols);
      const halfCols = cols * CONFIG.hXFactor;
      const halfRows = rows * CONFIG.hYFactor;
      const cellData = cellDataRef.current;
      for (let i = 0; i < cellData.length; i++) {
        const { rNorm, bucket, cosTheta, sinTheta } = cellData[i];
        const cT = cosTerm[bucket];
        const sT = sinTerm[bucket];
        const cosAng = cosTheta * cT - sinTheta * sT;
        const sinAng = sinTheta * cT + cosTheta * sT;
        const fx = cosAng * rNorm;
        const fy = sinAng * rNorm;
        let sx = Math.round(fx * halfCols + cols / 2) % cols;
        let sy = Math.round(fy * halfRows + rows / 2) % rows;
        if (sx < 0) sx += cols;
        if (sy < 0) sy += rows;
        buffer[i] = src[sy][sx] || ' ';
      }

      const startY = Math.floor(rows / 2 - artH / 2);
      const startX = Math.floor(cols / 2 - artW / 2);
      overlayLines.forEach((line, yi) => {
        const row = startY + yi;
        if (row < 0 || row >= rows) return;
        for (let xi = 0; xi < line.length; xi++) {
          const c = line[xi];
          if (!c) continue;
          const idx = row * cols + startX + xi;
          buffer[idx] = c !== ' ' && applyingFizzle && Math.random() < 1 - fizzle
            ? randomSymbols[(Math.random() * randomSymbols.length) | 0]
            : c;
        }
      });

      let frame = '';
      for (let r = 0; r < rows; r++) {
        const rowOffset = r * cols;
        frame += buffer.slice(rowOffset, rowOffset + cols).join('') + '\n';
      }
      preRef.current.textContent = frame;

      tRef.current = t + 0.1;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [rows, cols, preRef]);

  return <pre ref={preRef} style={preStyle} />;
}
