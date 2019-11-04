'use strict';

(function () {
  window.TITLE = ['title1', 'title2', 'title3', 'title4', 'title5', 'title6', 'title7', 'title8'];
  window.TYPE = ['palace', 'flat', 'house', 'bungalo'];
  window.MIN_ROOMS = 1;
  window.MAX_ROOMS = 3;
  window.MIN_GUESTS = 0;
  window.MAX_GUESTS = 2;
  window.CHECKIN = ['12:00', '13:00', '14:00'];
  window.CHECKOUT = ['12:00', '13:00', '14:00'];
  window.MIN_PRICE = 0;
  window.MAX_PRICE = 1000000;
  window.FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  window.DESCRIPTION = ['description1', 'description2', 'description3', 'description4', 'description5', 'description6', 'description7', 'description8'];
  window.PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  window.PIN_WIDTH = 62;
  window.PIN_HEIGHT = 62;
  window.MIN_X = 320;
  window.MAX_X = 1200;
  window.MIN_Y = 130;
  window.MAX_Y = 630;
  window.MIN_AVATAR_NUMBER = 1;
  window.QUANTITY = 8;
  window.ENTER_KEYCODE = 13;
  window.ESC_KEYCODE = 27;
  window.LOCATION_X_PIN = 570;
  window.LOCATION_Y_PIN = 375;
  window.PIN_HEIGHT_POINTER = 22;
  window.ErrorText = {
    GUESTS: 'Количество гостей должно быть меньше или равно количеству комнат',
    NOT_GUESTS: 'Такие большие помещения не для гостей',
    VALUE_GUESTS: 'Укажите количество гостей',
    FLAT_MIN_PRICE: 'Минимальная цена за ночь для квартиры - 1000 руб.',
    HOUSE_MIN_PRICE: 'Минимальная цена за ночь для дома - 5000 руб.',
    PALACE_MIN_PRICE: 'Минимальная цена за ночь для дворца - 10000 руб.'
  };

  //  Возвращает случайное число из массива
  window.getRandomElement = function (elements) {
    var max = elements.length;
    var randomIndex = Math.round(Math.random() * (max - 1));
    return elements[randomIndex];
  };
  //  Возвращает случайное число из интервала
  window.getRandomIntFromInterval = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  //  Возвращает новый случайный массив
  window.getRandomArr = function (elements) {
    var newArrays = [];
    var arrMin = 1;
    var arrMAx = elements.length;
    for (var i = 0; i < window.getRandomIntFromInterval(arrMin, arrMAx); i++) {
      newArrays.push(elements[i]);
    }
    return newArrays;
  };
})();
