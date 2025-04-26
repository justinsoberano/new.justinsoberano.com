import React, { useContext } from 'react';
import GridBox from '../Grid/GridBox';
import { GridContext } from '../../context/GridContext';

export default function AsciiBox({
  text,
  children,
  rowFrac,
  colFrac,
  widthCols,
  background = 'var(--primary-color)',
  contentContainerStyle,
  contentClassName,
}) {
  const { cols } = useContext(GridContext);

  const lines = text.split('\n');
  const maxLen = Math.max(...lines.map((l) => l.length));

  const UL = '\u250C', UR = '\u2510';
  const LL = '\u2514', LR = '\u2518';
  const H = '\u2500', V = '\u2502';

  const horizontal = H.repeat(maxLen + 2);
  const topRow    = `${UL}${horizontal}${UR}`;
  const bottomRow = `${LL}${horizontal}${LR}`;
  const middleRows = lines
    .map((l) => ` ${l.padEnd(maxLen, ' ')} `)
    .map((content) => `${V}${content}${V}`) 
    .join('\n');

  const boxString = [topRow, middleRows, bottomRow].join('\n');

  const computedWidthCols =
    widthCols ?? maxLen + 2 + 2;
  const computedColFrac =
    colFrac !== undefined
      ? colFrac
      : (cols - computedWidthCols) / cols / 2;

  return (
    <GridBox
      rowFrac={rowFrac}
      colFrac={computedColFrac}
      widthCols={computedWidthCols}
      background={background}
    >
      <pre style={{ margin: 0, fontFamily: 'monospace', whiteSpace: 'pre' }}>
        {boxString}
      </pre>

      {children && (
        <div
          className={contentClassName}
          style={{
            position: 'absolute',
            top: '1ch',
            left: '1ch',
            width: `${maxLen}ch`,
            height: `${lines.length}em`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            pointerEvents: 'none',
            ...contentContainerStyle,
          }}
        >
          {children}
        </div>
      )}
    </GridBox>
  );
}
