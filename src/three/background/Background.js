import { useState, useEffect } from "react";
import { Box } from "@react-three/drei";

function Background() {
  const [showBox, setShowBox] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBox(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showBox && <Box position={[0, 0, -3]} rotation={[0, 1, 1]} />}
    </>
  );
}

export default Background;
