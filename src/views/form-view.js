import { Types } from '../constants/constants.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
//import AbstractView from '../framework/view/abstract-view.js';

const createPhotoTemplate = (picture) => `
  <img class="event__photo" src="${picture.src}" alt="${picture.description}">
`;

const createTemplate = ({ point, offers, destination }) => `
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${Object.values(Types).map((item)=>`
                <div class="event__type-item">
                  <input
                    id="event-type-${item}-1"
                    class="event__type-input  visually-hidden"
                    type="radio" name="event-type"
                    value=${item}
                    ${item===point.type? "checked" : ""}
                  >
                  <label
                    class="event__type-label  event__type-label--${item}"
                    for="event-type-${item}-1"
                  >${item}</label>
                </div>
                `).join('')}

            </fieldset>
          </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${point.type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="Chamonix" list="destination-list-1">
          <datalist id="destination-list-1">
            <option value="Amsterdam"></option>
            <option value="Geneva"></option>
            <option value="Chamonix"></option>
          </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="18/03/19 12:25">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="18/03/19 13:35">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="160">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              <div class="event__available-offers">
              ${offers.map((item) => (`
                <div class="event__offer-selector">
                  <input
                    class="event__offer-checkbox  visually-hidden"
                    id="event-offer-${item.id}"
                    type="checkbox"
                    name="event-offer-${item.id}"
                    ${item.isChecked ? 'checked' : ''}
                  >
                  <label
                    class="event__offer-label"
                    for="event-offer-${item.id}"
                  >
                    <span class="event__offer-title">${item.title}</span>
                    &plus;&euro;&nbsp;
                    <span class="event__offer-price">${item.price}</span>
                  </label>
                </div>
              `)).join('')}
            </div>
            </div>
          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destination?.description ?? ''}</p>

             <div class="event__photos-container">
               <div class="event__photos-tape">
                 ${(destination?.pictures ?? []).map(createPhotoTemplate).join('')}
               </div>
             </div>
          </section>
        </section>
      </form>
      `;

export default class FormView extends AbstractStatefulView {
  #point = null;
  #offers = null;
  #destination = null;
  #onFormSubmit = null;
  #onRollupClick = null;

  constructor({ point, offers, destination, onFormSubmit, onRollupClick }) {
    super();
    this.#point = point;
    this.#offers = offers;
    this.#destination = destination;
    this.#onFormSubmit = onFormSubmit;
    this.#onRollupClick = onRollupClick;
    this._setState({
      point: this.#point,
    })
    this._restoreHandlers();
  }

  _restoreHandlers() {
     this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#handleRollupClick);

    this.element
      .addEventListener('submit', this.#handleFormSubmit);

    this.element
      .querySelector('.event__type-group')
      .addEventListener('change', this.#handleTypeChange);
  }

  #handleRollupClick = (evt) => {
    evt.preventDefault();
    this.#onRollupClick?.();
  };

  #handleFormSubmit = (evt) => {
    evt.preventDefault();
    this.#onFormSubmit?.();
  };

  #handleTypeChange = ({target}) => {
    this.updateElement({
      point: {
        ...this._state.point,
        type: target.value,
      }
    })
  }

  get template() {
    return createTemplate({
      point: this._state.point,
      offers: this.#offers,
      destination: this.#destination,
    });
  }
}
