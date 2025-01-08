import { useState, useEffect } from "react";
import ScrollingPlanes from "./experiments/ScrollingPlanes";

function Background() {
  const [show, setShow] = useState(false);
  
  const generatePlanes = (startId) => Array.from({ length: 10 }, (_, i) => ({
    id: startId + i
  }));
  
  const rows = [
    { planeData: generatePlanes(1), direction: 1, yOffset: 1 },
    { planeData: generatePlanes(11), direction: -1, yOffset: 0 },
    { planeData: generatePlanes(21), direction: 1, yOffset: -1 }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  return show ? <ScrollingPlanes rows={rows} speed={0.001} /> : null;
}

export default Background;
