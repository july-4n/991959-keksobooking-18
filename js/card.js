'use strict';

(function () {

  var cardTemplate = document.querySelector('#card')
    .content
    .querySelector('.popup');

  //  Функция для отрисовки фотографий
  var renderPhotos = function (photosElement, pin) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < pin.offer.photos.length; i++) {
      var img = document.createElement('img');
      img.classList.add('popup__photo');
      img.src = pin.offer.photos[i];
      img.width = 45;
      img.height = 40;
      fragment.appendChild(img);
    }
    photosElement.appendChild(fragment);
  };

  //  Отрисовка модального окна с объявлением
  var renderCardElement = function (pin) {
    var cardElement = cardTemplate.cloneNode(true);
    cardElement.querySelector('.popup__title').textContent = pin.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = pin.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = pin.offer.price + ' ₽/ночь';
    cardElement.querySelector('.popup__type').textContent = pin.offer.type;
    cardElement.querySelector('.popup__text--capacity').textContent = pin.offer.rooms + ' комнаты для ' + pin.offer.guests + ' гостей';
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + pin.offer.checkin + ', выезд до ' + pin.offer.checkout;
    cardElement.querySelector('.popup__features').textContent = pin.offer.features;
    cardElement.querySelector('.popup__description').textContent = pin.offer.description;
    cardElement.querySelector('.popup__avatar').src = pin.author.avatar;
    renderPhotos(cardElement.querySelector('.popup__photos'), pin);
    return cardElement;
  };

  window.card = {
    renderCardElement: renderCardElement
  };
})();
