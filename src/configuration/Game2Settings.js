import { isMobile, isLocal } from "../core/helpers";

const Game2Settings = {
  transitionDuration: 500, //ms

  stepDuration: 100, //ms
  gameDuration: 60, //ms
  stopDuration: 1000, //ms

  startCountdownCount: 3,
  initStageCount: 2,
  countdownStepCount: 7,
  rememberStepCount: 4,
  resultCount: 2,
  finalCount: 12,

  cardSources: [
    require("../images/game2/cards/card1.png"),
    require("../images/game2/cards/card2.png"),
    require("../images/game2/cards/card3.png"),
    require("../images/game2/cards/card4.png"),
    require("../images/game2/cards/card5.png"),
    require("../images/game2/cards/card6.png"),
    require("../images/game2/cards/card7.png"),
    require("../images/game2/cards/card8.png"),
    require("../images/game2/cards/card9.png"),
    require("../images/game2/cards/card10.png"),
    require("../images/game2/cards/card11.png"),
    require("../images/game2/cards/card12.png"),
    require("../images/game2/cards/card13.png"),
    require("../images/game2/cards/card14.png"),
    require("../images/game2/cards/card15.png"),
    require("../images/game2/cards/card16.png"),
  ],

  matrix: { x: 4, y: 4 },
  cardBounds: { w: 70, h: 70 },
  cardGap: 21.5,

  sequenceLength: 5,
  roundCount: 3,

  cardParticlesCount: 20,
};

export default Game2Settings;
