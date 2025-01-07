import { useEffect, useCallback, useMemo } from 'react';

export const useLetterMaterial = (scene) => {
  const setupTransparency = useCallback(() => {
    scene.traverse((node) => {
      if (node.isMesh) {
        node.material.transparent = true;
        node.material.needsUpdate = true;
      }
    });
  }, [scene]);

  const updateOpacity = useMemo(() => (opacity) => {
    scene.traverse((node) => {
      if (node.isMesh) {
        node.material.opacity = opacity;
      }
    });
  }, [scene]);

  useEffect(() => {
    setupTransparency();
  }, [setupTransparency]);

  return { updateOpacity };
};