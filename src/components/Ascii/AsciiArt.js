import React, { useContext } from 'react';
import GridBox from '../Grid/GridBox';
import { GridContext } from '../../context/GridContext';

export default function AsciiArt({ art, rowFrac = 0.5, colFrac }) {
  const { cols } = useContext(GridContext);
  const widthCols = Math.max(...art.map(line => line.length));
  const heightRows = art.length;
  const fallbackColFrac = (1 - (widthCols / cols)) / 2;
  const computedColFrac = typeof colFrac === 'number' ? colFrac : fallbackColFrac;

  return (
    <GridBox
      rowFrac={rowFrac}
      colFrac={computedColFrac}
      widthCols={widthCols}
      heightRows={heightRows}
      padding={0.05}
    >
      {art.map(line => line.padEnd(widthCols)).join('\n')}
    </GridBox>
  );
}
