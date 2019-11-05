'use strict';

(function () {

  //  Возвращает случайное число из массива
  var getRandomElement = function (elements) {
    var max = elements.length;
    var randomIndex = Math.round(Math.random() * (max - 1));
    return elements[randomIndex];
  };
  //  Возвращает случайное число из интервала
  var getRandomIntFromInterval = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  //  Возвращает новый случайный массив
  var getRandomArr = function (elements) {
    var newArrays = [];
    var arrMin = 1;
    var arrMAx = elements.length;
    for (var i = 0; i < getRandomIntFromInterval(arrMin, arrMAx); i++) {
      newArrays.push(elements[i]);
    }
    return newArrays;
  };

  window.data = {
    getRandomElement: getRandomElement,
    getRandomIntFromInterval: getRandomIntFromInterval,
    getRandomArr: getRandomArr
  };
})();
