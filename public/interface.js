// Этот файл содержит всё для взаимодействия с окружением

// В index.html - пример размещения приложения в контейнере на странице
// Приложение загружается в тег с id="root"
// класс game нужен для изолирования базовых стилей
// <div id="container" style="position: absolute;left:100px;top:100px;right: 100px; bottom: 100px;">
//   <div id="root" class="game" oninit="onAppReadyHandler"></div>
// </div>

// Установить название игры.
// Просто переменная - используется внутри этого файла для удобства,
// передается ниже в конфигурацию, сама на приложение не влияет
window.gameId = "DJ"; //"VIBE"; //"DJ"; //"TAP";

// Указать, авторизован пользователь или нет
// Просто переменная - используется внутри этого файла для удобства,
// передается ниже в конфигурацию, сама на приложение не влияет
window.userAuthorized = true; //true; false;

// Указать, был ли зарегистрирован код или нет
// Просто переменная - используется внутри этого файла для удобства,
// передается ниже в конфигурацию, сама на приложение не влияет
window.codeRegistered = true; //true; false;

// Указать, закончилась ли акция или нет
// Просто переменная - используется внутри этого файла для удобства,
// передается ниже в конфигурацию, сама на приложение не влияет
window.activityIsOver = false; //true; false;

// Также функция для использования внутри этого файла, заглушка
// Имитирует закрытие попапа с игрой
window.closeGamePopup = function () {
  console.log("closeGamePopup");
};

// Также функция для использования внутри этого файла, заглушка
// Имитирует переход к регистрации чека
window.registerBill = function () {
  console.log("registerBill");
};

// Также функция для использования внутри этого файла, заглушка
// Имитирует переход к регистрации пользователя
window.signUp = function () {
  console.log("signUp");
};

// Также функция для использования внутри этого файла, заглушка
// Имитирует вызов тостера при событии, когда пользователь нажал Играть
// без подтверждения
window.playWithoutConfirmation = function () {
  console.log("playWithoutConfirmation");
};

// Также функция для использования внутри этого файла, заглушка
// Имитирует запуск игры
window.onGameStart = function () {
  console.log("onGameStart");
};

// Также функция для использования внутри этого файла, заглушка
// Имитирует окончание игры
window.onGameFinish = function () {
  console.log("onGameFinish");
};

/**
 * Возвращает корневой элемент для рендеринга приложения
 */
window.getAppRoot = function () {
  return document.getElementById("game");
};

/**
 * Функция активизации приложения (создается при инициализации приложения)
 */
window.activateGameApp = null;

/**
 * Функция деактивизации приложения (создается при инициализации приложения)
 */
window.deactivateGameApp = null;

/**
 * Функция рестарта приложения (создается при инициализации приложения)
 */
window.restartGameApp = null;

// Функция инициализации приложения. Вызывается из обработчика в Index.html,
// см. <div id="root" class="game" oninit="onAppReadyHandler">
function onAppReadyHandler(app) {
  // Функция обработки ресайза страницы.
  // Берется элемент-контейнер и передается его размер в приложение.
  // Это как пример, реализация может быть любой, главное, передать размеры для приложения
  function updateLayout() {
    var container = document.getElementById("container");
    app.resize(container.clientWidth, container.clientHeight);
  }
  updateLayout();

  // Инициализация веб-страницы
  // Обновление размеров приложения при готовности страницы
  function initHandler() {
    updateLayout();
  }

  // Ресайз веб-страницы
  // Обновление размеров приложения при ресайзе страницы
  function resizeHandler() {
    updateLayout();
  }

  // Подписываемся на события изменения, чтобы вызывать updateLayout
  // Обновление размеров приложения можно делать и иначе -
  // здесь просто пример использования
  window.addEventListener("load", initHandler);
  window.addEventListener("resize", resizeHandler);

  // Настройки приложения
  var data = {
    // Это список настроек для обмена данными игр
    games: {
      // id - для передачи кода игры
      // request1 - запрос до старта
      // request2 - запрос после старта
      // Чтобы игра передавала данные, надо закомментированные строчки открыть, и закрыть строчки с заглушками
      1: {
        id: "VIBE",
        // request1: { url: "/api/TentGame", method: "POST" },
        request1: { url: "/api/TentGame1.json", method: "GET" },
        // request2: { url: "/api/TentGame", method: "POST" },
        request2: { url: "/api/TentGame2.json", method: "GET" },
      },
      2: {
        id: "DJ",
        // request1: { url: "/api/TentGame", method: "POST" },
        request1: { url: "/api/TentGame1.json", method: "GET" },
        // request2: { url: "/api/TentGame", method: "POST" },
        request2: { url: "/api/TentGame2.json", method: "GET" },
      },
      3: {
        id: "TAP",
        // request1: { url: "/api/TentGame", method: "POST" },
        request1: { url: "/api/TentGame1.json", method: "GET" },
        // request2: { url: "/api/TentGame", method: "POST" },
        request2: { url: "/api/TentGame2.json", method: "GET" },
      },

      // Это индекс игр для быстрой идентификации внутри приложения
      index: { VIBE: 1, DJ: 2, TAP: 3 },
    },
    // Обработчик закрытия попапа
    closeHandler: window.closeGamePopup,
    // Обработчик перехода к регистрации чека
    registerHandler: window.registerBill,
    // Обработчик перехода к регистрации пользователя
    signUpHandler: window.signUp,
    // Обработчик попытки игры без подтверждения
    playWithoutConfirmation: window.playWithoutConfirmation,
    // Значение ширины окна, при котором происходит переключение на мобильную версию
    switchToMobileWidth: 720,
    // Указать, авторизован пользователь или нет
    userNotAuthorized: !window.userAuthorized,
    // Указать, Зарегистрирован код или нет
    codeNotRegistered: !window.codeRegistered,
    // Указать, действует ли еще акция или нет
    activityIsOver: window.activityIsOver,
    gameStartHandler: window.onGameStart,
    gameFinishHandler: window.onGameFinish,
  };

  // Передается номер текущей игры (внутри приложения игры идентифицируются по номерам)
  data.gameIndex = data.games.index[window.gameId];
  // Передаются данные текущей игры
  data.gameData = data.games[data.gameIndex];

  app.setData(data);
}
