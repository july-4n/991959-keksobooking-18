'use strict';

(function () {
  var MIN_TITLE_LENGTH = 30;
  var ErrorText = {
    TITLE_IS_TOO_SHORT: 'Длина заголовка не может быть меньше 30 символов. Пожалуйста, постарайтесь!',
    GUESTS: 'Количество гостей должно быть меньше или равно количеству комнат',
    NOT_GUESTS: 'Такие большие помещения не для гостей',
    VALUE_GUESTS: 'Укажите количество гостей',
    PRICE_IS_BELOW_ZERO: 'Вы указали отрицательную стоимость! Вы отщедрот?',
    OVERPRICE: 'Максимально допустимая стоимость жилья - 1000000 руб.'
  };
  var RoomsNumber = {
    MIN: '0',
    MAX: '100'
  };
  var PriceLimits = {
    MIN: 0,
    MAX: 1000000
  };

  var titleValueElement = window.form.adFormElement.querySelector('#title');
  var guestsValueElement = window.form.adFormElement.querySelector('#capacity');
  var roomsValueElement = window.form.adFormElement.querySelector('#room_number');

  var validateTitle = function () {
    var titleLength = titleValueElement.value.length;
    if (titleLength < MIN_TITLE_LENGTH) {
      titleValueElement.setCustomValidity(ErrorText.TITLE_IS_TOO_SHORT);
    } else {
      titleValueElement.setCustomValidity('');
    }
  };

  var validateRooms = function () {
    var guestsNumber = guestsValueElement.value;
    var roomsNumber = roomsValueElement.value;
    if (roomsNumber === RoomsNumber.MAX && guestsNumber !== RoomsNumber.MIN) {
      guestsValueElement.setCustomValidity(ErrorText.NOT_GUESTS);
    } else if (guestsNumber === RoomsNumber.MIN && roomsNumber !== RoomsNumber.MAX) {
      guestsValueElement.setCustomValidity(ErrorText.VALUE_GUESTS);
    } else if (roomsNumber < guestsNumber) {
      guestsValueElement.setCustomValidity(ErrorText.GUESTS);
    } else {
      guestsValueElement.setCustomValidity('');
    }
  };

  var validatePrice = function () {
    var inputPrice = parseInt(window.form.inputPriceValue.value, 10);
    var minPrice = parseInt(window.form.inputPriceValue.min, 10);

    if (inputPrice < PriceLimits.MIN) {
      window.form.inputPriceValue.setCustomValidity(ErrorText.PRICE_IS_BELOW_ZERO);
    } else if (inputPrice < minPrice) {
      window.form.inputPriceValue.setCustomValidity('Цена должна быть не менее ' + minPrice + ' р.');
    } else if (inputPrice > PriceLimits.MAX) {
      window.form.inputPriceValue.setCustomValidity(ErrorText.OVERPRICE);
    } else {
      window.form.inputPriceValue.setCustomValidity('');
    }
  };

  window.validate = {
    validateTitle: validateTitle,
    validateRooms: validateRooms,
    validatePrice: validatePrice,
  };
})();
