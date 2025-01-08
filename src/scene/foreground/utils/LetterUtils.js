export const getRandomStartPosition = (position, range = 1) => {
  return [
    position[0] + (Math.random() - 0.5) * range,
    position[1] + (Math.random() - 0.5) * range,
    position[2] + (Math.random() - 0.5) * range
  ];
};


export const getRandomRotation = () => {
  return [
    (Math.random() - 0.5) * Math.PI * 4,
    (Math.random() - 0.5) * Math.PI * 2,
    (Math.random() - 0.5) * Math.PI * 2
  ];
};

export const LETTER_CONFIG = {
  transform: {
    mass: 2,
    tension: 200,
    friction: 500,
  },
  opacity: {
    mass: 1,
    tension: 10,
    friction: 200,
    duration: 100, 
  }
};