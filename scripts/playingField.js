import { createCard } from "./card.js";

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

export function createPlayingField(count) {
  const cardNumbersArray = createCardNumbersArray(count);

  const field = document.getElementById('playing-field');
  field.innerHTML = '';

  cardNumbersArray.forEach((element, index) => {
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

