'use strict';

(function () {

  window.pin.getArray = function () {
    var pins = [];

    for (var i = 0; i < window.QUANTITY; i++) {
      var author = {
        avatar: 'img/avatars/user0' + window.getRandomIntFromInterval(window.MIN_AVATAR_NUMBER, window.QUANTITY) + '.png'
      };

      var location = {
        x: window.getRandomIntFromInterval(window.MIN_X, window.MAX_X),
        y: window.getRandomIntFromInterval(window.MIN_Y, window.MAX_Y)
      };

      var offer = {
        title: window.getRandomElement(window.TITLE),
        address: location.x + ', ' + location.y,
        price: window.getRandomIntFromInterval(window.MIN_PRICE, window.MAX_PRICE),
        type: window.getRandomElement(window.TYPE),
        rooms: window.getRandomIntFromInterval(window.MIN_ROOMS, window.MAX_ROOMS),
        guests: window.getRandomIntFromInterval(window.MIN_GUESTS, window.MAX_GUESTS),
        checkin: window.getRandomElement(window.CHECKIN),
        checkout: window.getRandomElement(window.CHECKOUT),
        features: window.getRandomArr(window.FEATURES),
        description: window.getRandomElement(window.DESCRIPTION),
        photos: window.getRandomArr(window.PHOTOS)
      };

      var pin = {
        author: author,
        offer: offer,
        location: location
      };
      pins.push(pin);
    }
    return pins;
  };


  //  нашли шаблон пинов, который будем копировать
  var similarPinTemplate = document.querySelector('#pin')
      .content
      .querySelector('.map__pin');

  //  создаем пин
  window.pin.renderPin = function (pin) {
    var element = similarPinTemplate.cloneNode(true);
    element.style.left = pin.location.x - window.PIN_WIDTH / 2 + 'px';
    element.style.top = pin.location.y - window.PIN_HEIGHT + 'px';
    element.querySelector('img').src = pin.author.avatar;
    element.querySelector('img').alt = pin.offer.title;

    return element;
  };

  window.pin.pinsArr = window.pin.getArray();

})();
