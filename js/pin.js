'use strict';

(function () {

  //  нашли шаблон пинов, который будем копировать
  var similarPinTemplateElement = document.querySelector('#pin')
      .content
      .querySelector('.map__pin');

  //  создаем пин
  var renderPin = function (pin) {
    var element = similarPinTemplateElement.cloneNode(true);
    element.style.left = window.form.getLeft(pin.location.x) + 'px';
    element.style.top = window.form.getTop(pin.location.y) + 'px';
    element.querySelector('img').src = pin.author.avatar;
    element.querySelector('img').alt = pin.offer.title;
    element.classList.remove('visually-hidden');
    return element;
  };

  var processGetSuccess = function (pinsFromResponse) {
    window.pinsArray = pinsFromResponse;
    window.map.renderPins(window.filters.getAllFilter(window.pinsArray));
  };

  var removeAllPins = function () {
    document.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(function (pin) {
      pin.parentNode.parentNode.removeChild(pin.parentNode);
    });
  };

  var activatePins = function () {
    window.backend.sendRequest(processGetSuccess);
  };

  window.pin = {
    activatePins: activatePins,
    renderPin: renderPin,
    removeAllPins: removeAllPins,
  };
})();
