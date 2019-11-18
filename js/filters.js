'use strict';

(function () {

  var PriceSize = {
    MIN: 10000,
    LOW: 'low',
    MID: 'middle',
    HIGH: 'high',
    MAX: 50000
  };
  var filtersForm = document.querySelector('.map__filters');
  var housingTypeSelect = filtersForm.querySelector('#housing-type');
  var housingPriceSelect = filtersForm.querySelector('#housing-price');
  var roomsQuantity = filtersForm.querySelector('#housing-rooms');
  var guestsQuantity = filtersForm.querySelector('#housing-guests');
  var houseFeatures = filtersForm.querySelector('#housing-features').querySelectorAll('input');

  var getHousingType = function (element) {
    if (housingTypeSelect.value === 'any') {
      return true;
    } else {
      return element.offer.type === housingTypeSelect.value;
    }
  };

  var gethousingPriceSelect = function (element) {
    switch (housingPriceSelect.value) {
      case PriceSize.LOW: return element.offer.price <= PriceSize.MIN;
      case PriceSize.MID: return element.offer.price >= PriceSize.MIN && element.offer.price <= PriceSize.MAX;
      case PriceSize.HIGH: return element.offer.price >= PriceSize.MAX;
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
    return Array.prototype.reduce.call(houseFeatures, function (elements, el) {
      if (el.checked) {
        elements.push(el.value);
      }
      return elements;
    }, []).every(function (feature) {
      return element.offer.features.includes(feature);
    });
  };

  var selectFilterChangeHandler = window.utils.debounce(function () {
    window.pin.removeAllPins();
    window.map.removeCard();
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
    });
  };

  filtersForm.addEventListener('change', selectFilterChangeHandler);

  window.filters = {
    allFilter: allFilter,
    filtersForm: filtersForm
  };
})();
