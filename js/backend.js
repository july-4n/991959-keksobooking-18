'use strict';

(function () {

  var SUCCESS_STATUS = 200;
  var REQUEST_TIMEOUT = 10000;
  var LOAD_URL = 'https://js.dump.academy/keksobooking/data';
  var UPLOAD_URL = 'https://js.dump.academy/keksobooking';

  var sendRequest = function (onSuccess, onError, data) {
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

    if (data) {
      xhr.open('POST', UPLOAD_URL);
      xhr.send(data);
    } else {
      xhr.open('GET', LOAD_URL);
      xhr.send();
    }
  };

  var createMessage = function (template) {
    var popupMessage = template.cloneNode(true);
    var removePopup = function () {
      popupMessage.remove();
      document.removeEventListener('keydown', onPopupEscPress);
    };

    var onPopupEscPress = function (evt) {
      if (evt.keyCode === 27) {
        removePopup();
      }
    };

    document.addEventListener('keydown', onPopupEscPress);
    popupMessage.addEventListener('click', function () {
      removePopup();
    });

    var main = document.querySelector('main');
    main.insertAdjacentElement('afterbegin', popupMessage);
  };

  var showErrorMessage = function (errorMessage) {
    var errorTemplate = document.querySelector('#error')
      .content
      .querySelector('.error');
    createMessage(errorTemplate);
    var errorText = document.querySelector('.error__message');
    errorText.textContent = errorMessage;
  };

  var showSuccessMessage = function (successMessage) {
    var successTemplate = document.querySelector('#success')
      .content
      .querySelector('.success');
    createMessage(successTemplate);
    var successText = successTemplate.querySelector('.success__message');
    successText.textContent = successMessage;
    window.form.adFormDisabled(window.form.adForm, true);
  };

  window.backend = {
    sendRequest: sendRequest,
    showErrorMessage: showErrorMessage,
    showSuccessMessage: showSuccessMessage
  };
})();
