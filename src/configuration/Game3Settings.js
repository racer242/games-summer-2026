import { isMobile, isLocal } from "../core/helpers";

const Game3Settings = {
  bonusBounds: {
    width: 60,
    height: 60,
  },

  objSources: [
    {
      id: "o1",
      x: 113,
      y: 224,
      src: require("../images/game3/objects/o1.png"),
    },
  ],

  transitionDuration: 200, //ms
  playingBallDuration: 1000, //ms
  particlesCount: 30,
  tapParticlesCount: 20,

  clearBallsAfterFail: true,
  savePointAfter: 3,

  stepDuration: 300, //ms
  gameDuration: 60, //s
  stopDuration: 1000, //ms
  finishingDuration: 5000, //ms
  animationDuration: 4000, //ms

  bonusLife: 3,
  tapLife: 3,
  mobileScale: 1,
  tapSize: 42,
  tapThrottlingDelay: 150,
  tapBonusCount: 2,
  bonusValue: 1,
};

export default Game3Settings;
