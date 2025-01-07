import { useSpring, animated } from '@react-spring/three';

export function AnimatedPointLight() {
  const spring = useSpring({
    from: { intensity: 0 },
    to: { intensity: 100 },
    delay: 4750,
    config: {
      duration: 50,
    }
  });

  return <animated.pointLight position={[0, 1, 3]} {...spring} />;
}