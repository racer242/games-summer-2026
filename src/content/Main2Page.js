import React, { Component } from "react";
import { setStoreData } from "../actions/appActions";
import "../css/content2.css";

class Main2Page extends Component {
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
      <div className="mainPage common g2">
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
        <div className="head appear-zoom">
          <div className="logo-bg breathing"></div>
          <div className="logo-item spin"></div>
          <div className="logo floating"></div>
          <h1 className="caps">Диджей, зажигай</h1>
        </div>
        <div className="plate appear-top delay500ms">
          <h3>
            Стань диджеем, зажги танцпол, повтори последовательность на сэмплере
            и набирай очки.
          </h3>
          <p>
            Повтори все {this.state.game2.roundCount} последовательности из{" "}
            {this.state.game2.sequenceLength} загорающихся кнопок как можно
            быстрее, сколько секунд останется из {this.state.game2.gameDuration}{" "}
            - столько получишь очков. Время игры –{" "}
            {this.state.game2.gameDuration} секунд.
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

export default Main2Page;
