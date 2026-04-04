import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// Внутренняя переменная для хранения экземпляра root
let appRoot = null;

/**
 * Инициализация приложения
 */
const initApp = () => {
  const rootElement = window.getAppRoot?.();
  if (!rootElement) {
    console.error("Корневой элемент #root не найден в DOM");
    return null;
  }

  // Очищаем контейнер перед рендерингом
  rootElement.innerHTML = "";

  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <App
        id="brandApp"
        onInit={window[rootElement.getAttribute("oninit")]}
        onImage={window[rootElement.getAttribute("onimage")]}
        onImages={window[rootElement.getAttribute("onimages")]}
      />
    </React.StrictMode>,
  );

  appRoot = root;
  return root;
};

/**
 * Активировать приложение (рендеринг)
 */
window.activateGameApp = () => {
  if (!appRoot) {
    initApp();
  }
};

/**
 * Деактивировать приложение (очистка контейнера)
 */
window.deactivateGameApp = () => {
  appRoot?.unmount();

  const rootElement = window.getAppRoot?.();
  if (rootElement) {
    rootElement.innerHTML = "";
  }
  appRoot = null;
};

/**
 * Перезапустить приложение
 */
window.restartGameApp = () => {
  window.deactivateGameApp();
  setTimeout(window.activateGameApp, 0);
};
