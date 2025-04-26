import React from 'react';
import { GridContext } from '../../context/GridContext';
import { useGridMetrics } from '../../hooks/useGridMetrics';
import { appContainerStyle, preStyle } from '../../styles/GlobalStyles';

export default function GridLayout({ children }) {
  const { rows, cols, preRef } = useGridMetrics();

  return (
    <div style={appContainerStyle}>
      <pre
        ref={preRef}
        style={{
          margin: 0,
          padding: 0,
          whiteSpace: 'pre',
          fontFamily: preStyle.fontFamily,
          fontSize: preStyle.fontSize,
          lineHeight: preStyle.lineHeight,
          position: 'absolute',
          visibility: 'hidden',
          top: 0,
          left: 0
        }}
      />

      <GridContext.Provider value={{ rows, cols }}>
        {children}
      </GridContext.Provider>
    </div>
  );
}