export const getRandomStartPosition = (position, range = 1) => {
  return [
    position[0] + (Math.random() - 0.5) * range,
    position[1] + (Math.random() - 0.5) * range,
    position[2] + (Math.random() - 0.5) * range
  ];
};

export const getRandomRotation = () => {
  return [
    Math.random() * Math.PI / 2,
    Math.random() * Math.PI / 2,
    Math.random() * Math.PI / 2
  ];
};

export const LETTER_CONFIG = {
  transform: {
    mass: 2,
    tension: 200,
    friction: 1500,
  },
  opacity: {
    mass: 1,
    tension: 120,
    friction: 200,
  }
};