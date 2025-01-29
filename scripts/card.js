export function createCard(id) {
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
