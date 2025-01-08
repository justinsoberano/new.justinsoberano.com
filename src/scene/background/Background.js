import { useState, useEffect, useCallback } from "react";
import ScrollingPlanes from "./experiments/ScrollingPlanes";
import * as THREE from 'three';

function Background() {
  const [show, setShow] = useState(false);
  const [loadedPlanes, setLoadedPlanes] = useState([]);
  
  const generatePlanes = useCallback((startId) => 
    Array.from({ length: 10 }, (_, i) => ({
      id: startId + i,
      isAnimated: true,
      videoIndex: ((startId + i) % 9) + 1
    })), []);

  const createVideo = useCallback((index) => {
    const video = document.createElement('video');
    video.src = `/videos/${index}.mp4`;
    video.loop = true;
    video.muted = true;
    video.playsinline = true;
    video.crossOrigin = 'anonymous';
    
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.disablePictureInPicture = true;
    video.disableRemotePlayback = true;
    
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    
    video.preload = 'auto';
    
    video.onerror = (e) => {
      console.error(`Error loading video ${index}:`, e);
    };
    
    video.addEventListener('loadedmetadata', () => {
      video.play().catch(console.error);
    });
    
    return video;
  }, []);

  const createVideoTexture = useCallback((video) => {
    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBAFormat;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
    
    return texture;
  }, []);

  useEffect(() => {
    let mounted = true;
    const videos = [];
    const videoTextures = [];

    const initializeVideos = async () => {
      const videoPromises = Array.from({ length: 9 }, async (_, i) => {
        const video = createVideo(i + 1);
        videos.push(video);
        return new Promise((resolve) => {
          video.addEventListener('loadeddata', () => resolve(video), { once: true });
          video.load();
        });
      });

      try {
        await Promise.all(videoPromises);
        
        if (!mounted) return;

        videoTextures.push(...videos.map(createVideoTexture));
        
        const allPlanes = [
          ...generatePlanes(1),
          ...generatePlanes(11),
          ...generatePlanes(21)
        ].map(plane => ({
          ...plane,
          texture: videoTextures[plane.videoIndex - 1],
          color: 'white'
        }));

        const rows = [
          { planeData: allPlanes.slice(0, 10), direction: 1, yOffset: 1 },
          { planeData: allPlanes.slice(10, 20), direction: -1, yOffset: 0 },
          { planeData: allPlanes.slice(20, 30), direction: 1, yOffset: -1 }
        ];

        setLoadedPlanes(rows);
      } catch (error) {
        console.error('Error initializing videos:', error);
      }
    };

    initializeVideos();

    return () => {
      mounted = false;
      videos.forEach(video => {
        video.pause();
        video.src = '';
        video.load();
        video.remove();
      });
      videoTextures.forEach(texture => {
        texture.dispose();
      });
    };
  }, [createVideo, createVideoTexture, generatePlanes]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 4800);

    return () => clearTimeout(timer);
  }, []);

  return (
    show && loadedPlanes.length > 0 ? (
      <ScrollingPlanes rows={loadedPlanes} speed={0.003} />
    ) : null
  );
}

export default Background;