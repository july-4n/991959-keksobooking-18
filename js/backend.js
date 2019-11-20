'use strict';

(function () {

  var SUCCESS_STATUS = 200;
  var REQUEST_TIMEOUT = 10000;
  var Url = {
    LOAD: 'https://js.dump.academy/keksobooking/data',
    UPLOAD: 'https://js.dump.academy/keksobooking'
  };
  var ErrorCodes = {
    CLIENT: 400,
    SERVER: 500
  };
  var ErrorText = {
    CLIENT: 'Ошибка загрузки объявлений. ',
    SERVER: 'Произошла ошибка на сервере, попробуйте позже. ',
    OTHER: 'Ошибка! Код ошибки: '
  };

  var sendRequest = function (processSuccess, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_STATUS) {
        processSuccess(xhr.response);
      } else {
        processError(xhr.status);
      }
    });
    xhr.addEventListener('error', function () {
      processError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      processError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = REQUEST_TIMEOUT;

    if (data) {
      xhr.open('POST', Url.UPLOAD);
      xhr.send(data);
    } else {
      xhr.open('GET', Url.LOAD);
      xhr.send();
    }
  };

  var createMessage = function (template) {
    var popupMessageElement = template.cloneNode(true);
    var removePopup = function () {
      popupMessageElement.remove();
      document.removeEventListener('keydown', onPopupEscPress);
    };

    var onPopupEscPress = function (evt) {
      if (window.utils.isEsc(evt)) {
        removePopup();
      }
    };

    document.addEventListener('keydown', onPopupEscPress);
    popupMessageElement.addEventListener('click', function () {
      removePopup();
    });

    var mainElement = document.querySelector('main');
    mainElement.insertAdjacentElement('afterbegin', popupMessageElement);
  };

  var showErrorMessage = function (errorMessage) {
    var errorTemplateElement = document.querySelector('#error')
      .content
      .querySelector('.error');
    createMessage(errorTemplateElement);
    var errorTextElement = document.querySelector('.error__message');
    errorTextElement.textContent = errorMessage;
  };

  var showSuccessMessage = function () {
    var successTemplateElement = document.querySelector('#success')
      .content
      .querySelector('.success');
    createMessage(successTemplateElement);
  };

  var processError = function (status) {
    var errorMessage;
    if (status >= ErrorCodes.CLIENT && status < ErrorCodes.SERVER) {
      errorMessage = ErrorText.CLIENT + status;
    } else if (status >= ErrorCodes.SERVER) {
      errorMessage = ErrorText.SERVER + status;
    } else {
      errorMessage = ErrorText.OTHER + status;
    }
    showErrorMessage(errorMessage);
  };

  window.backend = {
    sendRequest: sendRequest,
    showSuccessMessage: showSuccessMessage
  };
})();
