import { useState, useEffect } from 'react';

export function useDevice() {
  const [deviceInfo, setDeviceInfo] = useState({
    type: 'Desktop',
    dpr: 1.4
  });

  useEffect(() => {
    function getDeviceType() {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      if (/android/i.test(userAgent)) return 'Android';
      if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) return 'iOS';
      if (/windows phone/i.test(userAgent)) return 'Windows Phone';
      if (/mobile/i.test(userAgent)) return 'Mobile';
      return 'Desktop';
    }

    const type = getDeviceType();
    const dpr = type === 'Desktop' ? 1.4 : 2;
    
    setDeviceInfo({ type, dpr });
  }, []);

  return deviceInfo;
}