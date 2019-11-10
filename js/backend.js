'use strict';

(function () {

  var SUCCESS_STATUS = 200;
  var REQUEST_TIMEOUT = 10000;
  var URL = 'https://js.dump.academy/keksobooking/data';

  var load = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_STATUS) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = REQUEST_TIMEOUT;

    xhr.open('GET', URL);
    xhr.send();
  };

  var main = document.querySelector('main');

  var errorTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');

  var errorHandler = function (errorMessage) {
    var errorElement = errorTemplate.cloneNode(true);
    var errorText = errorTemplate.querySelector('.error__message');
    var errorBtn = errorTemplate.querySelector('.error__button');
    errorText.textContent = errorMessage;
    main.insertAdjacentElement('afterbegin', errorTemplate);
    errorBtn.addEventListener('click', function () {
      errorElement.classList.add('visually-hidden');
    });
  };

  window.backend = {
    load: load,
    errorHandler: errorHandler
  };
})();
