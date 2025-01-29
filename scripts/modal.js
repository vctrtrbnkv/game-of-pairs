export function showModalWindow(text) {
  const modal = document.getElementById('modal');
  const modalText = document.getElementById('modal-text');

  modal.classList.add('modal-is-active');

  modalText.textContent = text;

  return modal;
}
