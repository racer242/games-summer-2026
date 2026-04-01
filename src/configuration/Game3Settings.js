import { isMobile, isLocal } from "../core/helpers";

const Game3Settings = {
  bonusBounds: {
    width: 60,
    height: 60,
  },

  noteBounds: {
    width: 80,
    height: 80,
  },

  noteSources: [
    {
      src: require("../images/game3/objects/note1.png"),
    },
    {
      src: require("../images/game3/objects/note2.png"),
    },
    {
      src: require("../images/game3/objects/note3.png"),
    },
    {
      src: require("../images/game3/objects/note4.png"),
    },
    {
      src: require("../images/game3/objects/note5.png"),
    },
  ],

  objSources: [
    {
      w: 71,
      h: 87,
      src: require("../images/game3/objects/o1.png"),
    },
    {
      w: 89,
      h: 66,
      src: require("../images/game3/objects/o2.png"),
    },
    {
      w: 55,
      h: 88,
      src: require("../images/game3/objects/o3.png"),
    },
    {
      w: 90,
      h: 49,
      src: require("../images/game3/objects/o4.png"),
    },
    {
      w: 88,
      h: 104,
      src: require("../images/game3/objects/o5.png"),
    },
    {
      w: 111,
      h: 80,
      src: require("../images/game3/objects/o6.png"),
    },
    {
      w: 79,
      h: 52,
      src: require("../images/game3/objects/o7.png"),
    },
    {
      w: 105,
      h: 82,
      src: require("../images/game3/objects/o8.png"),
    },
    {
      w: 71,
      h: 85,
      src: require("../images/game3/objects/o9.png"),
    },
    {
      w: 68,
      h: 89,
      src: require("../images/game3/objects/o10.png"),
    },
    {
      w: 74,
      h: 75,
      src: require("../images/game3/objects/o11.png"),
    },
    {
      w: 103,
      h: 50,
      src: require("../images/game3/objects/o12.png"),
    },
    {
      w: 66,
      h: 82,
      src: require("../images/game3/objects/o13.png"),
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

  mobileScale: 1,
  tapSize: 42,
  tapThrottlingDelay: 150,

  bonusLife: 3,
  tapLife: 3,
  noteLife: 10,
  objectLife: 30,

  tapBonusCount: 20,
  noteCreateCount: 3,
  stripeAddCount: 15,
  objectCreateCount: 20,

  bonusValue: 10,
  objectBonusValue: 2,
};

export default Game3Settings;
