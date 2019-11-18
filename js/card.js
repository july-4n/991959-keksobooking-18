'use strict';

(function () {
  var Photo = {
    WIDTH: 45,
    HEIGHT: 40
  };
  // Объект для маппинга
  var HOUSE_TYPE = {
    bungalo: 'Бунгало',
    flat: 'Квартира',
    house: 'Дом',
    palace: 'Дворец'
  };

  var cardTemplate = document.querySelector('#card')
    .content
    .querySelector('.popup');

  //  Функция для отрисовки фотографий
  var renderPhotos = function (photosElement, pin) {
    var fragment = document.createDocumentFragment();
    pin.offer.photos.forEach(function (photo) {
      var img = document.createElement('img');
      img.classList.add('popup__photo');
      img.src = photo;
      img.width = Photo.WIDTH;
      img.height = Photo.HEIGHT;
      img.alt = 'Фото интерьера';
      fragment.appendChild(img);
    });
    photosElement.appendChild(fragment);
  };

  //  Отрисовка модального окна с объявлением
  var renderCardElement = function (pin) {
    var cardElement = cardTemplate.cloneNode(true);
    var featuresElement = cardElement.querySelector('.popup__features');
    cardElement.querySelector('.popup__title').textContent = pin.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = pin.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = pin.offer.price + ' ₽/ночь';
    cardElement.querySelector('.popup__type').textContent = HOUSE_TYPE[pin.offer.type];
    cardElement.querySelector('.popup__text--capacity').textContent = pin.offer.rooms + ' комнаты для ' + pin.offer.guests + ' гостей';
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + pin.offer.checkin + ', выезд до ' + pin.offer.checkout;
    cardElement.querySelector('.popup__avatar').src = pin.author.avatar;
    if (pin.offer.description) {
      cardElement.querySelector('.popup__description').textContent = pin.offer.description;
    } else {
      cardElement.removeChild(cardElement.querySelector('.popup__description'));
    }
    if (pin.offer.photos && pin.offer.photos.length) {
      renderPhotos(cardElement.querySelector('.popup__photos'), pin);
    } else {
      cardElement.removeChild(cardElement.querySelector('.popup__photos'));
    }
    window.utils.removeElements(cardElement.querySelector('.popup__features'));
    if (pin.offer.features && pin.offer.features.length) {
      pin.offer.features.forEach(function (feature) {
        var newFeatureElement = document.createElement('li');
        newFeatureElement.classList.add('popup__feature');
        newFeatureElement.classList.add('popup__feature--' + feature);
        featuresElement.append(newFeatureElement);
      });
    } else {
      cardElement.removeChild(cardElement.querySelector('.popup__features'));
    }
    return cardElement;
  };

  window.card = {
    render: renderCardElement
  };
})();
