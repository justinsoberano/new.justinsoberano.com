import { useEffect, useState } from 'react';
import { EffectComposer, Bloom, Glitch, Noise, Pixelation} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

export function PostProcessingEffectsForeground() {
  const [isSecondGlitchActive, setIsSecondGlitchActive] = useState(true);
  const [noiseMultiplier, setNoiseMultiplier] = useState(3);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSecondGlitchActive(false);
      setNoiseMultiplier(1)
    }, 5700);
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

export function PostProcessingEffectsBackground() {
  const [isSecondGlitchActive, setIsSecondGlitchActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSecondGlitchActive(false);
    }, 5200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <EffectComposer>
      <Glitch delay={[4.7, 4.7]} duration={[1, 1]} ratio={1} columns={1} strength={1} active={isSecondGlitchActive}/>
      <Pixelation granularity={2} />
    </EffectComposer>
  );
}