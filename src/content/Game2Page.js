import React from "react";
import "../css/game2.css";
import GamePage from "./GamePage";
import CircularProgress from "../components/CircularProgress";

class Game2Page extends GamePage {
  constructor(props) {
    super(props);
    this.counter = 0;

    this.state = {
      ...this.state,
      matrix: [],
      sequence: [],
      gameDuration: this.state.game2.gameDuration,
      stopDuration: this.state.game2.stopDuration,
      stepDuration: this.state.game2.stepDuration,
      round: 0,
      progress: 0,
      startCountdown: this.state.game2.startCountdownCount,
      stage: "init",
      stageCounter: 0,
      restartHint: false,
      sequenceCounter: -1,
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
      sequenceCounter: -1,
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

    console.log(stage, stageCounter, sequenceCounter);

    if (stage === "init") {
      stageCounter++;

      if (stageCounter > this.state.game2.initStageCount) {
        sequence = [...this.state.matrix].sort(() => Math.random() - 0.5);
        sequenceShow = {};

        stage = "start";
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
          sequenceCounter = -1;
          sequenceShow = {};
          stageCounter = 0;
          stage = "repeat";
          restartHint = true;
        }
      }
    } else if (stage === "repeat") {
      stageCounter++;
      restartHint = false;
      if (stageCounter > this.state.game2.rememberStepCount) {
        stageCounter = 0;

        stage = "init";
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
    });
    return true;
  }

  object_downHandler(event) {
    if (this.state.finished) return;
  }

  render() {
    let cards = [];
    for (let i = 0; i < this.state.matrix.length; i++) {
      let card = this.state.matrix[i];
      cards.push(
        <div
          className={"gameCard"}
          id={card.i}
          key={card.id}
          style={{
            opacity: this.state.sequenceShow[card.id] ? 1 : 0.1,
            left:
              card.x *
              (this.state.game2.cardBounds.w + this.state.game2.cardGap),
            top:
              card.y *
              (this.state.game2.cardBounds.h + this.state.game2.cardGap),
            backgroundImage: `url(${card.src})`,
            cursor: this.state.stage === "repeat" ? "pointer" : "default",
            pointerEvents: this.state.stage === "repeat" ? "all" : "none",
          }}
          onClick={this.object_downHandler}
        ></div>,
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
            <div className="buttonMatrix">
              {[...Array(4 * 4)].map((_, i) => (
                <div
                  key={i}
                  className="buttonRect"
                  style={{
                    "--row": Math.floor(i / 4),
                    "--col": i % 4,
                    "--dist-center": Math.max(
                      Math.abs(Math.floor(i / 4) - 1.5),
                      Math.abs((i % 4) - 1.5),
                    ),
                  }}
                ></div>
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
          this.state.stage === "repeat") &&
          !this.state.restartHint && (
            <div className="gameHintBox">
              {this.state.stage === "start" && (
                <div className="gameHint show-gameHint pink">
                  <p>Приготовься</p>
                </div>
              )}
              {this.state.stage === "remember" && (
                <div className="gameHint show-gameHint orange">
                  {this.state.round % 3 === 0 && <p>Запоминай</p>}
                  {this.state.round % 3 === 1 && <p>Смотрим снова</p>}
                  {this.state.round % 3 === 2 && <p>Новая партия</p>}
                </div>
              )}
              {this.state.stage === "repeat" && (
                <div className="gameHint show-gameHint violet">
                  <p>Повтори</p>
                </div>
              )}
              {this.state.stage === "correct" && (
                <div className="gameHint show-gameHint green">
                  <p>Правильно!</p>
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
