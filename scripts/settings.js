import { getJsonFromLocalStorage, saveToLocalStorage } from "./storage.js";

export function getSelectedSettings(gameConfig) {
  const form = document.getElementById('settings-form');

  gameConfig.difficulty = form.querySelector('input[name="difficulty"]:checked').value;

  gameConfig.withTimer = form.querySelector('input[name="timer"]:checked').value;

  form.style.display = "none";
}

const lightStyles = document.querySelectorAll('link[rel=stylesheet][media*=prefers-color-scheme][media*=light]');
const darkStyles = document.querySelectorAll('link[rel=stylesheet][media*=prefers-color-scheme][media*=dark]');
const darkSchemeMedia = matchMedia('(prefers-color-scheme: dark)');

function getSystemSheme() {
  const darkScheme = darkSchemeMedia.matches;

  return darkScheme ? 'dark' : 'light';
}

export function setupScheme() {
  const savedSettings = getJsonFromLocalStorage('settings');
  const savedScheme = savedSettings.scheme;
  const systemScheme = getSystemSheme();

  if (!savedScheme) return;

  if (savedScheme !== systemScheme) {
    switchMedia(savedScheme);
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

const settingsRadioButtonsListeners = {
  difficulty: (value) => { },
  scheme: switchMedia,
};

export function setupSettingsRadioButtons() {
  const savedSettings = getJsonFromLocalStorage('settings');
  const settingsRadioButtons = document.querySelectorAll('[type=radio]');

  settingsRadioButtons.forEach((radioButton) => {

    if (savedSettings[radioButton.name] === radioButton.value) {
      radioButton.checked = true;
    }

    radioButton.addEventListener('change', (event) => {
      const updatedSettings = getJsonFromLocalStorage('settings');
      const name = event.target.name;
      const value = event.target.value;

      saveToLocalStorage('settings', {
        ...updatedSettings,
        [name]: value,
      });

      const listener = settingsRadioButtonsListeners[name];
      if (!listener) return;
      listener(value);

    });
  });
}
