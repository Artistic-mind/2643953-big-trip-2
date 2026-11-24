import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const createTemplate = ({ isDisabled }) => (`
  <button
    class="trip-main__event-add-btn  btn  btn--big  btn--yellow"
    type="button"
    ${isDisabled ? 'disabled' : ''}
  >New event</button>
`);

export default class CreateButtonView extends AbstractStatefulView {
  #onClick = null;
  constructor({
    onClick = ()=>{}
  }) {
    super();
    this.#onClick = onClick;
    this._setState({
      isDisabled: true,
    });
    this._restoreHandlers();
  }

  get template() {
    return createTemplate(this._state);
  }

  _restoreHandlers() {
    this.element.addEventListener('click', this.#handleClick);
  }

  #handleClick = () => {
    this.#onClick();
    this.updateElement({
      isDisabled: true,
    });
  };

}


