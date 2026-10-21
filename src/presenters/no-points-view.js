import AbstractView from '../framework/view/abstract-view.js';

const createTemplate = (message) => `<p class="trip-events__msg">${message}</p>`;

export default class NoPointsView extends AbstractView {
  #message = null;

  constructor({ message = 'Click New Event to create your first point' } = {}) {
    super();
    this.#message = message;
  }

  get template() {
    return createTemplate(this.#message);
  }
}
