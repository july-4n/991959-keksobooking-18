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

  var mapFiltersContainerElement = document.querySelector('.map__filters-container');
  var mapFiltersElement = document.querySelector('.map__filters');
  var adFormElement = document.querySelector('.ad-form');
  var addressElement = document.querySelector('#address');
  var mapPinMainElement = document.querySelector('.map__pin--main');
  var mapOverlayElement = document.querySelector('.map__overlay');
  var resetButtonElement = document.querySelector('.ad-form__reset');
  var avatarFileChooserElement = document.querySelector('#avatar');
  var avatarPreviewElement = document.querySelector('.ad-form-header__preview img');
  var photosFileChooserElement = document.querySelector('#images');
  var photoPreviewElement = document.querySelector('.ad-form__photo');

  //  Загрузка аватарки
  avatarFileChooserElement.addEventListener('change', function () {
    var file = avatarFileChooserElement.files[0];
    if (file) {
      var fileName = file.name.toLowerCase();

      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });
    }
    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        avatarPreviewElement.src = reader.result;
      });
      reader.readAsDataURL(file);
    }
  });

  //  Загрузка фотографий
  photosFileChooserElement.addEventListener('change', function () {
    var file = photosFileChooserElement.files[0];
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
        photoPreviewElement.appendChild(photoElement);
        photoElement.src = reader.result;
      });
      reader.readAsDataURL(file);
    }
  });

  var deleteUserPhotos = function () {
    avatarPreviewElement.src = 'img/muffin-grey.svg';
    window.utils.removeElements(photoPreviewElement);
  };

  //  Функция заполнения поля адреса
  var getAddress = function (pinX, pinY) {
    var addressValue = pinX + ', ' + pinY;
    return addressValue;
  };

  var disableElements = function (children, isDisabled) {
    children.forEach(function (child) {
      child.disabled = isDisabled;
    });
  };

  //  Добавляем/убираем атрибут disabled в форму
  var disableAdForm = function (elem, isDisabled) {
    var fieldsetsElement = elem.querySelectorAll('fieldset');
    var selectsElement = elem.querySelectorAll('select');
    var buttonsElement = elem.querySelectorAll('button');
    disableElements(fieldsetsElement, isDisabled);
    disableElements(selectsElement, isDisabled);
    disableElements(buttonsElement, isDisabled);
    if (isDisabled) {
      addressElement.value = getAddress((LOCATION_X_PIN + PIN_WIDTH / 2), (LOCATION_Y_PIN + PIN_HEIGHT / 2));
      adFormElement.classList.add('ad-form--disabled');
      mapFiltersElement.classList.add('map__filters--disabled');
      window.map.element.classList.add('map--faded');
      window.pin.removeAllPins();
      if (document.querySelector('.popup') !== null) {
        window.map.removeCard();
      }
    } else {
      addressElement.value = getAddress((LOCATION_X_PIN + PIN_WIDTH / 2), (LOCATION_Y_PIN + PIN_HEIGHT + PIN_HEIGHT_POINTER));
      adFormElement.classList.remove('ad-form--disabled');
      mapFiltersElement.classList.remove('map__filters--disabled');
      //  проверка, чтобы запрос на сервер уезжал только при активации формы
      if (elem.querySelector('fieldset').classList.value === 'ad-form-header') {
        window.pin.activatePins();
      }
    }
  };

  disableAdForm(adFormElement, true);
  disableAdForm(mapFiltersContainerElement, true);

  //  Функция активации страницы
  var activateAdForm = function () {
    disableAdForm(adFormElement, false);
    disableAdForm(mapFiltersContainerElement, false);
  };

  //  Обработчик активации страницы по нажатию на Enter
  mapPinMainElement.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      activateAdForm();
      window.map.element.classList.remove('map--faded');
    }
  });

  var processSendSuccess = function () {
    window.backend.showSuccessMessage();
    disableAdForm(adFormElement, true);
    disableAdForm(mapFiltersContainerElement, true);
    adFormElement.reset();
    window.filters.filtersFormElement.reset();
    resetMainPin();
    deleteUserPhotos();
  };

  adFormElement.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.sendRequest(processSendSuccess, new FormData(adFormElement));
  });

  var resetMainPin = function () {
    mapPinMainElement.style.left = LOCATION_X_PIN + PIN_WIDTH / 2 + 'px';
    mapPinMainElement.style.top = LOCATION_Y_PIN + PIN_HEIGHT / 2 + 'px';
    addressElement.value = getAddress((LOCATION_X_PIN + PIN_WIDTH / 2), (LOCATION_Y_PIN + PIN_HEIGHT / 2));
  };

  var getLeft = function (x) {
    return x - PIN_WIDTH / 2;
  };

  var getTop = function (y) {
    return y - PIN_HEIGHT;
  };

  //  Перетаскивание
  mapPinMainElement.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var dragged = false;
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var pinCoords = {
      x: mapPinMainElement.offsetLeft,
      y: mapPinMainElement.offsetTop
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
      var calculatePinCoords = function () {
        pinCoords = {
          x: mapPinMainElement.offsetLeft - shift.x,
          y: mapPinMainElement.offsetTop - shift.y
        };
      };
      calculatePinCoords();

      //  Ограничения размеров
      if (pinCoords.x < getLeft(X_MIN)) {
        pinCoords.x = getLeft(mapOverlayElement.offsetLeft);
      } else if (pinCoords.x > getLeft(X_MAX)) {
        pinCoords.x = mapOverlayElement.offsetLeft + getLeft(X_MAX);
      }
      if (pinCoords.y < getTop(Y_MIN) - PIN_HEIGHT_POINTER) {
        pinCoords.y = getTop(Y_MIN) - PIN_HEIGHT_POINTER;
      } else if (pinCoords.y > getTop(Y_MAX) - PIN_HEIGHT_POINTER) {
        pinCoords.y = mapOverlayElement.offsetTop + getTop(Y_MAX) - PIN_HEIGHT_POINTER;
      }
      mapPinMainElement.style.left = (pinCoords.x) + 'px';
      mapPinMainElement.style.top = (pinCoords.y) + 'px';
      addressElement.value = getAddress(pinCoords.x + PIN_WIDTH / 2, pinCoords.y + PIN_HEIGHT + PIN_HEIGHT_POINTER);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      //  Изменение поля адреса при отпускании кнопки мыши
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (!dragged || dragged && window.map.element.classList.contains('map--faded')) {
        var activateForm = function () {
          activateAdForm();
          window.map.element.classList.remove('map--faded');
          mapPinMainElement.removeEventListener('click', activateForm);
          addressElement.value = getAddress(pinCoords.x + PIN_WIDTH / 2, pinCoords.y + PIN_HEIGHT + PIN_HEIGHT_POINTER);
        };
        mapPinMainElement.addEventListener('click', activateForm);
      }
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  //  отработка кнопки ad-form__reset
  //  по клику
  resetButtonElement.addEventListener('mousedown', function () {
    disableAdForm(adFormElement, true);
    disableAdForm(mapFiltersContainerElement, true);
    adFormElement.reset();
    window.filters.filtersFormElement.reset();
    resetMainPin();
    deleteUserPhotos();
  });

  //  по нажатию на Enter
  resetButtonElement.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      disableAdForm(adFormElement, true);
      disableAdForm(mapFiltersContainerElement, true);
      adFormElement.reset();
      window.filters.filtersFormElement.reset();
      resetMainPin();
      deleteUserPhotos();
    }
  });

  var adFormSubmitElement = adFormElement.querySelector('.ad-form__submit');
  adFormSubmitElement.addEventListener('click', function () {
    window.validate.validateTitle();
    window.validate.validateRooms();
    window.validate.validatePrice();
  });

  var inputTypeElement = adFormElement.querySelector('#type');
  var inputTimeInElement = adFormElement.querySelector('#timein');
  var inputTimeOutElement = adFormElement.querySelector('#timeout');
  var inputPriceValueElement = adFormElement.querySelector('#price');

  //  Синхронизация плейсхолдера с типом жилья и минимальной цены
  inputTypeElement.addEventListener('change', function () {
    if (inputTypeElement.value === 'bungalo') {
      inputPriceValueElement.placeholder = MinPriceHouses.BUNGALO;
      inputPriceValueElement.min = MinPriceHouses.BUNGALO;
    } else if (inputTypeElement.value === 'flat') {
      inputPriceValueElement.placeholder = MinPriceHouses.FLAT;
      inputPriceValueElement.min = MinPriceHouses.FLAT;
    } else if (inputTypeElement.value === 'house') {
      inputPriceValueElement.placeholder = MinPriceHouses.HOUSE;
      inputPriceValueElement.min = MinPriceHouses.HOUSE;
    } else if (inputTypeElement.value === 'palace') {
      inputPriceValueElement.placeholder = MinPriceHouses.PALACE;
      inputPriceValueElement.min = MinPriceHouses.PALACE;
    }
  });

  //  Синхронизация времени заезда с временем выезда
  inputTimeInElement.addEventListener('change', function () {
    inputTimeOutElement.value = inputTimeInElement.value;
  });

  //  Синхронизация времени выезда с временем заезда
  inputTimeOutElement.addEventListener('change', function () {
    inputTimeInElement.value = inputTimeOutElement.value;
  });

  window.form = {
    getLeft: getLeft,
    getTop: getTop,
    mapFiltersContainerElement: mapFiltersContainerElement,
    adFormElement: adFormElement,
    inputPriceValueElement: inputPriceValueElement,
  };
})();
