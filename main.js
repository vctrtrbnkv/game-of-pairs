import { showModalWindow } from "./scripts/modal.js";

import {
  updateTimer,
  updateDisplay
} from "./scripts/timer.js";

import { updateStopwatch } from "./scripts/stopwatch.js";

import { getSelectedSettings } from "./scripts/settings.js";

(function () {
  let cardsArray = [];
  let firstCard = null;
  let secondCard = null;
  let timerInterval;
  let totalTime = 0;
  let stopwatchId;
  let seconds = 0;
  let minutes = 0;

  const gameConfig = {
    difficulty: '',
    withTimer: '',
  };

  const pairsMap = {
    test: 1,
    easy: 8,
    medium: 18,
    hard: 32
  };

  const timerMap = {
    test: 10,
    easy: 30,
    medium: 60,
    hard: 150
  };

  const breakpoints = {
    phone: 320,
    tablet: 768,
    tabletLarge: 990,
    desktop: 1200,
    desktopWide: 1400,
  };

  function createNumbersArray(count) {
    const numbersArray = [];

    for (let i = 1; i <= count; i++) {
      numbersArray.push(i, i);
    }

    return numbersArray;
  }

  function shuffle(arr) {
    for (let i = 0; i < arr.length - 1; ++i) {
      let randomIndex = Math.round(Math.random() * (arr.length - 1));

      let temp = arr[i];
      arr[i] = arr[randomIndex];
      arr[randomIndex] = temp;
    }

    return arr;
  }

  function createCardNumbersArray(count) {
    return shuffle(createNumbersArray(count));
  }

  function createCard(id) {
    const card = document.createElement('div');
    card.classList.add('card', 'press-start-2p-regular');
    card.textContent = cardsArray.find(card => card.id === id).value;
    card.id = id;

    card.addEventListener('click', () => {
      checkForMatch(id);

      if (gameConfig.withTimer === 'no') {
        if (stopwatchId) return;
        stopwatchId = setInterval(() => {
          const updatedTime = updateStopwatch(seconds, minutes);

          seconds = updatedTime.seconds;
          minutes = updatedTime.minutes;
        }, 1000);
      }
    })

    return card;
  }

  function createPlayingField(arr) {
    const field = document.getElementById('playing-field');
    field.innerHTML = '';

    arr.forEach((element, index) => {
      const id = `card-${index}`;

      cardsArray.push({
        value: element,
        isMatch: false,
        id
      });

      const item = createCard(id);

      field.append(item);
    });

    return field;
  }

  function updateStatusIsMatch(id) {
    cardsArray.map(card => {
      if (card.id === id) {
        card.isMatch = true;
      }
      return card;
    })
  }

  function getCardById(id) {
    return document.getElementById(id);
  }

  function findCardInArrayById(id) {
    return cardsArray.find((card) => card.id === id);
  }

  function checkForMatch(id) {
    const cardInArray = findCardInArrayById(id);
    const cardInMarkup = getCardById(id);

    if (cardInArray.isMatch) {
      return;
    }

    if (firstCard !== null && secondCard !== null) {
      getCardById(firstCard).classList.remove('open');
      getCardById(secondCard).classList.remove('open');
      firstCard = null;
      secondCard = null;
    }

    cardInMarkup.classList.add('open');

    if (firstCard === null) {
      firstCard = id;
    } else {
      secondCard = id;
    }

    if (firstCard === secondCard) {
      return;
    }

    if (firstCard !== null && secondCard !== null) {
      let firstCardNumber = findCardInArrayById(firstCard);
      let secondCardNumber = findCardInArrayById(secondCard);


      if (firstCardNumber.value === secondCardNumber.value) {
        getCardById(firstCard).classList.add('success');
        updateStatusIsMatch(firstCard);

        getCardById(secondCard).classList.add('success');
        updateStatusIsMatch(secondCard);
      }
    }

    if (cardsArray.every(card => {
      return card.isMatch;
    })) {
      clearInterval(timerInterval);

      const stopwatch = document.getElementById('stopwatch');
      clearInterval(stopwatchId);
      const stopwatchData = stopwatch.textContent;

      let localStorageData = getDataFromLocalStorage(gameConfig.difficulty);
      if (!localStorageData || stopwatchData < localStorageData) saveRecordToLocalStorage(gameConfig.difficulty, stopwatchData);

      const container = document.getElementById('container');
      const modal = showModalWindow('Победа!');

      container.append(modal);
    }
  }



  function remember(form) {
    let radioChecked = [];
    let formRadio = form.getElementsByTagName('input');
    let radioCheckedlength = formRadio.length;

    for (let i = 0; i < radioCheckedlength; i++) {
      // Добавляем состояние каждой радиокнопки в массив
      radioChecked.push(formRadio[i].checked);
    }
    // Сохраняем массив в localStorage
    localStorage.radioChecked = JSON.stringify(radioChecked);
  }

  // Вспоминаем
  function recollect(form) {
    // Проверяем, существуют ли сохраненные данные
    if (localStorage.radioChecked) {
      let radioChecked = JSON.parse(localStorage.radioChecked); // Загружаем массив состояний радиокнопок
      let formRadio = form.getElementsByTagName('input');
      let radioCheckedlength = formRadio.length;

      for (let i = 0; i < radioCheckedlength; i++) {
        // Восстанавливаем состояние каждой радиокнопки
        formRadio[i].checked = radioChecked[i];
      }
    }
  }

  function startGame() {
    const stopwatch = document.getElementById('stopwatch');

    if (gameConfig.withTimer === 'yes') {
      document.getElementById('timer').style.display = "flex";
      totalTime = timerMap[gameConfig.difficulty];
      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        totalTime = updateTimer(totalTime, timerInterval);
      }, 1000);
    } else {
      document.getElementById('stopwatch').style.display = "flex";
    }

    const field = document.getElementById('playing-field');
    field.className = 'playing-field';

    field.classList.add(gameConfig.difficulty);

    const container = document.getElementById('playing-group');
    const cardNumbers = createCardNumbersArray(pairsMap[gameConfig.difficulty]);
    const game = createPlayingField(cardNumbers);
    container.insertBefore(stopwatch, game);

    const stopButton = document.getElementById('stop-button');
    stopButton.style.display = 'flex';

    stopButton.addEventListener('click', () => location.reload());
  }







  function dataToJson(data) {
    return JSON.stringify(data);
  }

  function jsonToData(data) {
    return JSON.parse(data);
  }

  function getData(key) {
    return localStorage.getItem(key);
  }

  function setData(key, data) {
    localStorage.setItem(key, data);
  }

  function saveToLocalStorage(key, data) {
    const jsonData = dataToJson(data); // Преобразуем данные в JSON
    setData(key, jsonData); // Сохраняем данные в LocalStorage под указанным ключом
  }

  function getDataFromLocalStorage(key) {
    let jsonData = getData(key); // Получаем данные из localStorage по указанному ключу

    jsonData = jsonData ? jsonToData(jsonData) : {}; //если есть данные, то их преобразуем в объект

    return jsonData;
  }

  function saveRecordToLocalStorage(difficulty, time) {
    const records = getDataFromLocalStorage('records');
    records[difficulty] = time;
    saveToLocalStorage('records', records);
  }

  const lightStyles = document.querySelectorAll('link[rel=stylesheet][media*=prefers-color-scheme][media*=light]');
  const darkStyles = document.querySelectorAll('link[rel=stylesheet][media*=prefers-color-scheme][media*=dark]');
  const darkSchemeMedia = matchMedia('(prefers-color-scheme: dark)');
  const switcherRadios = document.querySelectorAll('.theme');

  function setupSwitcher() {
    const savedScheme = getSavedScheme();

    if (savedScheme !== null) {
      const currentRadio = document.querySelector(`.theme[value=${savedScheme}]`);
      currentRadio.checked = true;
    }

    [...switcherRadios].forEach((radio) => {
      radio.addEventListener('change', (event) => {
        setScheme(event.target.value);
      });
    });
  }

  function setupScheme() {
    const savedScheme = getSavedScheme();
    const systemScheme = getSystemSheme();

    if (savedScheme === null) return;

    if (savedScheme !== systemScheme) {
      setScheme(savedScheme);
    }
  }

  function setScheme(scheme) {
    switchMedia(scheme);

    if (scheme === 'system') {
      clearScheme();
    } else {
      setData('color-scheme', scheme);
    }
  }

  function switchMedia(scheme) {
    let lightMedia;
    let darkMedia;

    if (scheme === 'system') {
      lightMedia = '(prefers-color-scheme: light)';
      darkMedia = '(prefers-color-scheme: dark)';
    } else {
      lightMedia = (scheme === 'light') ? 'all' : 'not all';
      darkMedia = (scheme === 'dark') ? 'all' : 'not all';
    }

    [...lightStyles].forEach((link) => {
      link.media = lightMedia;
    });

    [...darkStyles].forEach((link) => {
      link.media = darkMedia;
    });
  }

  function getSystemSheme() {
    const darkScheme = darkSchemeMedia.matches;

    return darkScheme ? 'dark' : 'light';
  }

  function getSavedScheme() {
    return localStorage.getItem('color-scheme');
  }

  function clearScheme() {
    localStorage.removeItem('color-scheme');
  }

  function initGame() {
    const mainMenu = document.getElementById('main-menu');
    const startButton = document.getElementById('start-button');
    const settingsButton = document.getElementById('settings-button');
    const form = document.getElementById('settings-form');

    setupSwitcher();
    setupScheme();

    updateDisplay(totalTime);

    startButton.addEventListener('click', () => {
      mainMenu.style.display = 'none';
      getSelectedSettings(gameConfig);
      startGame();
    })

    settingsButton.addEventListener('click', () => {
      mainMenu.style.display = 'none';
      form.style.display = 'block';
    })

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      getSelectedSettings(gameConfig);
      mainMenu.style.display = 'block';
    })
  }

  initGame();
})();
