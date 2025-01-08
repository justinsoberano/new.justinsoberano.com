import { animated } from '@react-spring/three';
import { useGLTF } from '@react-three/drei';
import { useLetterAnimations } from '../hooks/useLetterAnimations';
import { memo, useState, useEffect } from 'react';

export const Letter = memo(function Letter({ path, position, delay, scale = [1, 1, 1] }) {
  const { scene } = useGLTF(path);
  const { transformSpring } = useLetterAnimations(position, delay);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  if (!visible) return null;
  
  return (
    <animated.primitive
      object={scene}
      position={transformSpring.position}
      rotation={transformSpring.rotation}
      scale={scale}
    />
  );
});
