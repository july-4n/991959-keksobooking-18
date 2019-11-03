'use strict';

(function () {

  // Обработчик нажатия на пин
  function createClickPinHandler(index) {

    //  Обработка нажатия на пин
    var clickPinHandler = function () {
      var pin = window.pin.pinsArr[index];
      var child = window.card.renderCardElement(pin);
      var oldChild = window.map.lastChild;

      var popupCheck = function () {
        var popupClose = document.querySelector('.popup__close');
        return popupClose;
      };

      //  проверяем наличие popup чтобы убедиться, что окно открыто
      //  если popupClose существует, т.е. не равен null - делаем замену
      if (popupCheck() !== null) {
        window.map.replaceChild(child, oldChild);
      } else {
      //  если popupClose не существует, т.е. равен null - делаем добавление
        window.map.appendChild(child);
      }

      // по клику на крестик
      popupCheck().addEventListener('click', function () {
        removeCard();
        //  window.map.removeChild(child);
      });

      var onDocumentKeyupPopup = function (evt) {
        if (evt.keyCode === window.ESC_KEYCODE) {
          removeCard();
        }
      };

      var removeCard = function () {
      // Карточку берем из замыкания модуля
      // Если ее нет, то ничего не делать
        if (!child) {
          return;
        }
        // Удаляем карточку
        window.map.removeChild(child);
        // Снимаем обработчик с document
        document.removeEventListener('keyup', onDocumentKeyupPopup);
      };
      document.addEventListener('keyup', onDocumentKeyupPopup);
    };
    return clickPinHandler;
  }

  window.renderPins = function (pins) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < pins.length; i++) {
      var pin = pins[i];
      var element = document.createElement('div');
      element.classList.add('pin');
      var pinClickHandler = createClickPinHandler(i);
      element.addEventListener('click', pinClickHandler);
      var renderedPin = window.pin.renderPin(pin);
      element.appendChild(renderedPin);
      fragment.appendChild(element);
    }
    window.card.mapTop.appendChild(fragment);
  };
})();
