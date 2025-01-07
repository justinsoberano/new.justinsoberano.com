export const getRandomStartPosition = (position, range = 1) => {
  return [
    position[0] + (Math.random() - 0.5) * range,
    position[1] + (Math.random() - 0.5) * range,
    position[2] + (Math.random() - 0.5) * range
  ];
};

export const getRandomRotation = () => {
  return [
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  ];
};

export const LETTER_CONFIG = {
  transform: {
    mass: 2,
    tension: 200,
    friction: 700,
  },
  opacity: {
    mass: 1,
    tension: 10,
    friction: 20,
    duration: 100, 
  }
};