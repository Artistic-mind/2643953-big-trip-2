import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import dayjs from 'dayjs';
import { Types } from '../constants/constants.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getPreparedOffers } from '../utils/offers.js';


const DATE_FORMAT = 'DD/MM/YY HH:mm';

const formatDate = (date) => dayjs(date).format(DATE_FORMAT);

const createPhotoTemplate = (picture) => (`
  <img class="event__photo" src="${picture.src}" alt="${picture.description}">
`);

const createDestinationOptionTemplate = (d) => `<option value="${d.name}"></option>`;

const createTemplate = ({ point, offers, destination, destinations, isNew }) => (`
  <li class="trip-events__item">
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
                ${Object.values(Types).map((item) => `
                  <div class="event__type-item">
                    <input
                      id="event-type-${item}-1"
                      class="event__type-input  visually-hidden"
                      type="radio" name="event-type"
                      value=${item}
                      ${item === point.type ? 'checked' : ''}
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
          <input
            class="event__input  event__input--destination"
            id="event-destination-1"
            type="text"
            name="event-destination"
            value="${destination?.name ?? ''}"
            list="destination-list-1"
          >
            <datalist id="destination-list-1">
               ${destinations.map(createDestinationOptionTemplate).join('')}
            </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input
            class="event__input event__input--time"
            id="event-start-time-1"
            type="text"
            name="event-start-time"
            value="${formatDate(point.dateFrom)}"
          >
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input
              class="event__input  event__input--time"
              id="event-end-time-1"
              type="text"
              name="event-end-time"
              value="${formatDate(point.dateTo)}"
            >
            </div>

            <div class="event__field-group  event__field-group--price">
              <label class="event__label" for="event-price-1">
                <span class="visually-hidden">Price</span>
                &euro;
              </label>
              <input
                class="event__input  event__input--price"
                id="event-price-1"
                type="text"
                name="event-price"
                value="${point.basePrice}"
              >
            </div>

            <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
            <button class="event__reset-btn" type="reset">${isNew ? 'Cancel' : 'Delete'}</button>
            ${!isNew
    ? (`
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                `)
    : ''
  }

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
  </li>
`);

const DEFAULT_POINT = {

  basePrice: 0,
  dateFrom: '',
  dateTo: '',
  destination: '',
  isFavorite: false,
  offers: [],
  type: 'flight',
};

export default class FormView extends AbstractStatefulView {

  #offersByType = null;
  #destinations = null;
  #onFormSubmit = null;
  #onRollupClick = null;

  constructor({
    point,
    offersByType,
    destinations,
    isNew = false,
    onFormSubmit,
    onRollupClick }) {
    super();

    this.#offersByType = offersByType;
    this.#destinations = destinations;
    this.#onFormSubmit = onFormSubmit;
    this.#onRollupClick = onRollupClick;

    this._setState({
      ... this.#parsePointToState(point, isNew),
    })
    this._restoreHandlers();
  }

  _restoreHandlers() {


    const dateFormat = 'd/m/y H:i';

    const startTimeInput = this.element.querySelector('#event-start-time-1');
    const endTimeInput = this.element.querySelector('#event-end-time-1');

    if (startTimeInput) {
      flatpickr(startTimeInput, {
        enableTime: true,
        dateFormat: dateFormat,
        time_24hr: true,
      });
    }

    if (endTimeInput) {
      flatpickr(endTimeInput, {
        enableTime: true,
        dateFormat: dateFormat,
        time_24hr: true,
      });
    }






    if (!this._state.isNew) {
      this.element
        .querySelector('.event__rollup-btn')
        .addEventListener('click', this.#handleRollupClick);
    }

    this.element
      .addEventListener('submit', this.#handleFormSubmit);

    this.element
      .querySelector('.event__type-group')
      .addEventListener('change', this.#handleTypeChange);

    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#handleResetClick);

    this.element
      .querySelector('.event__input--price')
      .addEventListener('change', this.#handlePriceChange);

    this.element
      .querySelectorAll('.event__input--time')
      .forEach((input) => {
        input.addEventListener('change', this.#handleDateChange);
      });

    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#handleDestinationChange);
  }

  #handlePriceChange = (evt) => {
    const price = Number(evt.target.value);
    if (!Number.isNaN(price)) {
      this.updateElement({
        point: { ...this._state.point, basePrice: price },
      });
    }
  };

  #handleDateChange = (evt) => {
    const { name, value } = evt.target;
    const key = name === 'event-start-time' ? 'dateFrom' : 'dateTo';
    const parsed = dayjs(value, DATE_FORMAT, true); // строгий парсинг
    if (parsed.isValid()) {
      this.updateElement({
        point: { ...this._state.point, [key]: parsed.toDate() },
      });
    }
  };

  #handleRollupClick = (evt) => {
    evt.preventDefault();
    this.#onRollupClick();
  };

  #handleFormSubmit = (evt) => {
    evt.preventDefault();
    this.#onFormSubmit(this._state.point);
  };

  #handleResetClick = (evt) => {
    evt.preventDefault();
    if (this._state.isNew) {
      this.#onRollupClick();
    } else {
      console.log('deleting');
    }
  }

  #handleTypeChange = ({ target }) => {
    this.updateElement({
      point: {
        ...this._state.point,
        type: target.value,
        offers: [],
      },
      offers: getPreparedOffers({
        checkedOffers: [],
        allOffers: this.#offersByType.find((item) => item.type === target.value)?.offers
      })
    })
  };

  #handleDestinationChange = (evt) => {
    const { value } = evt.target;
    const found = this.#destinations.find((d) => d.name === value);

    if (!found) {
      evt.target.value =
        this.#destinations.find((d) => d.id === this._state.point.destination)?.name ?? '';
      return;
    }

    this.updateElement({
      point: { ...this._state.point, destination: found.id },

    });
  };

  get template() {

    const destination =
      this.#destinations.find((d) => d.id === this._state.point.destination) ?? null;

    return createTemplate({
      ...this._state,
      destination,
      destinations: this.#destinations,
    });
  }


  reset(point) {
    this.updateElement({
      ... this.#parsePointToState(point),
    })
  }

  #parsePointToState = (point = null, isNew = false) => {
    const preparedPoint = {
      ...DEFAULT_POINT,
      ...(point ?? {}),
      offers: [...(point?.offers ?? [])],
    };
    return {
      point: preparedPoint,
      offers: getPreparedOffers({
        checkedOffers: [...(preparedPoint?.offers ?? [])],
        allOffers: this.#offersByType.find((item) => item.type === preparedPoint.type)?.offers,
      }),
      //isNew: point === null,
      isNew,
    };

  };
}
