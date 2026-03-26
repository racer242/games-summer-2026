import { isMobile, isLocal } from "../core/helpers";

const Game2Settings = {
  bonusBounds: {
    width: 100,
    height: 100,
  },

  lifeCount: 30,
  minLifeCountFactor: 0.5,
  deadCount: 0,
  switchCount: 0,
  killCount: 0,
  killingCount: 10,

  bonusLife: 20,

  showballThrowSize: 300,
  showballSize: 50,
  showballDistanceFactor: 2.2,
  showballShortDistance: 450,
  showballShortDurationFactor: 1.8,
  showballMinDuration: 250,
  showballExplodeDuration: 800,
  showburstDistanceFactor: 1.7,
  showburstDuration: 500,
  snowParticlesCount: 30,

  transitionDuration: 500, //ms
  showDurationFactor: 2,
  killDurationFactor: 0.5,

  stepDuration: 50, //ms
  gameDuration: 60, //ms
  stopDuration: 2000, //ms

  mobileScale: 0.96,
};

export default Game2Settings;
