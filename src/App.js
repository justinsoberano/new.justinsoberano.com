// import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { FirstName } from './geometries/name/Name';
import { AnimatedPointLight } from './components/lighting/AnimatedPointLight';
import { PostProcessingEffects } from './components/effects/PostProcessingEffects';
import { useResponsiveCamera } from './components/hooks/useResponsiveCamera';

import {useEffect, useState} from 'react';

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

function App() {
  const [dpr, setDpr] = useState(1);
  const [device, setDevice] = useState('Desktop');

  useEffect(() => {
    const deviceType = getDeviceType();
    setDevice(deviceType);
    if (deviceType === 'Android' || deviceType === 'iOS' || deviceType === 'Mobile') {
      setDpr(2);
    } else {
      setDpr(1.4); //sharper imaeg
    }
  }, []);

  const cameraPosition = useResponsiveCamera();

  return (
    <>
      <div className="box">
        WORK IN PROGRESS
      </div>
      <Canvas dpr={dpr} style={{ backgroundColor: 'black' }} shadows camera={{ position: cameraPosition }}>
        <AnimatedPointLight />
        <FirstName />
        <PostProcessingEffects />
      </Canvas>
    </>

  );
}

export default App;