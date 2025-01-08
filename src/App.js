import { Canvas } from '@react-three/fiber';
import { FirstName } from './three/name/Name';
import { AnimatedPointLight } from './components/lighting/AnimatedPointLight';
import { PostProcessingEffects } from './components/effects/PostProcessingEffects';
import { PostProcessingEffectsBackground } from "./components/effects/PostProcessingEffectsBackground";
import { useResponsiveCamera } from './components/hooks/useResponsiveCamera';
import { Warning } from './components/Warning';
import { Suspense, useEffect, useState } from 'react';
import Background from './three/background/Background';

const mainAudio = new Audio("audio.mp3");
mainAudio.preload = "auto";

const ThreeDScene = ({ dpr, cameraPosition }) => (
  <>
    <div className="box">WORK IN PROGRESS</div>
    // dirty dirty dirty
    <div className="canvas-container background-canvas">
      <Canvas dpr={1} camera={{ position: cameraPosition }}>
        <AnimatedPointLight />
        <Background />
        <PostProcessingEffectsBackground />
      </Canvas>
    </div>

    <div className="canvas-container firstname-canvas">
      <Canvas dpr={dpr} camera={{ position: cameraPosition }}>
        <AnimatedPointLight />
        <FirstName />
        <PostProcessingEffects />
      </Canvas>
    </div>
  </>
);

function App() {
  const [dpr, setDpr] = useState(1);
  const [device, setDevice] = useState('Desktop');
  const [start, setStart] = useState(false);
  const [audio, setAudio] = useState(true);

  function getDeviceType() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(userAgent)) {
      return 'Android';
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return 'iOS';
    }
    if (/windows phone/i.test(userAgent)) {
      return 'Windows Phone';
    }
    if (/mobile/i.test(userAgent)) {
      return 'Mobile';
    }
    return 'Desktop';
  }

  useEffect(() => {
    const deviceType = getDeviceType();
    setDevice(deviceType);
    if (deviceType === 'Android' || deviceType === 'iOS' || deviceType === 'Mobile') {
      setDpr(2);
    } else {
      setDpr(1.4);
    }
  }, []);

  const cameraPosition = useResponsiveCamera();

  const handleStart = () => {
    setStart(true);
    mainAudio.play();
  };

  const toggleAudio = () => {
    if (audio) {
      mainAudio.pause();
    } else {
      mainAudio.play();
    }
    setAudio(!audio);
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