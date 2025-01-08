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
    },
    to: {
      position: position,
      rotation: [1, 0, 0],
    },
    delay,
    config: LETTER_CONFIG.transform,
    immediate: false,
  });

  return { transformSpring };
};
