export function updateStopwatch(seconds, minutes) {
  const stopwatch = document.getElementById('stopwatch');

  seconds++;
  if (seconds === 60) {
    minutes++;
    seconds = 0;
  }

  stopwatch.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return {
    seconds,
    minutes
  }
}
