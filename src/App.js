// import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { FirstName } from './geometries/name/Name';
import { AnimatedPointLight } from './components/lighting/AnimatedPointLight';
import { PostProcessingEffects } from './components/effects/PostProcessingEffects';
import { useResponsiveCamera } from './components/hooks/useResponsiveCamera';

function App() {
  const cameraPosition = useResponsiveCamera();

  return (
    <>
      <div className="box">
        WORK IN PROGRESS
      </div>
      <Canvas dpr={1} style={{ backgroundColor: 'black' }} shadows camera={{ position: cameraPosition }}>
        <AnimatedPointLight />
        <FirstName />
        <PostProcessingEffects />
      </Canvas>
    </>

  );
}

export default App;