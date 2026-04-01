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
      notes: [],
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
    let notes = this.state.notes;
    let bonuses = this.state.bonuses;
    let scoreAdded = this.state.scoreAdded;
    let tapAdded = this.state.tapAdded;

    notes = notes.filter((v) => v.status != "note-destroy");
    for (const note of notes) {
      if (note.status == "note-show") {
        note.life--;
        if (note.life < 0) {
          note.status = "note-destroy";
        }
      }
      if (note.status == "note-on") {
        note.status = "note-show";
        note.cssX = note.cssDestX;
        note.cssY = note.cssDestY;
        note.scale = 1.3;
        note.rotate = 360 - Math.random() * 720;
        note.life = this.state.game3.noteLife;
      }
    }

    objects = objects.filter((v) => v.status != "obj-destroy");
    for (const obj of objects) {
      if (obj.status == "obj-show") {
        obj.life--;
        if (obj.life < 0) {
          obj.status = "obj-destroy";
        }
      }
      if (obj.status == "obj-on") {
        obj.status = "obj-show";
        obj.cssX = obj.cssDestX;
        obj.cssY = obj.cssDestY;
        obj.scale = this.props.bounds.mobileSize ? 1 : 1.5;
        obj.rotate = 360 - Math.random() * 720;
        obj.life = this.state.game3.objectLife;
      }
    }

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
      notes,
      bonuses,
      scoreAdded,
      tapAdded,
    });
    return true;
  }

  can_clickHandler(event) {
    let objId = event.currentTarget?.id;
    let isObject = objId?.indexOf("obj") >= 0;

    let objs = this.state.objects.filter((v) => v.id === objId);
    let obj = objs?.length ? objs[0] : null;

    let parentNode = event.currentTarget.parentNode;
    let clientX = event.clientX;
    let clientY = event.clientY;
    if (!this.tapThrottling) {
      this.doClick(parentNode, clientX, clientY, isObject, obj);
      this.tapThrottling = true;
      clearTimeout(this.tapTimeout);
    }
    this.tapTimeout = setTimeout(() => {
      this.tapThrottling = false;
    }, this.state.game3.tapThrottlingDelay);
  }

  doClick(parentNode, clientX, clientY, isObject, obj) {
    if (this.state.finished) return;
    let taps = this.state.taps;
    let notes = this.state.notes;
    let objects = this.state.objects;
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

    if (tapCounter % this.state.game3.stripeAddCount === 0) {
      stripesAmount++;
    }

    if (tapCounter % this.state.game3.tapBonusCount === 0) {
      bonuses.push({
        id: "bonus" + this.counter++,
        cssX: x + this.state.game3.bonusBounds.width,
        cssY: y,
        value: this.state.game3.bonusValue,
        status: "bonus-on",
        delay: isObject,
      });
      score += this.state.game3.bonusValue;
      scoreAdded = true;
    }

    if (isObject) {
      bonuses.push({
        id: "bonus" + this.counter++,
        cssX: x + this.state.game3.bonusBounds.width,
        cssY: y,
        value: this.state.game3.objectBonusValue,
        status: "bonus-on",
      });
      score += this.state.game3.objectBonusValue;
      scoreAdded = true;
      obj.status = "obj-destroy";
    }

    taps.push({
      id: "tap" + this.counter++,
      cssX: x,
      cssY: y,
      status: "tap-on",
      seed: Math.random() * 180,
    });

    if (!isObject && tapCounter % this.state.game3.noteCreateCount === 0) {
      notes.push({
        id: "note" + this.counter++,
        cssX: x - this.state.game3.noteBounds.width / 2,
        cssY: y - this.state.game3.noteBounds.width / 2,
        cssDestX: Math.random() >= 0.5 ? "-20%" : "110%",
        cssDestY: Math.random() * 100 + "%",
        scale: 0.3,
        rotate: 0,
        status: "note-on",
        ...this.state.game3.noteSources[
          Math.floor(this.state.game3.noteSources.length * Math.random())
        ],
      });
    }

    if (!isObject && tapCounter % this.state.game3.objectCreateCount === 0) {
      let source =
        this.state.game3.objSources[
          Math.floor(this.state.game3.objSources.length * Math.random())
        ];
      objects.push({
        id: "obj" + this.counter++,
        cssX: x - source.w / 2,
        cssY: y - source.h / 2,
        cssDestX:
          Math.random() >= 0.5
            ? this.props.bounds.mobileSize
              ? "-40%"
              : "-20%"
            : "110%",
        cssDestY: Math.random() * 100 + "%",
        scale: this.props.bounds.mobileSize ? 0.3 : 0.5,
        rotate: 0,
        status: "obj-on",
        ...source,
      });
    }

    this.setState({
      ...this.state,
      taps,
      notes,
      objects,
      tapCounter,
      tapAdded: !isObject,
      stripesAmount,
      bonuses,
      score,
      scoreAdded,
    });
  }

  render() {
    let objects = [];
    let bonuses = [];
    let taps = [];
    let notes = [];

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

    for (let i = 0; i < this.state.notes.length; i++) {
      let note = this.state.notes[i];
      notes.push(
        <div
          key={note.id}
          id={note.id}
          className="note"
          style={{
            left: note.cssX,
            top: note.cssY,
            backgroundImage: "url(" + note.src + ")",
            transform:
              "scale(" + note.scale + ") rotate(" + note.rotate + "deg)",
          }}
        ></div>,
      );
    }

    for (let i = 0; i < this.state.objects.length; i++) {
      let obj = this.state.objects[i];
      objects.push(
        <div
          key={obj.id}
          id={obj.id}
          className="object"
          style={{
            pointerEvents: obj.status === "obj-show" ? "all" : "none",
            cursor: obj.status === "obj-show" ? "pointer" : "default",
            left: obj.cssX,
            top: obj.cssY,
            width: obj.w,
            height: obj.h,
            backgroundImage: "url(" + obj.src + ")",
            transform: "scale(" + obj.scale + ") rotate(" + obj.rotate + "deg)",
          }}
          onPointerDown={this.can_clickHandler}
        ></div>,
      );
    }

    for (let i = 0; i < this.state.bonuses.length; i++) {
      let bonus = this.state.bonuses[i];
      bonuses.push(
        <div key={bonus.id}>
          <div
            className={
              "bonus-box bonusUp display" + (bonus.delay ? " delay500ms" : "")
            }
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
          {notes}
          {objects}
          <div
            className={
              "can can" +
              this.state.canId +
              (this.state.tapAdded ? " canImpulse" : "")
            }
            onPointerDown={this.can_clickHandler}
          ></div>
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
