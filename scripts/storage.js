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
