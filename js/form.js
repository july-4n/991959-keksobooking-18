'use strict';

(function () {

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
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var MinPriceHouses = {
    BUNGALO: 0,
    FLAT: 1000,
    HOUSE: 5000,
    PALACE: 10000
  };

  var Image = {
    WIDTH: 70,
    HEIGHT: 70
  };

  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var mapFilters = document.querySelector('.map__filters');
  var adForm = document.querySelector('.ad-form');
  var address = document.querySelector('#address');
  var mapPinMain = document.querySelector('.map__pin--main');
  var mapOverlay = document.querySelector('.map__overlay');
  var resetButton = document.querySelector('.ad-form__reset');
  var avatarFileChooser = document.querySelector('#avatar');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var photosFileChooser = document.querySelector('#images');
  var photoPreview = document.querySelector('.ad-form__photo');

  //  Загрузка аватарки
  avatarFileChooser.addEventListener('change', function () {
    var file = avatarFileChooser.files[0];
    if (file) {
      var fileName = file.name.toLowerCase();

      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });
    }
    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        avatarPreview.src = reader.result;
      });
      reader.readAsDataURL(file);
    }
  });

  //  Загрузка фотографий
  photosFileChooser.addEventListener('change', function () {
    var file = photosFileChooser.files[0];
    var fileName = file.name.toLowerCase();
    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        var photoElement = document.createElement('img');
        photoElement.width = Image.WIDTH;
        photoElement.height = Image.HEIGHT;
        photoPreview.appendChild(photoElement);
        photoElement.src = reader.result;
      });
      reader.readAsDataURL(file);
    }
  });

  //  Функция заполнения поля адреса
  var addressField = function (pinX, pinY) {
    var addressValue = pinX + ', ' + pinY;
    return addressValue;
  };

  var disableElements = function (children, isDisabled) {
    children.forEach(function (child) {
      child.disabled = isDisabled;
    });
  };

  //  Добавляем/убираем атрибут disabled в форму
  var adFormDisabled = function (elem, isDisabled) {
    var fieldsets = elem.querySelectorAll('fieldset');
    var selects = elem.querySelectorAll('select');
    var buttons = elem.querySelectorAll('button');
    disableElements(fieldsets, isDisabled);
    disableElements(selects, isDisabled);
    disableElements(buttons, isDisabled);
    if (isDisabled) {
      address.value = addressField((LOCATION_X_PIN + PIN_WIDTH / 2), (LOCATION_Y_PIN + PIN_HEIGHT / 2));
      adForm.classList.add('ad-form--disabled');
      mapFilters.classList.add('map__filters--disabled');
      window.map.element.classList.add('map--faded');
      window.pin.removeAllPins();
      if (document.querySelector('.popup') !== null) {
        window.map.removeCard();
      }
    } else {
      address.value = addressField((LOCATION_X_PIN + PIN_WIDTH / 2), (LOCATION_Y_PIN + PIN_HEIGHT + PIN_HEIGHT_POINTER));
      adForm.classList.remove('ad-form--disabled');
      mapFilters.classList.remove('map__filters--disabled');
      //  проверка, чтобы запрос на сервер уезжал только при активации формы
      if (elem.querySelector('fieldset').classList.value === 'ad-form-header') {
        window.pin.activatePins();
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

  //  Обработчик активации страницы по нажатию на Enter
  mapPinMain.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      adFormActivation();
      window.map.element.classList.remove('map--faded');
    }
  });

  var onSuccess = function () {
    window.backend.showSuccessMessage();
    adFormDisabled(adForm, true);
    adFormDisabled(mapFiltersContainer, true);
    adForm.reset(adForm, true);
    window.filters.filtersForm.reset();
    resetMainPin();
  };

  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.sendRequest(onSuccess, new FormData(adForm));
  });

  var resetMainPin = function () {
    mapPinMain.style.left = LOCATION_X_PIN + PIN_WIDTH / 2 + 'px';
    mapPinMain.style.top = LOCATION_Y_PIN + PIN_HEIGHT / 2 + 'px';
    address.value = addressField((LOCATION_X_PIN + PIN_WIDTH / 2), (LOCATION_Y_PIN + PIN_HEIGHT / 2));
  };

  var getLeft = function (x) {
    return x - PIN_WIDTH / 2;
  };

  var getTop = function (y) {
    return y - PIN_HEIGHT;
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

      //  Функция расчета координат пина
      var coordsPin = function () {
        pinCoords = {
          x: mapPinMain.offsetLeft - shift.x,
          y: mapPinMain.offsetTop - shift.y
        };
      };
      coordsPin();

      //  Ограничения размеров
      if (pinCoords.x < getLeft(X_MIN)) {
        pinCoords.x = getLeft(mapOverlay.offsetLeft);
      } else if (pinCoords.x > getLeft(X_MAX)) {
        pinCoords.x = mapOverlay.offsetLeft + getLeft(X_MAX);
      }
      if (pinCoords.y < getTop(Y_MIN) - PIN_HEIGHT_POINTER) {
        pinCoords.y = getTop(Y_MIN) - PIN_HEIGHT_POINTER;
      } else if (pinCoords.y > getTop(Y_MAX) - PIN_HEIGHT_POINTER) {
        pinCoords.y = mapOverlay.offsetTop + getTop(Y_MAX) - PIN_HEIGHT_POINTER;
      }
      mapPinMain.style.left = (pinCoords.x) + 'px';
      mapPinMain.style.top = (pinCoords.y) + 'px';
      address.value = addressField(pinCoords.x + PIN_WIDTH / 2, pinCoords.y + PIN_HEIGHT + PIN_HEIGHT_POINTER);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      //  Изменение поля адреса при отпускании кнопки мыши
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (!dragged || dragged && window.map.element.classList.contains('map--faded')) {
        var activateForm = function () {
          adFormActivation();
          window.map.element.classList.remove('map--faded');
          mapPinMain.removeEventListener('click', activateForm);
          address.value = addressField(pinCoords.x + PIN_WIDTH / 2, pinCoords.y + PIN_HEIGHT + PIN_HEIGHT_POINTER);
        };
        mapPinMain.addEventListener('click', activateForm);
      }
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  //  отработка кнопки ad-form__reset
  //  по клику
  resetButton.addEventListener('mousedown', function () {
    adFormDisabled(adForm, true);
    adFormDisabled(mapFiltersContainer, true);
    adForm.reset(adForm, true);
    window.filters.filtersForm.reset();
    resetMainPin();
  });

  //  по нажатию на Enter
  resetButton.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      adFormDisabled(adForm, true);
      adForm.reset();
      window.filters.filtersForm.reset();
      resetMainPin();
    }
  });

  var adFormSubmit = adForm.querySelector('.ad-form__submit');
  adFormSubmit.addEventListener('click', function () {
    window.validate.validateTitle();
    window.validate.validateRooms();
    window.validate.validatePrice();
  });

  var inputTypeValue = adForm.querySelector('#type');
  var inputTimeInValue = adForm.querySelector('#timein');
  var inputTimeOutValue = adForm.querySelector('#timeout');
  var inputPriceValue = adForm.querySelector('#price');

  //  Синхронизация плейсхолдера с типом жилья и минимальной цены
  inputTypeValue.addEventListener('change', function () {
    if (inputTypeValue.value === 'bungalo') {
      inputPriceValue.placeholder = MinPriceHouses.BUNGALO;
      inputPriceValue.min = MinPriceHouses.BUNGALO;
    } else if (inputTypeValue.value === 'flat') {
      inputPriceValue.placeholder = MinPriceHouses.FLAT;
      inputPriceValue.min = MinPriceHouses.FLAT;
    } else if (inputTypeValue.value === 'house') {
      inputPriceValue.placeholder = MinPriceHouses.HOUSE;
      inputPriceValue.min = MinPriceHouses.HOUSE;
    } else if (inputTypeValue.value === 'palace') {
      inputPriceValue.placeholder = MinPriceHouses.PALACE;
      inputPriceValue.min = MinPriceHouses.PALACE;
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
    getLeft: getLeft,
    getTop: getTop,
    adFormDisabled: adFormDisabled,
    mapPinMain: mapPinMain,
    mapFiltersContainer: mapFiltersContainer,
    adForm: adForm,
    inputPriceValue: inputPriceValue,
  };
})();
