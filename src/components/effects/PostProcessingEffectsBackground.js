import { useEffect, useState } from 'react';
import { EffectComposer, Bloom, Glitch, Noise, DepthOfField, DotScreen, Pixelation} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

export function PostProcessingEffectsBackground() {

  return (
    <EffectComposer>
      <Pixelation granularity={4}/>
    </EffectComposer>
  );
}