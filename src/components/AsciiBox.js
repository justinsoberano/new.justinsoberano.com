import React, { useContext } from 'react';
import GridBox from './GridBox';
import { GridContext } from '../context/GridContext';

export default function AsciiBox() {
  const { cols } = useContext(GridContext);
  const text = 'work in progress';
  const UL = '\u250C', UR = '\u2510';
  const LL = '\u2514', LR = '\u2518';
  const H  = '\u2500', V  = '\u2502';
  const horizontal = H.repeat(text.length + 2);
  const box = [
    `${UL}${horizontal}${UR}`,
    `${V} ${text} ${V}`,
    `${LL}${horizontal}${LR}`
  ].join('\n');

  const rowFrac = 0.6;
  const colFrac = (cols - (text.length + 4)) / cols / 2;

  return (
    <GridBox
      rowFrac={rowFrac}
      colFrac={colFrac}
      widthCols={text.length + 4}
      background="#f5f5f5"
    >
      {box}
    </GridBox>
  );
}