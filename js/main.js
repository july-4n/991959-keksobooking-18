'use strict';

var getRandomElement = function (arr) {
  var max = arr.length;
  var randomElement = Math.round(Math.random() * (max - 1));
  return arr[randomElement];
};

var getRandomIntFromInterval = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var title = ['title1', 'title2', 'title3', 'title4', 'title5', 'title6', 'title7', 'title8'];
var type = ['palace', 'flat', 'house', 'bungalo'];
var minRooms = 1;
var maxRooms = 3;
var minGuests = 0;
var maxGuests = 2;
var checkin = ['12:00', '13:00', '14:00'];
var checkout = ['12:00', '13:00', '14:00'];
var minPrice = 0;
var maxPrice = 1000000;
var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var description = ['description1', 'description2', 'description3', 'description4', 'description5', 'description6', 'description7', 'description8'];
var photos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
//  var mapWidth = document.querySelector('.map__pins');
//  var pin = document.querySelector('.map__pin--main');
var minX = 300;
var maxX = 500;
//  var maxX = mapWidth.offsetWidth - pin.offsetWidth/2;
var minY = 130;
var maxY = 630;
var quantity = 8;

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

  for (var i = 0; i < quantity; i++) {
    var author = {
      avatar: 'img/avatars/user0' + getRandomIntFromInterval(1, 8) + '.png'
    };
    var offer = {
      title: getRandomElement(title),
      address: getRandomIntFromInterval(minX, maxX) + ',' + '' + getRandomIntFromInterval(minY, maxY),
      price: getRandomIntFromInterval(minPrice, maxPrice),
      type: getRandomElement(type),
      rooms: getRandomIntFromInterval(minRooms, maxRooms),
      guests: getRandomIntFromInterval(minGuests, maxGuests),
      checkin: getRandomElement(checkin),
      checkout: getRandomElement(checkout),
      features: getRandomArr(features),
      description: getRandomElement(description),
      photos: getRandomArr(photos)
    };
    var location = {
      x: getRandomIntFromInterval(300, 500),
      y: getRandomIntFromInterval(130, 630)
    };
    pins.push(author, offer, location[i]);
  }
  return pins;
};

getArray(quantity);

// переключение карты из неактивного состояния в активное
var map = document.querySelector('.map');
map.classList.remove('map--faded');
// шаблон
// var similarPinTemplate = document.querySelector('#pin')
//     .content
//     .querySelector('.map__pin');

// var renderPins = function () {
//   var pin = similarPinTemplate.cloneNode(true);
//   pin.setAttribute('style', 'left: ' + pin.location.x + 'px; top: ' + pin.location.y + 'px;');
//   pin.querySelector('img').src = pin.author.avatar;
//   pin.querySelector('img').alt = pin.offer.title;
//
//   return pin;
//   };
