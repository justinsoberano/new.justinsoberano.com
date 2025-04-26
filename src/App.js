import React from 'react';
import GridLayout from './components/Grid/GridLayout';
import Vortex from './components/Vortex';
import AsciiName from './components/Ascii/AsciiName.js';
import { IsMobile } from './hooks/useUAAgent.js';
import AsciiBox from './components/Ascii/AsciiBox.js';

export default function App() {
  const isMobile = IsMobile();

  return (
    <GridLayout>
      <Vortex />
      <AsciiName isMobile={isMobile} />
      <AsciiBox text={"work in progress"} rowFrac={0.6}/>
    </GridLayout>
  );
}
