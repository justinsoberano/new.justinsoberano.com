import { useGLTF } from '@react-three/drei';
import { Letter } from './Letter';
import { Suspense, useEffect } from 'react';

const LETTERS_CONFIG = [
  { letter: 'J', position: [-1.2, 0, 0], delay: 0 },
  { letter: 'U', position: [-0.74, 0, 0], delay: 100 },
  { letter: 'S', position: [-0.2, 0, 0], delay: 200 },
  { letter: 'T', position: [0.25, 0, 0], delay: 300 },
  { letter: 'I', position: [0.6, 0, 0], delay: 400 },
  { letter: 'N', position: [0.95, 0, 0], delay: 500 },
];

function PreloadLetters() {
  useEffect(() => {
    LETTERS_CONFIG.forEach(({ letter }) => {
      useGLTF.preload(`glb/letters/Letter${letter}.glb`);
    });
  }, []);
  
  return null;
}

export function FirstName() {
  return (
    <Suspense fallback={null}>
      <PreloadLetters />
      {LETTERS_CONFIG.map(({ letter, position, delay }) => (
        <Letter
          key={letter}
          path={`glb/letters/Letter${letter}.glb`}
          position={position}
          delay={delay}
        />
      ))}
    </Suspense>
  );
}