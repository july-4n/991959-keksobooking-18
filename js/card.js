'use strict';

(function () {
  var photo = {
    WIDTH: 45,
    HEIGHT: 40
  };

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
      img.width = photo.WIDTH;
      img.height = photo.HEIGHT;
      img.alt = 'Фото интерьера';
      fragment.appendChild(img);
    }
    photosElement.appendChild(fragment);
  };

  //  Отрисовка модального окна с объявлением
  var renderCardElement = function (pin) {
    var cardElement = cardTemplate.cloneNode(true);
    var featuresElement = cardElement.querySelector('.popup__features');
    cardElement.querySelector('.popup__title').textContent = pin.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = pin.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = pin.offer.price + ' ₽/ночь';
    cardElement.querySelector('.popup__type').textContent = pin.offer.type;
    cardElement.querySelector('.popup__text--capacity').textContent = pin.offer.rooms + ' комнаты для ' + pin.offer.guests + ' гостей';
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + pin.offer.checkin + ', выезд до ' + pin.offer.checkout;
    cardElement.querySelector('.popup__avatar').src = pin.author.avatar;
    if (Array.from(pin.offer.description).length !== 0) {
      cardElement.querySelector('.popup__description').textContent = pin.offer.description;
    } else {
      cardElement.removeChild(cardElement.querySelector('.popup__description'));
    }
    if (Array.from(pin.offer.photos).length !== 0) {
      renderPhotos(cardElement.querySelector('.popup__photos'), pin);
    } else {
      cardElement.removeChild(cardElement.querySelector('.popup__photos'));
    }
    cardElement.querySelector('.popup__features').innerHTML = '';
    if (Array.from(pin.offer.features).length !== 0) {
      pin.offer.features.forEach(function (element) {
        var newFeatureElement = document.createElement('li');
        newFeatureElement.classList.add('popup__feature');
        newFeatureElement.classList.add('popup__feature--' + element);
        featuresElement.append(newFeatureElement);
      });
    } else {
      cardElement.removeChild(cardElement.querySelector('.popup__features'));
    }
    return cardElement;
  };

  window.card = {
    renderCardElement: renderCardElement
  };
})();
