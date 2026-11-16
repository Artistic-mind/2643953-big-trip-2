import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

dayjs.extend(duration);


const DATE_FORMAT = 'DD/MM/YY HH:mm';

const formatDate = (date) => dayjs(date).format(DATE_FORMAT);
const formatMonthDay = (date) => dayjs(date).format('MMM D').toUpperCase(); // "MAR 18"
const formatTime = (date) => dayjs(date).format('HH:mm');
const formatDateTimeAttr = (date) => dayjs(date).format('YYYY-MM-DDTHH:mm');

const formatDuration = (dateFrom, dateTo) => {
  const diffMs = dayjs(dateTo).diff(dayjs(dateFrom));
  const dur = dayjs.duration(diffMs);

  const days = Math.floor(dur.asDays());
  const hours = dur.hours();
  const minutes = dur.minutes();

  if (days > 0) {
    return `${String(days).padStart(2, '0')}D ${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  }
  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  }
  return `${String(minutes).padStart(2, '0')}M`;
};


const createOfferTemplate = (offer) => `
  <li class="event__offer">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </li>
`;

const createTemplate = ({point, destinationName, checkedOffers, isFavorite}) => `
  <li class="trip-events__item">
    <div class="event">
      <time
        class="event__date"
        datetime="${dayjs(point.dateFrom).format('YYYY-MM-DD')}"
        > ${formatMonthDay(point.dateFrom)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${point.type} ${destinationName}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time
            class="event__start-time"
            datetime="${formatDateTimeAttr(point.dateFrom)}"
            >${formatTime(point.dateFrom)}</time>
          &mdash;
          <time
            class="event__end-time"
            datetime="${formatDateTimeAttr(point.dateTo)}"
            > ${formatTime(point.dateTo)}</time>
        </p>
        <p class="event__duration">${formatDuration(point.dateFrom, point.dateTo)}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${point.basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">

        ${checkedOffers.map((offer) => createOfferTemplate(offer)).join('')}
      </ul>
      <button
        class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}"
        type="button"
      >
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z" />
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>
 `;

export default class PointView extends AbstractStatefulView {
  #point = null;
  #destinationName = null;
  #checkedOffers = null;
  #onEditClick = null;
  #onFavoriteClick = null;

  constructor({
    point,
    destinationName,
    checkedOffers,
    onEditClick,
    onFavoriteClick,
  }){
    super();
    this.#point = point;
    this.#destinationName = destinationName;
    this.#checkedOffers = checkedOffers;
    this.#onEditClick = onEditClick;
    this.#onFavoriteClick = onFavoriteClick;

    this._setState({

      isFavorite: this.#point.isFavorite
    })

    this._restoreHandlers();
  }


 _restoreHandlers(){
     this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);

     this.element
     .querySelector('.event__favorite-btn')
     .addEventListener('click', this.#handleFavoriteClick);
 }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#onEditClick?.();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onFavoriteClick?.();
  };

  get template() {
    return createTemplate({
      point: this.#point,
      destinationName: this.#destinationName,
      checkedOffers: this.#checkedOffers,
      isFavorite: this._state.isFavorite,
    });
  }

  #handleFavoriteClick = () => {
    this.#onFavoriteClick();
  };
}
