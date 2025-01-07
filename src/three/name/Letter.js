import { animated } from '@react-spring/three';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useLetterMaterial } from '../hooks/useLetterMaterial';
import { useLetterAnimations } from '../hooks/useLetterAnimations';
import { memo } from 'react';

export const Letter = memo(function Letter({ path, position, delay }) {
  const { scene } = useGLTF(path);
  const { updateOpacity } = useLetterMaterial(scene);
  const { transformSpring, opacitySpring } = useLetterAnimations(position, delay);

  useFrame(() => {
    updateOpacity(opacitySpring.opacity.get());
  });

  return (
    <animated.primitive
      object={scene}
      position={transformSpring.position}
      rotation={transformSpring.rotation}
      scale={transformSpring.scale}
      onChange={() => {
        updateOpacity(opacitySpring.opacity.get());
      }}
    />
  );
});
