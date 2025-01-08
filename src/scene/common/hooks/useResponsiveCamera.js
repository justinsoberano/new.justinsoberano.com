import { useState, useEffect } from 'react';

export function useResponsiveCamera() {
  const [cameraPosition, setCameraPosition] = useState([0.3, 0, 2]);

  useEffect(() => {
    const updateCameraPosition = () => {
      const width = window.innerWidth
      const newZPosition = Math.max(2, 5 - width / 500);
      setCameraPosition([0, 0, newZPosition]);
    };
    
    updateCameraPosition();
    window.addEventListener('resize', updateCameraPosition);
    return () => window.removeEventListener('resize', updateCameraPosition);
  }, []);

  return cameraPosition;
}
