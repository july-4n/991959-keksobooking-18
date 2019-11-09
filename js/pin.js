'use strict';

(function () {

  // var TITLE = ['title1', 'title2', 'title3', 'title4', 'title5', 'title6', 'title7', 'title8'];
  // var TYPE = ['palace', 'flat', 'house', 'bungalo'];
  // var MIN_ROOMS = 1;
  // var MAX_ROOMS = 3;
  // var MIN_GUESTS = 0;
  // var MAX_GUESTS = 2;
  // var CHECKIN = ['12:00', '13:00', '14:00'];
  // var CHECKOUT = ['12:00', '13:00', '14:00'];
  // var MIN_PRICE = 0;
  // var MAX_PRICE = 1000000;
  // var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  // var DESCRIPTION = ['description1', 'description2', 'description3', 'description4', 'description5', 'description6', 'description7', 'description8'];
  // var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  // var MIN_AVATAR_NUMBER = 1;
  // var QUANTITY = 8;
  // var MIN_X = 320;
  // var MAX_X = 1200;
  // var MIN_Y = 130;
  // var MAX_Y = 630;

  //  нашли шаблон пинов, который будем копировать
  var similarPinTemplate = document.querySelector('#pin')
      .content
      .querySelector('.map__pin');

  //  создаем пин
  var renderPin = function (pin) {
    var element = similarPinTemplate.cloneNode(true);
    element.style.left = pin.location.x - window.form.PIN_WIDTH / 2 + 'px';
    element.style.top = pin.location.y - window.form.PIN_HEIGHT + 'px';
    element.querySelector('img').src = pin.author.avatar;
    element.querySelector('img').alt = pin.offer.title;

    return element;
  };
  var pinsArray;
  var successHandler = function (pinsFromResponse) {
    pinsArray = pinsFromResponse;
    window.map.renderPins(pinsArray);
  };

  var activatePins = function () {
    window.backend.load(successHandler, window.backend.errorHandler);
  };

  window.pin = {
    activatePins: activatePins,
    renderPin: renderPin
  };
})();
