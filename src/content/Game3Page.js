import React from "react";
import "../css/game3.css";
import "../css/tap-particles.scss";
import GamePage from "./GamePage";
import { shuffle } from "../utils/arrayTools";
import CircularProgress from "../components/CircularProgress";

var shuffledCans = [];
const cansCount = 8;
const stripesCount = 18;

class Game3Page extends GamePage {
  constructor(props) {
    super(props);

    if (shuffledCans.length === 0) {
      shuffledCans = shuffle(Array.from({ length: cansCount }, (_, i) => i));
    }

    this.state = {
      ...this.state,
      objects: [],
      bonuses: [],
      taps: [],
      canId: 0,
      tapCounter: 0,
      stripesAmount: 0,
      stripes: [],
      gameDuration: this.state.game3.gameDuration,
      stopDuration: this.state.game3.stopDuration,
      stepDuration: this.state.game3.stepDuration,
      scoreAdded: false,
      tapAdded: false,
    };

    this.tapThrottling = false;
    this.can_clickHandler = this.can_clickHandler.bind(this);
  }

  doStart() {
    const canId = shuffledCans.pop();
    let stripes = [];
    let leftStripes = shuffle(
      Array.from({ length: Math.floor(stripesCount / 2) }, (_, i) => i),
    );
    let rightStripes = shuffle(
      Array.from({ length: Math.floor(stripesCount / 2) }, (_, i) => i),
    );
    for (let i = 0; i < Math.floor(stripesCount / 2); i++) {
      stripes.push("lStripe" + leftStripes.pop());
      stripes.push("rStripe" + rightStripes.pop());
    }

    this.setState({
      ...this.state,
      canId,
      stripes,
    });
  }

  stopGame() {
    super.stopGame();
  }

  doGame() {
    let objects = this.state.objects;
    let taps = this.state.taps;
    let bonuses = this.state.bonuses;
    let scoreAdded = this.state.scoreAdded;
    let tapAdded = this.state.tapAdded;

    taps = taps.filter((v) => v.status != "tap-destroy");
    for (const tap of taps) {
      if (tap.status == "tap-show") {
        tap.life--;
        if (tap.life < 0) {
          tap.status = "tap-destroy";
        }
      }
      if (tap.status == "tap-on") {
        tapAdded = false;
        tap.status = "tap-show";
        tap.life = this.state.game3.tapLife;
      }
    }

    bonuses = bonuses.filter((v) => v.status != "bonus-destroy");
    for (const bonus of bonuses) {
      if (bonus.status == "bonus-show") {
        bonus.life--;
        if (bonus.life < 0) {
          bonus.status = "bonus-destroy";
        }
      }
      if (bonus.status == "bonus-on") {
        scoreAdded = false;
        bonus.status = "bonus-show";
        bonus.life = this.state.game3.bonusLife;
      }
    }
    this.setState({
      ...this.state,
      objects,
      taps,
      bonuses,
      scoreAdded,
      tapAdded,
    });
    return true;
  }

  can_clickHandler(event) {
    let parentNode = event.currentTarget.parentNode;
    let clientX = event.clientX;
    let clientY = event.clientY;
    if (!this.tapThrottling) {
      this.doClick(parentNode, clientX, clientY);
      this.tapThrottling = true;
      clearTimeout(this.tapTimeout);
    }
    this.tapTimeout = setTimeout(() => {
      this.tapThrottling = false;
    }, this.state.game3.tapThrottlingDelay);
  }

  doClick(parentNode, clientX, clientY) {
    if (this.state.finished) return;
    let taps = this.state.taps;
    let stripesAmount = this.state.stripesAmount;
    let bonuses = this.state.bonuses;
    let tapCounter = this.state.tapCounter + 1;
    let score = this.state.score;
    let scoreAdded = this.state.scoreAdded;

    let b = parentNode.getBoundingClientRect();
    let x = (clientX - b.x) / this.props.bounds.pageScale;
    let y = (clientY - b.y) / this.props.bounds.pageScale;
    if (this.props.bounds.mobileSize) {
      x /= this.state.game3.mobileScale;
      y /= this.state.game3.mobileScale;
    }

    if (tapCounter % this.state.game3.tapBonusCount === 0) {
      stripesAmount++;
      bonuses.push({
        id: "bonus" + this.counter++,
        cssX: x + this.state.game3.bonusBounds.width,
        cssY: y,
        value: this.state.game3.bonusValue,
        status: "bonus-on",
      });
      score += this.state.game3.bonusValue;
      scoreAdded = true;
    }

    taps.push({
      id: "tap" + this.counter++,
      cssX: x,
      cssY: y,
      status: "tap-on",
      seed: Math.random() * 180,
    });

    this.setState({
      ...this.state,
      taps,
      tapCounter,
      tapAdded: true,
      stripesAmount,
      bonuses,
      score,
      scoreAdded,
    });
  }

  render() {
    let objs = [];
    let bonuses = [];
    let taps = [];

    for (let i = 0; i < this.state.taps.length; i++) {
      let tap = this.state.taps[i];
      let particles = [];
      for (let j = 0; j < this.state.game3.tapParticlesCount; j++) {
        particles.push(
          <div
            key={"p" + j}
            className="tap-particle"
            style={{ "--rr": tap.seed + "deg" }}
          ></div>,
        );
      }
      taps.push(
        <div key={tap.id}>
          <div
            className="tap-particles-container"
            style={{
              left: tap.cssX,
              top: tap.cssY,
            }}
          >
            {particles}
          </div>
          <div
            className="tap tapAnimation"
            id={tap.id}
            style={{
              left: tap.cssX - this.state.game3.tapSize / 2,
              top: tap.cssY - this.state.game3.tapSize / 2,
            }}
          ></div>
          <div
            className="tap tapAnimation delay300ms"
            id={tap.id}
            style={{
              left: tap.cssX - this.state.game3.tapSize / 2,
              top: tap.cssY - this.state.game3.tapSize / 2,
            }}
          ></div>
          <div
            className="tap tapAnimation delay600ms"
            id={tap.id}
            style={{
              left: tap.cssX - this.state.game3.tapSize / 2,
              top: tap.cssY - this.state.game3.tapSize / 2,
            }}
          ></div>
        </div>,
      );
    }

    for (let i = 0; i < this.state.bonuses.length; i++) {
      let bonus = this.state.bonuses[i];
      let particles = [];
      if (bonus.value > 0) {
        for (let j = 0; j < this.state.game1.particlesCount; j++) {
          particles.push(<div key={"p" + j} className="bonus-particle"></div>);
        }
      }
      bonuses.push(
        <div key={bonus.id}>
          <div
            className="bonus-particle-container"
            style={{
              left: bonus.cssX,
              top: bonus.cssY,
            }}
          >
            {particles}
          </div>
          <div
            className="bonus-box bonusUp display"
            id={bonus.id}
            style={{
              left: bonus.cssX,
              top: bonus.cssY,
            }}
          >
            <div className={"bonus g1" + (bonus.value > 0 ? "" : " negative")}>
              <div className="bonus-back spin duraton1s"></div>
              {bonus.value > 0 ? "+" + bonus.value : bonus.value}
            </div>
          </div>
        </div>,
      );
    }

    let stripes = [];
    for (let i = 0; i < this.state.stripesAmount; i++) {
      stripes.push(
        <div
          key={"stripe" + i}
          className={"stripe stripe-appear " + this.state.stripes[i]}
        >
          <div
            className={"stripeBody stripeAnimation " + this.state.stripes[i]}
          ></div>
        </div>,
      );
    }
    let time = this.state.game3.gameDuration - this.state.countdown;

    return (
      <div className="gamePage g3">
        <div className="gameScene">
          <div className="pageBg slow-pulsing"></div>
          {stripes}
          <div
            className={
              "can can" +
              this.state.canId +
              (this.state.tapAdded ? " canImpulse" : "")
            }
            onPointerDown={this.can_clickHandler}
          ></div>
          {objs}
          {taps}
          {bonuses}
        </div>
        <div className="tapCounter">
          <div className="tapCounterIndicator"></div>
          <div className="tapCounterIndicatorValue">
            {this.state.tapCounter}
          </div>
        </div>
        <div className={"countdown display " + (time < 10 ? " warning" : "")}>
          <CircularProgress value={1 - time / this.state.game1.gameDuration}>
            {time}
          </CircularProgress>
        </div>
        <div
          className={
            "score display" + (this.state.scoreAdded ? " impulse" : "")
          }
        >
          <div className="score-decor spin duraton20s"></div>
          {this.state.score}
        </div>
        <div
          className="pageOverlay"
          style={{
            visibility: this.state.finished ? "visible" : "hidden",
            opacity: this.state.finished ? 1 : 0,
            transitionDuration: this.state.game1.stopDuration + "ms",
          }}
        ></div>
      </div>
    );
  }
}

export default Game3Page;
