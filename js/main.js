'use strict';

var TITLE = ['title1', 'title2', 'title3', 'title4', 'title5', 'title6', 'title7', 'title8'];
var TYPE = ['palace', 'flat', 'house', 'bungalo'];
var MIN_ROOMS = 1;
var MAX_ROOMS = 3;
var MIN_GUESTS = 0;
var MAX_GUESTS = 2;
var CHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = ['12:00', '13:00', '14:00'];
var MIN_PRICE = 0;
var MAX_PRICE = 1000000;
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var DESCRIPTION = ['description1', 'description2', 'description3', 'description4', 'description5', 'description6', 'description7', 'description8'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var PIN_WIDTH = 40;
var PIN_HEIGHT = 44;
var MIN_X = 320;
var MAX_X = 1200;
var MIN_Y = 130;
var MAX_Y = 630;
var QUANTITY = 8;

//  возвращает случайное число из массива
var getRandomElement = function (elements) {
  var max = elements.length;
  var randomIndex = Math.round(Math.random() * (max - 1));
  return elements[randomIndex];
};
//  возвращает случайное число из интервала
var getRandomIntFromInterval = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
//  возвращает новый случайный массив
var getRandomArr = function (arrLength) {
  var newArr = [];
  var arrMin = 1;
  var arrMAx = arrLength.length;
  for (var i = 0; i < getRandomIntFromInterval(arrMin, arrMAx); i++) {
    newArr.push(arrLength[i]);
  }
  return newArr;
};

var getArray = function () {
  var pins = [];

  for (var i = 0; i < QUANTITY; i++) {
    var author = {
      avatar: 'img/avatars/user0' + getRandomIntFromInterval(1, QUANTITY) + '.png'
    };

    var location = {
      x: getRandomIntFromInterval(MIN_X, MAX_X),
      y: getRandomIntFromInterval(MIN_Y, MAX_Y)
    };

    var offer = {
      title: getRandomElement(TITLE),
      address: location.x + ', ' + location.y,
      price: getRandomIntFromInterval(MIN_PRICE, MAX_PRICE),
      type: getRandomElement(TYPE),
      rooms: getRandomIntFromInterval(MIN_ROOMS, MAX_ROOMS),
      guests: getRandomIntFromInterval(MIN_GUESTS, MAX_GUESTS),
      checkin: getRandomElement(CHECKIN),
      checkout: getRandomElement(CHECKOUT),
      features: getRandomArr(FEATURES),
      description: getRandomElement(DESCRIPTION),
      photos: getRandomArr(PHOTOS)
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

// переключение карты из неактивного состояния в активное
var map = document.querySelector('.map');
map.classList.remove('map--faded');

//  нашли шаблон пинов, который будем копировать
var similarPinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');

//  создаем пин
var renderPin = function (pin) {
  var element = similarPinTemplate.cloneNode(true);
  element.style.left = pin.location.x - PIN_WIDTH / 2 + 'px';
  element.style.top = pin.location.y - PIN_HEIGHT + 'px';
  element.querySelector('img').src = pin.author.avatar;
  element.querySelector('img').alt = pin.offer.title;

  return element;
};

var mapTop = document.querySelector('.map__pins');

var pinsArr = getArray();
//  console.log(pins);

var renderPins = function (pins) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < pins.length; i++) {
    var element = renderPin(pins[i]);
    fragment.appendChild(element);
  }
  mapTop.appendChild(fragment);
};

renderPins(pinsArr);
