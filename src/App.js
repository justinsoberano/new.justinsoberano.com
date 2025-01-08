import { Canvas } from '@react-three/fiber';
import { FirstName } from './scene/foreground/name/Name';
import { AnimatedPointLight } from './scene/common/lighting/AnimatedPointLight';
import { PostProcessingEffectsForeground, PostProcessingEffectsBackground } from "./scene/common/effects/PostProcessingEffects";
import { useResponsiveCamera } from './scene/common/hooks/useResponsiveCamera';
import { Warning } from './components/Warning';
import { Suspense, useState } from 'react';
import Background from './scene/background/Background';
import { useDevice } from './common/useDevice';

const mainAudio = new Audio("audio.mp3");
mainAudio.preload = "auto";

const ThreeDScene = ({ dpr, cameraPosition }) => (
  <>
    <div className="box">WORK IN PROGRESS</div>
    <div className="canvas-container background-canvas">
      <Canvas dpr={0.5} camera={{ position: cameraPosition }}>
        <AnimatedPointLight />
        <Background />
        <PostProcessingEffectsBackground />
      </Canvas>
    </div>

    <div className="canvas-container firstname-canvas">
      <Canvas dpr={dpr} camera={{ position: cameraPosition }}>
        <AnimatedPointLight />
        <FirstName />
        <PostProcessingEffectsForeground />
      </Canvas>
    </div>
  </>
);

function App() {
  const { type: device, dpr } = useDevice();
  const [start, setStart] = useState(false)
  const cameraPosition = useResponsiveCamera();

  const handleStart = () => {
    setStart(true);
    mainAudio.play();
  };

  if (!start) {
    return <Warning onAccept={handleStart} />;
  }

  return (
    <>
      <Suspense fallback={null}>
        <ThreeDScene dpr={dpr} cameraPosition={cameraPosition} />
      </Suspense>
    </>
  );
}

export default App;