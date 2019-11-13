'use strict';

(function () {

  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var mapFilters = document.querySelector('.map__filters');
  var adForm = document.querySelector('.ad-form');
  var address = document.querySelector('#address');
  var LOCATION_X_PIN = 570;
  var LOCATION_Y_PIN = 375;
  var PIN_WIDTH = 62;
  var PIN_HEIGHT = 62;
  var PIN_HEIGHT_POINTER = 22;
  var ENTER_KEYCODE = 13;
  var X_MIN = 0;
  var X_MAX = 1200;
  var Y_MIN = 130;
  var Y_MAX = 630;
  var ErrorText = {
    GUESTS: 'Количество гостей должно быть меньше или равно количеству комнат',
    NOT_GUESTS: 'Такие большие помещения не для гостей',
    VALUE_GUESTS: 'Укажите количество гостей',
    FLAT_MIN_PRICE: 'Минимальная цена за ночь для квартиры - 1000 руб.',
    HOUSE_MIN_PRICE: 'Минимальная цена за ночь для дома - 5000 руб.',
    PALACE_MIN_PRICE: 'Минимальная цена за ночь для дворца - 10000 руб.'
  };
  var mapPinMain = document.querySelector('.map__pin--main');
  var mapOverlay = document.querySelector('.map__overlay');

  //  Функция заполнения поля адреса
  var addressField = function (pinX, pinY) {
    var addressValue = pinX + ', ' + pinY;
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
    if (isDisabled === false) {
      address.value = addressField((LOCATION_X_PIN + PIN_WIDTH / 2), (LOCATION_Y_PIN - PIN_HEIGHT / 2));
      adForm.classList.remove('ad-form--disabled');
      mapFilters.classList.remove('map__filters--disabled');
      window.pin.activatePins();
    }
    if (isDisabled === true) {
      address.value = addressField((LOCATION_X_PIN), (LOCATION_Y_PIN));
      adForm.classList.add('ad-form--disabled');
      mapFilters.classList.add('map__filters--disabled');
      window.map.element.classList.add('map--faded');
      window.pin.hideAllPins();
      if (document.querySelector('.popup') !== null) {
        window.pin.hidePopup();
      }
    }
  };

  adFormDisabled(adForm, true);
  adFormDisabled(mapFiltersContainer, true);

  //  Функция активации страницы
  var adFormActivation = function () {
    adFormDisabled(adForm, false);
    adFormDisabled(mapFiltersContainer, false);

  };

  // Обработчик активации страницы по клику

  // mapPinMain.addEventListener('mousedown', function () {
  //   adFormActivation();
  //   window.map.element.classList.remove('map--faded');
  // });

  //  Обработчик активации страницы по нажатию на Enter
  mapPinMain.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      adFormActivation();
      window.map.element.classList.remove('map--faded');
    }
  });

  var onSuccess = function () {
    window.backend.showSuccessMessage();
    window.form.adFormDisabled(window.form.adForm, true);
    adForm.reset();
    resetMainPin();
  };

  var onError = function () {
    window.backend.showErrorMessage();
  };

  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.sendRequest(onSuccess, onError, new FormData(adForm));
  });

  var resetMainPin = function () {
    mapPinMain.style.left = LOCATION_X_PIN + 'px';
    mapPinMain.style.top = LOCATION_Y_PIN + 'px';
    address.value = addressField((LOCATION_X_PIN), (LOCATION_Y_PIN));
  };

  //  Перетаскивание
  mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var dragged = false;
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var pinCoords = {
      x: mapPinMain.offsetLeft,
      y: mapPinMain.offsetTop
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      dragged = true;

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY,
      };

      //  функция расчета координат пина
      var coordsPin = function () {
        pinCoords = {
          x: mapPinMain.offsetLeft - shift.x,
          y: mapPinMain.offsetTop - shift.y
        };
      };
      coordsPin();

      //  Ограничения размеров
      if (pinCoords.x < X_MIN - PIN_WIDTH / 2) {
        pinCoords.x = mapOverlay.offsetLeft - PIN_WIDTH / 2;
      } else if (pinCoords.x > X_MAX - PIN_WIDTH / 2) {
        pinCoords.x = mapOverlay.offsetLeft + X_MAX - PIN_WIDTH / 2;
      }
      if (pinCoords.y < Y_MIN - PIN_HEIGHT * 2) {
        pinCoords.y = mapOverlay.offsetTop;
      } else if (pinCoords.y > Y_MAX) {
        pinCoords.y = mapOverlay.offsetTop + Y_MAX;
      }
      mapPinMain.style.left = (pinCoords.x) + 'px';
      mapPinMain.style.top = (pinCoords.y) + 'px';
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      //  Изменение поля адреса при отпускании кнопки мыши
      address.value = addressField(pinCoords.x, pinCoords.y + PIN_HEIGHT / 2 + PIN_HEIGHT_POINTER);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (!dragged || dragged && window.map.element.classList.contains('map--faded')) {
        var activateForm = function () {
          adFormActivation();
          window.map.element.classList.remove('map--faded');
          mapPinMain.removeEventListener('click', activateForm);
        };
        mapPinMain.addEventListener('click', activateForm);
      }
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
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

  window.form = {
    PIN_WIDTH: PIN_WIDTH,
    PIN_HEIGHT: PIN_HEIGHT,
    adFormDisabled: adFormDisabled,
    mapPinMain: mapPinMain,
    adForm: adForm,
    mapFiltersContainer: mapFiltersContainer
  };
})();
