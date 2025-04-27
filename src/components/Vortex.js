import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { lyrics_one, lyrics_two, lyrics_three, lyrics_one_mobile, lyrics_two_mobile, lyrics_three_mobile } from '../constants/ascii';
import { preStyle } from '../styles/GlobalStyles';
import { IsMobile } from '../hooks/useUAAgent';
import { useGridMetrics } from '../hooks/useGridMetrics';

const CONFIG = {
  fps: 60,
  hXFactor: 0.15,
  hYFactor: 0.08,
  hXFactor_mobile: 0.3,
  hYFactor_mobile: 0.16,
  swirl: { base: 1.5, decay: 3, speed: 1, speed_mobile: 0.4 },
  lyricSections: [
    { name: 'lyrics_one', percent: 0.25 },
    { name: 'lyrics_two', percent: 0.5 },
    { name: 'lyrics_three', percent: 0.25 }
  ],
  levels: 50
};

function initCellData(rows, cols, isMobile) {
  const hX = isMobile ? CONFIG.hXFactor_mobile : CONFIG.hXFactor;
  const hY = isMobile ? CONFIG.hYFactor_mobile : CONFIG.hYFactor;
  const cells = [];
  const buckets = new Set();
  const cx = cols / 2, cy = rows / 2;
  const invHX = 1 / (cols * hX);
  const invHY = 1 / (rows * hY);
  const quant = CONFIG.levels;
  const decay = CONFIG.swirl.decay;

  for (let i = 0; i < rows * cols; i++) {
    const y = Math.floor(i / cols), x = i - y * cols;
    const dx = x - cx, dy = y - cy;
    const rNorm = Math.hypot(dx * invHX, dy * invHY);
    const theta = Math.atan2(dy * invHY, dx * invHX);
    const bucket = Math.round(rNorm * quant);
    buckets.add(bucket);
    cells.push({
      bucket,
      cosBase: Math.cos(theta),
      sinBase: Math.sin(theta),
      rNorm,
      decayTerm: Math.exp(-decay * rNorm)
    });
  }

  const bucketInfo = Array.from(buckets).map(b => ({
    bucket: b,
    swirlTerm: Math.exp(-b / quant)
  }));

  return { cells, bucketInfo };
}

function initSrc(rows, cols, isMobile) {
  const sections = CONFIG.lyricSections.map(sec => {
    const pool = {
      lyrics_one: isMobile ? lyrics_one_mobile : lyrics_one,
      lyrics_two: isMobile ? lyrics_two_mobile : lyrics_two,
      lyrics_three: isMobile ? lyrics_three_mobile : lyrics_three
    }[sec.name] || [];
    return { pool, percent: sec.percent };
  });

  let acc = 0;
  const bounds = sections.map(sec => {
    const start = Math.floor(acc * rows);
    acc += sec.percent;
    return { ...sec, start, end: Math.floor(acc * rows) };
  });

  return Array.from({ length: rows }, (_, r) => {
    const b = bounds.find(b => r >= b.start && r < b.end) || bounds[bounds.length - 1];
    const line = b.pool[(r - b.start) % b.pool.length] || '';
    return Array.from({ length: cols }, (_, c) => (c < line.length ? line[c] : ' '));
  });
}

export default function Vortex() {
  const { rows, cols, preRef } = useGridMetrics();
  const isMobile = IsMobile();

  const { cells, bucketInfo } = useMemo(
    () => initCellData(rows, cols, isMobile),
    [rows, cols, isMobile]
  );
  const srcGrid = useMemo(
    () => initSrc(rows, cols, isMobile),
    [rows, cols, isMobile]
  );

  const bufferRef = useRef([]);
  const rowLinesRef = useRef([]);
  const tRef = useRef(0);
  const lastTsRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    bufferRef.current = new Array(rows * cols);
    rowLinesRef.current = new Array(rows);
  }, [rows, cols]);

  const animate = useCallback(ts => {
    if (!rows || !cols) {
      rafRef.current = requestAnimationFrame(animate);
      return;
    }
    if (!lastTsRef.current) lastTsRef.current = ts;
    const delta = ts - lastTsRef.current;
    const interval = 1000 / CONFIG.fps;
    if (delta < interval) {
      rafRef.current = requestAnimationFrame(animate);
      return;
    }
    lastTsRef.current = ts - (delta % interval);

    const { base, speed, speed_mobile } = CONFIG.swirl;

    const hX = isMobile ? CONFIG.hXFactor_mobile : CONFIG.hXFactor;
    const hY = isMobile ? CONFIG.hYFactor_mobile : CONFIG.hYFactor;
    const halfX = cols * hX;
    const halfY = rows * hY;

    const cosTerms = {};
    const sinTerms = {};
    bucketInfo.forEach(({ bucket, swirlTerm }) => {
      const decayTerm = cells.find(c => c.bucket === bucket).decayTerm;
      const term = base * decayTerm + tRef.current * (isMobile ? speed_mobile : speed) * swirlTerm;
      cosTerms[bucket] = Math.cos(term);
      sinTerms[bucket] = Math.sin(term);
    });

    const buf = bufferRef.current;

    cells.forEach((cell, i) => {
      const cT = cosTerms[cell.bucket];
      const sT = sinTerms[cell.bucket];
      const cosAng = cell.cosBase * cT - cell.sinBase * sT;
      const sinAng = cell.sinBase * cT + cell.cosBase * sT;
      let sx = Math.round(cosAng * cell.rNorm * halfX + cols / 2) % cols;
      let sy = Math.round(sinAng * cell.rNorm * halfY + rows / 2) % rows;
      if (sx < 0) sx += cols;
      if (sy < 0) sy += rows;
      buf[i] = srcGrid[sy][sx] || ' ';
    });

    const rowsArr = rowLinesRef.current;
    for (let r = 0; r < rows; r++) {
      const slice = buf.slice(r * cols, r * cols + cols);
      rowsArr[r] = slice.join('');
    }
    if (preRef.current) {
      preRef.current.textContent = rowsArr.join('\n');
    }

    tRef.current += 0.1;
    rafRef.current = requestAnimationFrame(animate);
  }, [rows, cols, cells, bucketInfo, srcGrid, preRef, isMobile]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [animate]);

  return <pre ref={preRef} style={preStyle} />;
}