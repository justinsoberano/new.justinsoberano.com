import React, { useContext, useState, useEffect } from 'react';
import { GridContext } from '../../context/GridContext';
import AsciiArt from './AsciiArt';
import { asciiJustin, asciiSoberano, randomSymbols } from '../../constants/ascii';

export default function AsciiPair({ isMobile }) {
  const { cols } = useContext(GridContext);
  const { rows } = useContext(GridContext);

  const justinWidth = Math.max(...asciiJustin.map(l => l.length));
  const soberanoWidth = Math.max(...asciiSoberano.map(l => l.length));

  const [intensity, setIntensity] = useState(1);

  useEffect(() => {
    const duration = 1500;
    const intervalMs = 100;
    const start = Date.now();

    const iv = setInterval(() => {
      const elapsed = Date.now() - start;
      let t = Math.min(elapsed / duration, 1);

      const current = Math.pow(1 - t, 2);
      setIntensity(current);

      if (t === 1) clearInterval(iv);
    }, intervalMs);

    return () => clearInterval(iv);
  }, []);

  const J = applyScramble(asciiJustin, justinWidth, intensity);
  const S = applyScramble(asciiSoberano, soberanoWidth, intensity);

  const sRowFrac = 0.42;
  const jRowFrac = (sRowFrac * rows + asciiSoberano.length) / rows;
  
  if (isMobile) {
    return (
      <>
        <AsciiArt art={J} rowFrac={sRowFrac} />
        <AsciiArt art={S} rowFrac={jRowFrac} />
      </>
    );
  }

  const totalWidth = justinWidth + soberanoWidth;
  const startCol = Math.floor((cols - totalWidth) / 2);
  const jColFrac = startCol / cols;
  const sColFrac = (startCol + justinWidth) / cols;

  return (
    <>
      <AsciiArt art={J} rowFrac={0.47} colFrac={jColFrac} />
      <AsciiArt art={S} rowFrac={0.47} colFrac={sColFrac} />
    </>
  );
}

function applyScramble(art, width, intensity, skipFirstRows = 1) {
  return art.map((line, idx) => {
    if (idx < skipFirstRows) {
      return line.padEnd(width)
    }

    return line
      .padEnd(width)
      .split('')
      .map(ch => {
        if (ch === ' ') return ' '
        return Math.random() < intensity
          ? randomSymbols[Math.floor(Math.random() * randomSymbols.length)]
          : ch
      })
      .join('')
  })
}