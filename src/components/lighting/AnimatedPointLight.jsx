import { useSpring, animated } from '@react-spring/three';

export function AnimatedPointLight() {
  const spring = useSpring({
    from: { intensity: 0 },
    to: { intensity: 100 },
    delay: 7500,
    config: {
      mass: 1,
      tension: 280,
      friction: 2000,
      duration: 1000,
    }
  });

  return <animated.pointLight position={[0, 1, 3]} {...spring} />;
}