import { EffectComposer, Bloom, Glitch, Noise } from '@react-three/postprocessing';
import { KernelSize, Resolution, BlendFunction } from 'postprocessing';

export function PostProcessingEffects() {
  return (
    <EffectComposer>
      <Bloom
        intensity={0.1}
        luminanceThreshold={1}
        kernelSize={KernelSize.LARGE}
        luminanceSmoothing={1}
        resolutionX={Resolution.AUTO_SIZE}
        resolutionY={Resolution.AUTO_SIZE}
      />
      <Glitch
        delay={[1, 5]}
        duration={[0.1, 0.5]}
        ratio={0.1}
        strength={0.1}
      />
      <Glitch
        delay={[5, 10]}
        duration={[0.1, 0.5]}
        ratio={1}
        columns={64}
        strength={1}
      />
      <Noise premultiply blendFunction={BlendFunction.ADD} opacity={2} />
    </EffectComposer>
  );
}