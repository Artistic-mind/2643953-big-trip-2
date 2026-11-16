import Observable from '../framework/observable.js';

export default class AppModel extends Observable {
  #openedForm = null;

  get openedForm() {
    return this.#openedForm;
  }

  openEditForm(id) {
    this.#openForm({
      type: 'edit',
      id,
    })
  }

  openCreateForm() {
    this.#openForm({
      type: 'create',
    })
  }

  #openForm(form) {
    const closeForm = this.#openedForm;
    this.#openedForm = form;

    this._notify('OPEN', {
      closed: closeForm,
      opened: this.#openedForm,
    })
  }

  closeForm() {
    if(!this.#openedForm){
      return;
    }

    const closeForm = this.#openedForm;
    this.#openedForm = null;

    this._notify('CLOSE', {
      closed: closeForm,
    })
  }
}
