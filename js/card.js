'use strict';

(function () {

  // Находит элемент, в который мы будем вставлять похожие объявления
  window.card.mapTop = document.querySelector('.map__pins');

  var cardTemplate = document.querySelector('#card')
    .content
    .querySelector('.popup');

  //  тип жилья
  var element = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };

  //  Функция для отрисовки фотографий
  var renderPhotos = function (cardElement, pin) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < pin.offer.photos.length; i++) {
      var img = document.createElement('img');
      img.classList.add('popup__photo');
      img.src = pin.offer.photos[i];
      img.width = 45;
      img.height = 40;

      fragment.appendChild(img);
    }
    cardElement.appendChild(fragment);
  };

  //  Отрисовка модального окна с объявлением
  window.card.renderCardElement = function (pin) {
    var cardElement = cardTemplate.cloneNode(true);
    cardElement.querySelector('.popup__title').textContent = pin.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = pin.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = pin.offer.price + '₽/ночь';
    cardElement.querySelector('.popup__type').textContent = element[pin.offer.type];
    cardElement.querySelector('.popup__text--capacity').textContent = pin.offer.rooms + ' комнаты для ' + pin.offer.guests + ' гостей';
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + pin.offer.checkin + ', выезд до ' + pin.offer.checkout;
    cardElement.querySelector('.popup__features').textContent = pin.offer.features;
    cardElement.querySelector('.popup__description').textContent = pin.offer.description;
    cardElement.querySelector('.popup__avatar').src = pin.author.avatar;
    cardElement.querySelector('.popup__photos').src = renderPhotos(cardElement, pin);
    return cardElement;
  };
})();
