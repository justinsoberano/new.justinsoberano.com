import { useSpring, animated } from '@react-spring/three';

export function AnimatedPointLight() {
  const spring = useSpring({
    from: { intensity: 0 },
    to: { intensity: 7 },
    delay: 4750,
    config: {
      duration: 50,
    }
  });

  return <animated.pointLight distance={20} decay={0} position={[0, 1, 3]} {...spring} />;
}