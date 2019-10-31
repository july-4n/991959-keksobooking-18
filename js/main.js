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
var PIN_WIDTH = 62;
var PIN_HEIGHT = 62;
var MIN_X = 320;
var MAX_X = 1200;
var MIN_Y = 130;
var MAX_Y = 630;
var MIN_AVATAR_NUMBER = 1;
var QUANTITY = 8;
var ENTER_KEYCODE = 13;
var ESC_KEYCODE = 27;
var LOCATION_X_PIN = 570;
var LOCATION_Y_PIN = 375;
var PIN_HEIGHT_POINTER = 22;
var ErrorText = {
  GUESTS: 'Количество гостей должно быть меньше или равно количеству комнат',
  NOT_GUESTS: 'Такие большие помещения не для гостей',
  VALUE_GUESTS: 'Укажите количество гостей',
  FLAT_MIN_PRICE: 'Минимальная цена за ночь для квартиры - 1000 руб.',
  HOUSE_MIN_PRICE: 'Минимальная цена за ночь для дома - 5000 руб.',
  PALACE_MIN_PRICE: 'Минимальная цена за ночь для дворца - 10000 руб.'
};

//  Возвращает случайное число из массива
var getRandomElement = function (elements) {
  var max = elements.length;
  var randomIndex = Math.round(Math.random() * (max - 1));
  return elements[randomIndex];
};
//  Возвращает случайное число из интервала
var getRandomIntFromInterval = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
//  Возвращает новый случайный массив
var getRandomArr = function (elements) {
  var newArrays = [];
  var arrMin = 1;
  var arrMAx = elements.length;
  for (var i = 0; i < getRandomIntFromInterval(arrMin, arrMAx); i++) {
    newArrays.push(elements[i]);
  }
  return newArrays;
};

var getArray = function () {
  var pins = [];

  for (var i = 0; i < QUANTITY; i++) {
    var author = {
      avatar: 'img/avatars/user0' + getRandomIntFromInterval(MIN_AVATAR_NUMBER, QUANTITY) + '.png'
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

// Находит элемент, в который мы будем вставлять похожие объявления
var mapTop = document.querySelector('.map__pins');

var pinsArr = getArray();

// Обработчик нажатия на пин
function createClickPinHandler(index) {
//  Обработка нажатия на пин
  var clickPinHandler = function () {

    var popupCheck = function () {
      var popupClose = document.querySelector('.popup__close');
      return popupClose;
    };

    var pin = pinsArr[index];
    var child = renderCardElement(pin);
    //  проверяем наличие popup чтобы убедиться, что окно открыто
    //  если popupClose существует, т.е. не равен null - делаем замену
    if (popupCheck() !== null) {
      map.replaceChild(child, map.lastChild);
    } else {
    // если popupClose не существует, т.е. равен null - делаем добавление
      map.appendChild(child);
    }

    // по клику на крестик
    popupCheck().addEventListener('click', function () {
      map.removeChild(child);
    });

    document.addEventListener('keyup', function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        // если popupClose существует, т.е. не равен null - удаляем lastChild
        if (popupCheck() !== null) {
          map.removeChild(map.lastChild);
        }
      }
    });
  };
  return clickPinHandler;
}

var renderPins = function (pins) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < pins.length; i++) {
    var pin = pins[i];
    var element = document.createElement('div');
    element.classList.add('pin');
    var pinClickHandler = createClickPinHandler(i);
    element.addEventListener('click', pinClickHandler);
    var renderedPin = renderPin(pin);
    element.appendChild(renderedPin);
    fragment.appendChild(element);
  }
  mapTop.appendChild(fragment);
};

var cardTemplate = document.querySelector('#card')
  .content
  .querySelector('.popup');

//  тип жилья
var element = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец'
};

//  Функция для отрисовки фотографий
var renderPhotos = function (cardElement, pin) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < pin.offer.photos.length; i++) {
    var img = document.createElement('img');
    img.classList.add('popup__photo');
    img.src = pin.offer.photos[i];
    img.width = 45;
    img.height = 40;

    fragment.appendChild(img);
  }
  cardElement.appendChild(fragment);
};

//  Отрисовка модального окна с объявлением
var renderCardElement = function (pin) {
  var cardElement = cardTemplate.cloneNode(true);
  cardElement.querySelector('.popup__title').textContent = pin.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = pin.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = pin.offer.price + '₽/ночь';
  cardElement.querySelector('.popup__type').textContent = element[pin.offer.type];
  cardElement.querySelector('.popup__text--capacity').textContent = pin.offer.rooms + ' комнаты для ' + pin.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + pin.offer.checkin + ', выезд до ' + pin.offer.checkout;
  cardElement.querySelector('.popup__features').textContent = pin.offer.features;
  cardElement.querySelector('.popup__description').textContent = pin.offer.description;
  cardElement.querySelector('.popup__avatar').src = pin.author.avatar;
  cardElement.querySelector('.popup__photos').src = renderPhotos(cardElement, pin);
  return cardElement;
};

var map = document.querySelector('.map');
var mapFiltersContainer = document.querySelector('.map__filters-container');
var mapFilters = document.querySelector('.map__filters');
var adForm = document.querySelector('.ad-form');
var address = document.querySelector('#address');

//  Определение адреса
var addressPassive = function () {
  var addressValue = (LOCATION_X_PIN + PIN_WIDTH / 2) + ', ' + (LOCATION_Y_PIN + PIN_HEIGHT / 2);
  return addressValue;
};

//  Определение адреса при активации
var addressActive = function () {
  var addressValue = (LOCATION_X_PIN + PIN_WIDTH / 2) + ', ' + (LOCATION_Y_PIN + (PIN_HEIGHT + PIN_HEIGHT_POINTER) / 2);
  return addressValue;
};

var disableElements = function (children, isDisabled) {
  for (var i = 0; i < children.length; i++) {
    children[i].disabled = isDisabled;
  }
};

//  Добавляем/убираем атрибут disabled в форму
var adFormDisabled = function (elem, isDisabled) {
  var fieldsets = elem.querySelectorAll('fieldset');
  var selects = elem.querySelectorAll('select');
  var buttons = elem.querySelectorAll('button');
  disableElements(fieldsets, isDisabled);
  disableElements(selects, isDisabled);
  disableElements(buttons, isDisabled);
  address.value = addressPassive();
};

adFormDisabled(adForm, true);
adFormDisabled(mapFiltersContainer, true);

//  Функция активации страницы
var adFormActivation = function () {
  adFormDisabled(adForm, false);
  adFormDisabled(mapFiltersContainer, false);
  adForm.classList.remove('ad-form--disabled');
  mapFilters.classList.remove('map__filters--disabled');
  renderPins(pinsArr);
};

var mapPinMain = document.querySelector('.map__pin--main');

// Обработчик активации страницы по клику
mapPinMain.addEventListener('mousedown', function () {
  adFormActivation();
  map.classList.remove('map--faded');
  address.value = addressActive();
});

//  Обработчик активации страницы по нажатию на Enter
mapPinMain.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    adFormActivation();
  }
});

//  Валидация
var guestsValue = adForm.querySelector('#capacity');
var roomsValue = adForm.querySelector('#room_number');
var adFormSubmit = adForm.querySelector('.ad-form__submit');
var inputPriceValue = adForm.querySelector('#price');
var inputTypeValue = adForm.querySelector('#type');
var inputTimeInValue = adForm.querySelector('#timein');
var inputTimeOutValue = adForm.querySelector('#timeout');

adFormSubmit.addEventListener('click', function () {
  var guestsNumber = guestsValue.value;
  var roomsNumber = roomsValue.value;
  var inputPrice = inputPriceValue.value;
  var inputType = inputTypeValue.value;


  if (roomsNumber === '100' && guestsNumber !== '0') {
    guestsValue.setCustomValidity(ErrorText.NOT_GUESTS);
  } else if (guestsNumber === '0' && roomsNumber !== '100') {
    guestsValue.setCustomValidity(ErrorText.VALUE_GUESTS);
  } else if (roomsNumber < guestsNumber) {
    guestsValue.setCustomValidity(ErrorText.GUESTS);
  } else {
    guestsValue.setCustomValidity('');
  }

  if (inputType === 'flat' && inputPrice < 1000) {
    inputPriceValue.setCustomValidity(ErrorText.FLAT_MIN_PRICE);
  } else if (inputType === 'house' && inputPrice < 5000) {
    inputPriceValue.setCustomValidity(ErrorText.HOUSE_MIN_PRICE);
  } else if (inputType === 'palace' && inputPrice < 10000) {
    inputPriceValue.setCustomValidity(ErrorText.PALACE_MIN_PRICE);
  } else {
    inputPriceValue.setCustomValidity('');
  }
});

//  Синхронизация времени заезда с временем выезда
inputTimeInValue.addEventListener('change', function () {
  inputTimeOutValue.value = inputTimeInValue.value;
});

//  Синхронизация времени выезда с временем заезда
inputTimeOutValue.addEventListener('change', function () {
  inputTimeInValue.value = inputTimeOutValue.value;
});
