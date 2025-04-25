import React from 'react';
import Vortex from './components/Vortex';
import AcrylicContainer from './components/AcrylicContainer';
import { appContainerStyle } from './styles/VortexStyles';

export default function App() {
  return (
    <div style={appContainerStyle}>
      <Vortex />
      <AcrylicContainer />
    </div>
  );
}
