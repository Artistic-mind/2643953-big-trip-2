import AbstractView from '../framework/view/abstract-view.js';

const createTemplate = (text) => (`
   <p class="trip-events__msg">${text}</p>
`);

export default class MessageView extends AbstractView {
  #text = null;

  constructor({ text }) {
    super();
    this.#text = text;
  }
  
  get template() {
    return createTemplate(this.#text);
  }
}