import {
  showModalWindow
 } from "./modal.js";

export function updateTimer(totalTime, timerId) {
  if (totalTime > 0) {
    totalTime--;
    updateDisplay(totalTime);
  } else {
    clearInterval(timerId);
    showModalWindow('Вы проиграли!');
  }

  if (totalTime < 4) {
    document.getElementById('timer').classList.add('timer-attention');
  }

  return totalTime;
}

export function updateDisplay(totalTime) {
  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;
  document.getElementById('timer').innerText =
    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
