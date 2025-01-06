import { useSpring } from '@react-spring/three';
import { getRandomStartPosition, getRandomRotation, LETTER_CONFIG } from '../utils/LetterUtils';
import { useMemo } from 'react';

export const useLetterAnimations = (position, delay) => {
  const initialState = useMemo(() => ({
    startPosition: getRandomStartPosition(position),
    startRotation: getRandomRotation(),
  }), [position]);

  const transformSpring = useSpring({
    from: {
      position: initialState.startPosition,
      rotation: initialState.startRotation,
      scale: 1,
    },
    to: {
      position: position,
      rotation: [1, 0, 0],
      scale: 1,
    },
    delay,
    config: LETTER_CONFIG.transform,
    immediate: false,
  });

  const opacitySpring = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: delay + 500,
    config: LETTER_CONFIG.opacity,
    immediate: false,
  });

  return { transformSpring, opacitySpring };
};
