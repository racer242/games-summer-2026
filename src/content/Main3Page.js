import React, { Component } from "react";
import { setStoreData } from "../actions/appActions";
import "../css/content3.css";

class Main3Page extends Component {
  constructor(props) {
    super(props);
    this.store = this.props.store;
    if (this.store) {
      this.state = {
        ...this.store.getState(),
      };
    } else this.state = {};

    this.startButton_clickHandler = this.startButton_clickHandler.bind(this);
    this.signUpWarning_clickHandler =
      this.signUpWarning_clickHandler.bind(this);
  }

  startButton_clickHandler(event) {
    this.store.dispatch(
      setStoreData({
        currentPage: "game",
      }),
    );
  }

  signUpWarning_clickHandler(event) {
    if (this.state.signUpHandler) {
      this.state.signUpHandler();
    }
  }

  render() {
    let children = [];
    children.push(this.props.children);

    return (
      <div className="mainPage common g3">
        <div className="pageBg">
          <div className="ray ray8 rayAnimation">
            <div className="rayBody rayBody8"></div>
          </div>
          <div className="ray ray2 rayAnimation">
            <div className="rayBody rayBody2"></div>
          </div>
          <div className="ray ray3 rayAnimation">
            <div className="rayBody rayBody3"></div>
          </div>
          <div className="ray ray5 rayAnimation">
            <div className="rayBody rayBody5"></div>
          </div>
          <div className="ray ray6 rayAnimation">
            <div className="rayBody rayBody6"></div>
          </div>
          <div className="ray ray7 rayAnimation flipped">
            <div className="rayBody rayBody7"></div>
          </div>
          <div className="ray ray9 rayAnimation flipped">
            <div className="rayBody rayBody9"></div>
          </div>
          <div className="ray ray12 rayAnimation flipped">
            <div className="rayBody rayBody12"></div>
          </div>
          <div className="ray ray11 rayAnimation">
            <div className="rayBody rayBody11"></div>
          </div>
          <div className="ray ray4 rayAnimation flipped">
            <div className="rayBody rayBody4"></div>
          </div>
          <div className="ray ray10 rayAnimation flipped">
            <div className="rayBody rayBody10"></div>
          </div>
          <div className="ray ray1 rayAnimation flipped">
            <div className="rayBody rayBody1"></div>
          </div>
        </div>
        <div className="head appear-zoom">
          <div className="logo-bg breathing"></div>
          <div className="logo-item spin"></div>
          <div className="logo floating"></div>
          <h1 className="caps">Тапай к фестивалю</h1>
        </div>
        <div className="plate appear-top delay500ms">
          <h3>
            Тапай банку, извлекай паттерны музыкальных стилей и набирай очки.
          </h3>
          <p>
            Натапай банку как можно больше раз за отведенное время, за каждые
            100 тапов получай +10 очков. Также тапай дополнительные предметы и
            получай +2 очка за каждый.
            <br />
            <br />
            Время игры – 60&nbsp;секунд.
          </p>
        </div>
        <div
          className="primary-button button-large appear-bottom delay1s"
          onClick={this.startButton_clickHandler}
        >
          Играть
        </div>

        {this.state.userNotAuthorized && !this.state.activityIsOver && (
          <div
            className="signUpWarning appear-zoom"
            onClick={this.signUpWarning_clickHandler}
          >
            <span className="signUpLink">Зарегистрируйся</span> в Акции, чтобы
            сохранить результат игры
          </div>
        )}
      </div>
    );
  }
}

export default Main3Page;
