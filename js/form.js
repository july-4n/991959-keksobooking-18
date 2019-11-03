'use strict';

(function () {

  window.map = document.querySelector('.map');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var mapFilters = document.querySelector('.map__filters');
  var adForm = document.querySelector('.ad-form');
  var address = document.querySelector('#address');

  //  Определение адреса
  var addressPassive = function () {
    var addressValue = (window.LOCATION_X_PIN + window.PIN_WIDTH / 2) + ', ' + (window.LOCATION_Y_PIN + window.PIN_HEIGHT / 2);
    return addressValue;
  };

  //  Определение адреса при активации
  var addressActive = function () {
    var addressValue = (window.LOCATION_X_PIN + window.PIN_WIDTH / 2) + ', ' + (window.LOCATION_Y_PIN + (window.PIN_HEIGHT + window.PIN_HEIGHT_POINTER) / 2);
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
    window.renderPins(window.pin.pinsArr);
  };

  var mapPinMain = document.querySelector('.map__pin--main');

  // Обработчик активации страницы по клику
  mapPinMain.addEventListener('mousedown', function () {
    adFormActivation();
    window.map.classList.remove('map--faded');
    address.value = addressActive();
  });

  //  Обработчик активации страницы по нажатию на Enter
  mapPinMain.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.ENTER_KEYCODE) {
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
      guestsValue.setCustomValidity(window.ErrorText.NOT_GUESTS);
    } else if (guestsNumber === '0' && roomsNumber !== '100') {
      guestsValue.setCustomValidity(window.ErrorText.VALUE_GUESTS);
    } else if (roomsNumber < guestsNumber) {
      guestsValue.setCustomValidity(window.ErrorText.GUESTS);
    } else {
      guestsValue.setCustomValidity('');
    }

    if (inputType === 'flat' && inputPrice < 1000) {
      inputPriceValue.setCustomValidity(window.ErrorText.FLAT_MIN_PRICE);
    } else if (inputType === 'house' && inputPrice < 5000) {
      inputPriceValue.setCustomValidity(window.ErrorText.HOUSE_MIN_PRICE);
    } else if (inputType === 'palace' && inputPrice < 10000) {
      inputPriceValue.setCustomValidity(window.ErrorText.PALACE_MIN_PRICE);
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
})();
