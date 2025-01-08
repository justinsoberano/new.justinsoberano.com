import { useEffect, useState } from 'react';
import { EffectComposer, Bloom, Glitch, Noise, DepthOfField, DotScreen} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

export function PostProcessingEffects() {
  const [isSecondGlitchActive, setIsSecondGlitchActive] = useState(true);
  const [noiseMultiplier, setNoiseMultiplier] = useState(3);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSecondGlitchActive(false);
      setNoiseMultiplier(1)
    }, 5200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <EffectComposer>
      <Glitch delay={[0.5, 1]} duration={[0.1, 0.5]} ratio={1} strength={0.1} active={isSecondGlitchActive}/>
      <Glitch delay={[4.7, 4.7]} duration={[0.5, 0.5]} ratio={1} columns={128} strength={0.1} active={isSecondGlitchActive}/>
      <Noise premultiply blendFunction={BlendFunction.ADD} opacity={noiseMultiplier} />
      <Bloom intensity={0.1} luminanceThreshold={1} luminanceSmoothing={1} height={300} />
    </EffectComposer>
  );
}