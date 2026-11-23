export const setFormPending = (formView, action = null) => {
  const form = formView.element.querySelector('form');

  if (!form) {
    return;
  }

  if (action) {
    form.querySelector('.event__error')?.remove();
  }

  const isPending = action !== null;

  form.querySelectorAll('input, button').forEach((control) => {
    control.disabled = isPending;
  });

  const saveButton = form.querySelector('.event__save-btn');
  const resetButton = form.querySelector('.event__reset-btn');

  if (resetButton && !resetButton.dataset.defaultText) {
    resetButton.dataset.defaultText = resetButton.textContent;
  }

  if (saveButton) {
    saveButton.textContent = action === 'saving' ? 'Saving...' : 'Save';
  }

  if (resetButton) {
    resetButton.textContent = action === 'deleting'
      ? 'Deleting...'
      : resetButton.dataset.defaultText;
  }
};

export const showFormError = (formView, message) => {
  const form = formView.element.querySelector('form');

  if (!form) {
    return;
  }

  form.querySelector('.event__error')?.remove();

  const errorElement = document.createElement('p');
  errorElement.className = 'event__error';
  errorElement.setAttribute('role', 'alert');
  errorElement.textContent = message;

  form.querySelector('.event__header')?.append(errorElement);

  formView.shake();
};
