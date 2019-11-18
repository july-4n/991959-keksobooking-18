'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var DEBOUNCE_INTERVAL = 500; // время в миллисекундах

  var isEsc = function (evt) {
    return evt.keyCode === ESC_KEYCODE;
  };

  var debounce = function (cb) {
    var lastTimeout = null;

    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
    };
  };

  var removeElement = function (element, parent) {
    parent.removeChild(element);
  };

  var removeElements = function (parent) {
    while (parent.lastChild) {
      removeElement(parent.lastChild, parent);
    }
  };
  window.utils = {
    isEsc: isEsc,
    debounce: debounce,
    removeElement: removeElement,
    removeElements: removeElements
  };
})();
