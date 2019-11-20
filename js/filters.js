'use strict';

(function () {

  var PriceSize = {
    MIN: 10000,
    LOW: 'low',
    MID: 'middle',
    HIGH: 'high',
    MAX: 50000
  };
  var filtersFormElement = document.querySelector('.map__filters');
  var housingTypeElement = filtersFormElement.querySelector('#housing-type');
  var housingPriceElement = filtersFormElement.querySelector('#housing-price');
  var roomsQuantityElement = filtersFormElement.querySelector('#housing-rooms');
  var guestsQuantityElement = filtersFormElement.querySelector('#housing-guests');
  var houseFeaturesElement = filtersFormElement.querySelector('#housing-features').querySelectorAll('input');

  var getHousingType = function (element) {
    if (housingTypeElement.value === 'any') {
      return true;
    }
    return element.offer.type === housingTypeElement.value;
  };

  var gethousingPrice = function (element) {
    switch (housingPriceElement.value) {
      case PriceSize.LOW: return element.offer.price <= PriceSize.MIN;
      case PriceSize.MID: return element.offer.price >= PriceSize.MIN && element.offer.price <= PriceSize.MAX;
      case PriceSize.HIGH: return element.offer.price >= PriceSize.MAX;
      default: return true;
    }
  };

  var getRoomsQuantity = function (element) {
    if (roomsQuantityElement.value === 'any') {
      return true;
    }
    return element.offer.rooms === parseInt(roomsQuantityElement.value, 10);
  };

  var getHouseFeatures = function (element) {
    // Цикл, а не forEach потому что мы можем его преждевременно прервать
    for (var i = 0; i < houseFeaturesElement.length; i++) {
      var feature = houseFeaturesElement[i];
      if (!feature.checked) {
        continue;
      }
      if (!element.offer.features.includes(feature.value)) {
        return false;
      }
    }
    return true;
  };

  var onFilterChange = window.utils.debounce(function () {
    window.pin.removeAllPins();
    window.map.removeCard();
    window.map.renderPins(window.filters.getAllFilter(window.pinsArray));
  });

  var getGuestsQuantity = function (element) {
    if (guestsQuantityElement.value === 'any') {
      return true;
    }
    return element.offer.guests === parseInt(guestsQuantityElement.value, 10);
  };

  var getAllFilter = function (data) {
    return data.filter(function (el) {
      return getHousingType(el) && gethousingPrice(el) && getRoomsQuantity(el) && getGuestsQuantity(el) && getHouseFeatures(el);
    });
  };

  filtersFormElement.addEventListener('change', onFilterChange);

  window.filters = {
    getAllFilter: getAllFilter,
    filtersFormElement: filtersFormElement
  };
})();
