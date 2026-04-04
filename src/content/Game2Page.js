import React from "react";
import "../css/game2.css";
import GamePage from "./GamePage";
import CircularProgress from "../components/CircularProgress";
import "../css/card-particles.scss";

class Game2Page extends GamePage {
  constructor(props) {
    super(props);
    this.counter = 0;

    this.state = {
      ...this.state,
      gameDuration: this.state.game2.gameDuration,
      stopDuration: this.state.game2.stopDuration,
      stepDuration: this.state.game2.stepDuration,
      round: 0,
      progress: 0,
      startCountdown: this.state.game2.startCountdownCount,
      stage: "init",
      stageCounter: 0,
      restartHint: false,
      matrix: [],
      sequence: [],
      sequenceShow: {},
      sequenceSelect: {},
      sequenceCounter: -1,
      roundStats: [],
      hintStatus: "start",
    };

    this.object_downHandler = this.object_downHandler.bind(this);
  }

  stopGame() {
    super.stopGame();
  }

  doStart() {
    super.doStart();

    let matrix = [];

    let cardSources = [...this.state.game2.cardSources].sort(
      () => Math.random() - 0.5,
    );

    let i = 0;
    for (let y = 0; y < this.state.game2.matrix.y; y++) {
      for (let x = 0; x < this.state.game2.matrix.x; x++) {
        matrix.push({ src: cardSources.pop(), x, y, i, id: "card" + i });
        i++;
      }
    }

    this.setState({
      ...this.state,
      round: 0,
      progress: 0,
      startCountdown: this.state.game2.startCountdownCount,
      stage: "init",
      stageCounter: 0,
      restartHint: false,
      matrix,
      sequence: [],
      sequenceShow: {},
      sequenceSelect: {},
      sequenceCounter: -1,
      roundStats: [],
      hintStatus: "start",
    });
  }

  doGame() {
    let startCountdown = this.state.startCountdown;
    let stageCounter = this.state.stageCounter;
    let stage = this.state.stage;
    let restartHint = this.state.restartHint;
    let sequenceCounter = this.state.sequenceCounter;
    let sequence = this.state.sequence;
    let sequenceShow = this.state.sequenceShow;
    let progress = this.state.progress;
    let round = this.state.round;
    let sequenceSelect = this.state.sequenceSelect;
    let score = this.state.score;
    let roundStats = this.state.roundStats;
    let hintStatus = this.state.hintStatus;

    // console.log(stage, stageCounter, roundStats);

    if (stage === "init") {
      stageCounter++;

      if (stageCounter > this.state.game2.initStageCount) {
        sequence = [...this.state.matrix].sort(() => Math.random() - 0.5);
        sequenceShow = {};
        progress = 0;
        sequenceCounter = -1;
        sequenceSelect = {};
        stage = "start";
        hintStatus = "start";
        restartHint = true;
        stageCounter = 0;
        startCountdown = this.state.game2.startCountdownCount;
      }
    } else if (stage === "start") {
      stageCounter++;
      restartHint = false;
      if (stageCounter > this.state.game2.countdownStepCount) {
        stageCounter = 0;
        startCountdown--;
        if (startCountdown <= 0) {
          stage = "remember";
          restartHint = true;
        }
      }
    } else if (stage === "remember") {
      stageCounter++;
      restartHint = false;
      if (stageCounter > this.state.game2.rememberStepCount) {
        stageCounter = 0;
        sequenceCounter++;
        if (sequenceCounter < this.state.game2.sequenceLength) {
          let card = sequence[sequenceCounter];
          sequenceShow[card.id] = card;
        } else {
          sequenceCounter = 0;
          sequenceShow = {};
          stageCounter = 0;
          progress = 0;
          stage = "repeat";
          restartHint = true;
        }
      }
    } else if (stage === "repeat") {
      restartHint = false;
    } else if (stage === "result") {
      stageCounter++;
      restartHint = false;
      if (stageCounter > this.state.game2.resultCount) {
        stageCounter = 0;
        restartHint = true;

        stage = "correct";
        for (let i = 0; i < this.state.game2.sequenceLength; i++) {
          let selectedCard = this.state.sequenceSelect[sequence[i].id];
          if (selectedCard && selectedCard.selected === i) {
          } else {
            stage = "error";
            break;
          }
        }

        if (stage === "correct") {
          roundStats.push(true);
          if (round >= this.state.game2.roundCount - 1) {
            let boost = 1;
            for (let i = 0; i < roundStats.length; i++) {
              if (roundStats[i]) boost++;
              else break;
            }
            score =
              (this.state.game2.gameDuration - this.state.countdown) * boost;
            if (this.countdownTimer != null) clearTimeout(this.countdownTimer);
            this.countdownTimer = null;
          }
        } else {
          roundStats.push(false);
        }
      }
    } else if (stage === "correct") {
      stageCounter++;
      restartHint = false;
      if (stageCounter > this.state.game2.finalCount) {
        round++;
        progress = 0;
        if (round >= this.state.game2.roundCount) {
          stage = "close";
          setTimeout(() => {
            this.stopGame();
            this.finishGame();
          }, 2);
        } else {
          stage = "remember";
          sequence = [...this.state.matrix].sort(() => Math.random() - 0.5);
          sequenceShow = {};
          progress = 0;
          sequenceCounter = -1;
          sequenceSelect = {};
          restartHint = true;
          stageCounter = 0;
          hintStatus = "next";
        }
      }
    } else if (stage === "error") {
      stageCounter++;
      restartHint = false;
      if (stageCounter > this.state.game2.finalCount) {
        stage = "remember";
        hintStatus = "error";
        sequenceShow = {};
        progress = 0;
        sequenceCounter = -1;
        sequenceSelect = {};
        restartHint = true;
        stageCounter = 0;
      }
    }

    this.setState({
      ...this.state,
      stage,
      startCountdown,
      stageCounter,
      restartHint,
      sequenceCounter,
      sequenceShow,
      sequence,
      round,
      progress,
      sequenceSelect,
      score,
      roundStats,
      hintStatus,
    });
    return true;
  }

  object_downHandler(event) {
    if (this.state.finished) return;

    let stage = this.state.stage;
    let sequenceCounter = this.state.sequenceCounter;
    let sequenceSelect = this.state.sequenceSelect;
    let progress = this.state.progress;
    let restartHint = this.state.restartHint;

    let card = this.state.matrix[event.target.id];

    sequenceSelect[card.id] = { ...card, selected: sequenceCounter };
    sequenceCounter++;

    progress = (sequenceCounter * 100) / this.state.game2.sequenceLength;
    if (sequenceCounter < this.state.game2.sequenceLength) {
    } else {
      stage = "result";
      restartHint = true;
    }

    this.setState({
      ...this.state,
      stage,
      sequenceCounter,
      sequenceSelect,
      progress,
      restartHint,
    });
  }

  render() {
    let cards = [];
    for (let i = 0; i < this.state.matrix.length; i++) {
      let card = this.state.matrix[i];
      let particles = [];
      for (let j = 0; j < this.state.game2.cardParticlesCount; j++) {
        particles.push(
          <div
            key={"p" + j}
            className="card-particle"
            style={{
              "--rr": j * 8 + "deg",
              animationIterationCount:
                this.state.stage === "correct" &&
                this.state.sequenceSelect[card.id]
                  ? "infinite"
                  : "1",
            }}
          ></div>,
        );
      }
      cards.push(
        <div
          className={"gameCardContainer"}
          key={card.id}
          style={{
            opacity:
              this.state.sequenceShow[card.id] ||
              this.state.sequenceSelect[card.id]
                ? 1
                : 0,

            left:
              card.x *
              (this.state.game2.cardBounds.w + this.state.game2.cardGap),
            top:
              card.y *
              (this.state.game2.cardBounds.h + this.state.game2.cardGap),
          }}
        >
          <div
            className={
              "gameCard" +
              (this.state.stage === "correct" &&
              this.state.sequenceSelect[card.id]
                ? " celebration"
                : "")
            }
            id={card.i}
            onClick={this.object_downHandler}
            style={{
              backgroundImage: `url(${card.src})`,
              cursor:
                !(
                  this.state.sequenceShow[card.id] ||
                  this.state.sequenceSelect[card.id]
                ) && this.state.stage === "repeat"
                  ? "pointer"
                  : "default",
              pointerEvents:
                !(
                  this.state.sequenceShow[card.id] ||
                  this.state.sequenceSelect[card.id]
                ) && this.state.stage === "repeat"
                  ? "all"
                  : "none",
            }}
          ></div>
          {(this.state.sequenceShow[card.id] ||
            this.state.sequenceSelect[card.id] ||
            (this.state.stage === "correct" &&
              this.state.sequenceSelect[card.id])) && (
            <div
              className="card-particles-container"
              style={{
                left: "50%",
                top: "50%",
              }}
            >
              {particles}
            </div>
          )}
        </div>,
      );
    }

    let time = this.state.game2.gameDuration - this.state.countdown;
    let progress =
      ((this.state.round + this.state.progress / 100) /
        this.state.game2.roundCount) *
        100 +
      "%";
    return (
      <div className="g2 gamePage">
        <div className="gameScene">
          <div className="pageBg">
            <div className="djDisk djDiskLeft spin"></div>
            <div className="djDisk djDiskRight spin"></div>
            <div className="djDiskCap djDiskLeft"></div>
            <div className="djDiskCap djDiskRight"></div>
            <div
              className="buttonMatrix"
              style={{
                opacity: this.state.stage === "remember" ? 0 : 1,
              }}
            >
              {[...Array(4 * 4)].map((_, i) => (
                <div key={i} className="buttonRect"></div>
              ))}
            </div>
          </div>
          <div className="gameScene">
            <div className="cardMatrix">{cards}</div>
          </div>
        </div>
        <div className={"countdown display " + (time < 10 ? " warning" : "")}>
          <CircularProgress value={1 - time / this.state.game2.gameDuration}>
            {time}
          </CircularProgress>
        </div>

        <div className="progressBarContainer">
          <div className="progressBarBounds">
            <div
              className="progressBar"
              style={{
                width: progress,
              }}
            ></div>
          </div>
          <div className="progressBarTrack">
            <div className="progressBarSlider" style={{ left: progress }}></div>
          </div>
          <div className="progressBarDisplay">
            <p className="yellow">{this.state.round + 1}</p>
            <p>/</p>
            <p>{this.state.game2.roundCount}</p>
          </div>
        </div>

        {this.state.stage === "start" && this.state.stageCounter != 0 && (
          <div className="startCountdownBox">
            <div className="startCountdown show-startCountdown">
              <p>{this.state.startCountdown}</p>
            </div>
          </div>
        )}
        {(this.state.stage === "start" ||
          this.state.stage === "remember" ||
          this.state.stage === "repeat" ||
          this.state.stage === "correct" ||
          this.state.stage === "error") &&
          !this.state.restartHint && (
            <div className="gameHintBox">
              {this.state.stage === "start" && (
                <div className="gameHint show-gameHint pink">
                  <p>Приготовься</p>
                </div>
              )}
              {this.state.stage === "remember" && (
                <div className="gameHint show-gameHint orange">
                  {this.state.hintStatus === "start" && <p>Запоминай</p>}
                  {this.state.hintStatus === "error" && <p>Смотрим снова</p>}
                  {this.state.hintStatus === "next" && <p>Новая партия</p>}
                </div>
              )}
              {this.state.stage === "repeat" && (
                <div className="gameHint show-gameHint violet">
                  <p>Повтори</p>
                </div>
              )}
              {this.state.stage === "correct" && (
                <div className="gameHint show-gameHint green">
                  <p className="celebration">Правильно!</p>
                </div>
              )}
              {this.state.stage === "error" && (
                <div className="gameHint show-gameHint blue">
                  <p>Упс, ошибочка</p>
                </div>
              )}
            </div>
          )}

        <div
          className="pageOverlay"
          style={{
            visibility: this.state.finished ? "visible" : "hidden",
            opacity: this.state.finished ? 1 : 0,
            transitionDuration: this.state.game2.stopDuration + "ms",
          }}
        ></div>
      </div>
    );
  }
}

export default Game2Page;
