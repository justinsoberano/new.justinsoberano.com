import { useContext, useMemo } from 'react';
import { GridContext } from '../context/GridContext';

export function useGridPosition({ widthCols, heightRows, rowFrac = 0, colFrac = 0 }) {
  const { rows, cols } = useContext(GridContext);
  return useMemo(() => {
    const topRow  = Math.floor(rows * rowFrac);
    const leftCol = Math.floor(cols * colFrac);
    return {
      top:    `${topRow}em`,
      left:   `${leftCol}ch`,
      width:  `${widthCols}ch`,
      height: `${heightRows}em`
    };
  }, [rows, cols, widthCols, heightRows, rowFrac, colFrac]);
}
