import { useGLTF } from '@react-three/drei';
import { Letter } from './Letter';
import { Suspense, useEffect } from 'react';
import { useDevice } from '../../../common/useDevice';

const DESKTOP_CONFIG = [
  { letter: 'J', position: [-1.2, 0, 0], delay: 0, scale: [1, 1, 1] },
  { letter: 'U', position: [-0.74, 0, 0], delay: 125, scale: [1, 1, 1] },
  { letter: 'S', position: [-0.2, 0, 0], delay: 300, scale: [1, 1, 1] },
  { letter: 'T', position: [0.25, 0, 0], delay: 375, scale: [1, 1, 1] },
  { letter: 'I', position: [0.6, 0, 0], delay: 600, scale: [1, 1, 1] },
  { letter: 'N', position: [0.95, 0, 0], delay: 800, scale: [1, 1, 1] },
];

const MOBILE_CONFIG = [
  { letter: 'J', position: [-1, 0.5, 0], delay: 0, scale: 2  },
  { letter: 'U', position: [-0.12, 0.5, 0], delay: 125, scale: 2 },
  { letter: 'S', position: [1, 0.5, 0], delay: 300, scale: 2 },
  { letter: 'T', position: [-1, -0.6, 0], delay: 375, scale: 2 },
  { letter: 'I', position: [-0.1, -0.55, 0], delay: 600, scale: 2 },
  { letter: 'N', position: [0.7, -0.5, 0], delay: 800, scale: 2 },
];

function PreloadLetters() {
  useEffect(() => {
    DESKTOP_CONFIG.forEach(({ letter }) => {
      useGLTF.preload(`glb/letters/Letter${letter}.glb`);
    });
  }, []);
  return null;
}

export function FirstName() {
  const { type } = useDevice();
  const config = type !== 'Desktop' ? MOBILE_CONFIG : DESKTOP_CONFIG;

  return (
    <Suspense fallback={null}>
      <PreloadLetters />
      {config.map(({ letter, position, delay, scale }) => (
        <Letter
          key={letter}
          path={`glb/letters/Letter${letter}.glb`}
          position={position}
          delay={delay}
          scale={scale}
        />
      ))}
    </Suspense>
  );
}