'use strict';

(function () {
  var QUANTITY = 5;

  var mapElement = document.querySelector('.map');
  // Находит элемент, в который мы будем вставлять похожие объявления
  var mapTopElement = document.querySelector('.map__pins');
  var renderedCard;

  var removeCard = function () {
    //  вместе с карточкой удаляем map__pin--active с пина
    var pinActiveElement = document.querySelector('.map__pin--active');
    if (pinActiveElement !== null) {
      pinActiveElement.classList.remove('map__pin--active');
    }
    //  Карточку берем из замыкания модуля
    //  Если ее нет, то ничего не делать
    if (!renderedCard) {
      return;
    }
    // Удаляем карточку
    mapElement.removeChild(renderedCard);
    renderedCard = null;
    // Снимаем обработчик с document
    document.removeEventListener('keyup', onDocumentKeyup);
  };

  var onDocumentKeyup = function (evt) {
    if (window.utils.isEsc(evt)) {
      removeCard();
    }
  };

  // Функция создания обработчика на пин
  var createOnPinClick = function (pin) {

    //  Обработка нажатия на пин
    var onPinClick = function (evt) {
      removeCard();
      renderedCard = window.card.render(pin);
      mapElement.appendChild(renderedCard);
      evt.currentTarget.classList.add('map__pin--active');

      var closeButtonElement = renderedCard.querySelector('.popup__close');

      // по клику на крестик
      closeButtonElement.addEventListener('click', function () {
        removeCard();
      });
      document.addEventListener('keyup', onDocumentKeyup);
    };
    return onPinClick;
  };

  var renderPins = function (pins) {
    // записываем весь массив в переменную чтоб можно было рисовать и удалять карточки
    var fragment = document.createDocumentFragment();
    var slicedPins = pins.slice(0, QUANTITY);

    slicedPins.forEach(function (pin) {
      var element = document.createElement('div');
      element.classList.add('pin');
      var onPinClick = createOnPinClick(pin);
      element.addEventListener('click', onPinClick);
      var renderedPin = window.pin.renderPin(pin);
      element.appendChild(renderedPin);
      fragment.appendChild(element);
    });
    mapTopElement.appendChild(fragment);
  };

  window.map = {
    element: mapElement,
    renderPins: renderPins,
    removeCard: removeCard,
  };
})();
