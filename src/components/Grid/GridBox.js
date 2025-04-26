import React from 'react';
import { preStyle } from '../../styles/GlobalStyles';
import { useGridPosition } from '../../hooks/useGridPosition';

export default function GridBox({
  rowFrac = 0,
  colFrac = 0,
  widthCols,
  heightRows,
  padding = 0,
  background = 'var(--primary-color)',
  children
}) {

  const { top, left, width, height } = useGridPosition({
    widthCols: widthCols + padding * 2,
    heightRows: heightRows + padding * 2,
    rowFrac,
    colFrac
  });

  return (
    <pre
      style={{
        ...preStyle,
        position:   'absolute',
        top,
        left,
        width,
        height,
        padding:    `${padding}em ${padding}ch`,
        boxSizing:  'border-box',
        overflow:   'hidden',
        background,
        userSelect: 'none'
      }}
    >
      {children}
    </pre>
  );
}