'use strict';

(function () {
  var QUANTITY = 5;
  var filtersForm = document.querySelector('.map__filters');
  var housingTypeSelect = filtersForm.querySelector('#housing-type');
  var housingPriceSelect = filtersForm.querySelector('#housing-price');
  var roomsQuantity = filtersForm.querySelector('#housing-rooms');
  var guestsQuantity = filtersForm.querySelector('#housing-guests');
  var houseFeatures = filtersForm.querySelector('#housing-features').querySelectorAll('input');

  var priceSize = {
    MIN: 10000,
    LOW: 'low',
    MID: 'middle',
    HIGH: 'high',
    MAX: 50000
  };

  var getHousingType = function (element) {
    if (housingTypeSelect.value === 'any') {
      return true;
    } else {
      return element.offer.type === housingTypeSelect.value;
    }
  };

  var gethousingPriceSelect = function (element) {
    switch (housingPriceSelect.value) {
      case priceSize.LOW: return element.offer.price <= priceSize.MIN;
      case priceSize.MID: return element.offer.price >= priceSize.MIN && element.offer.price <= priceSize.MAX;
      case priceSize.HIGH: return element.offer.price >= priceSize.MAX;
      default: return true;
    }
  };

  var getRoomsQuantity = function (element) {
    if (roomsQuantity.value === 'any') {
      return true;
    } else {
      return element.offer.rooms === parseInt(roomsQuantity.value, 10);
    }
  };

  var getHouseFeatures = function (element) {
    return Array.from(houseFeatures).filter(function (el) {
      return el.checked;
    }).map(function (el) {
      return el.value;
    }).every(function (feature) {
      return element.offer.features.includes(feature);
    });
  };

  var selectFilterChangeHandler = window.debounce(function () {
    window.pin.removeAllPins();
    if (document.querySelector('.popup') !== null) {
      window.pin.hidePopup();
    }
    window.map.renderPins(window.filters.allFilter(window.pinsArray));
  });

  var getGuestsQuantity = function (element) {
    if (guestsQuantity.value === 'any') {
      return true;
    } else {
      return element.offer.guests === parseInt(guestsQuantity.value, 10);
    }
  };

  var allFilter = function (data) {
    return data.filter(function (el) {
      return getHousingType(el) && gethousingPriceSelect(el) && getRoomsQuantity(el) && getGuestsQuantity(el) && getHouseFeatures(el);
    })
      .slice(0, QUANTITY);
  };

  filtersForm.addEventListener('change', selectFilterChangeHandler);

  window.filters = {
    allFilter: allFilter,
    filtersForm: filtersForm
  };
})();
