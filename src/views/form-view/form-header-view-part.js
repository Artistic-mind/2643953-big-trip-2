import dayjs from 'dayjs';
import { Type } from '../../constants/constants.js';
import { escapeHtml } from '../../utils/escape-html.js';

const DATE_FORMAT = 'DD/MM/YY HH:mm';

const formatDate = (date) =>
  date ? dayjs(date).format(DATE_FORMAT) : '';

const createTypeTemplate = (type, selectedType) => `
  <div class="event__type-item">
    <input
      id="event-type-${type}-1"
      class="event__type-input visually-hidden"
      type="radio"
      name="event-type"
      value="${type}"
      ${type === selectedType ? 'checked' : ''}
    >
    <label
      class="event__type-label event__type-label--${type}"
      for="event-type-${type}-1"
    >${type}</label>
  </div>
`;

const createDestinationOptionTemplate = (destination) => `
  <option value="${escapeHtml(destination.name)}"></option>
`;

export const createFormHeaderTemplate = ({
  point,
  destination,
  destinations,
  isNew,
}) => `
  <header class="event__header">
    <div class="event__type-wrapper">
      <label
        class="event__type event__type-btn"
        for="event-type-toggle-1"
      >
        <span class="visually-hidden">Choose event type</span>
        <img
          class="event__type-icon"
          width="17"
          height="17"
          src="img/icons/${point.type}.png"
          alt="Event type icon"
        >
      </label>

      <input
        class="event__type-toggle visually-hidden"
        id="event-type-toggle-1"
        type="checkbox"
      >

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${Object.values(Type)
    .map((type) => createTypeTemplate(type, point.type))
    .join('')}
        </fieldset>
      </div>
    </div>

    <div class="event__field-group event__field-group--destination">
      <label
        class="event__label event__type-output"
        for="event-destination-1"
      >${point.type}</label>

      <input
        class="event__input event__input--destination"
        id="event-destination-1"
        type="text"
        name="event-destination"
        value="${escapeHtml(destination?.name ?? '')}"
        list="destination-list-1"
        required
      >

      <datalist id="destination-list-1">
        ${destinations.map(createDestinationOptionTemplate).join('')}
      </datalist>
    </div>

    <div class="event__field-group event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">
        From
      </label>
      <input
        class="event__input event__input--time"
        id="event-start-time-1"
        type="text"
        name="event-start-time"
        value="${escapeHtml(formatDate(point.dateFrom))}"
        required
      >

      &mdash;

      <label class="visually-hidden" for="event-end-time-1">
        To
      </label>
      <input
        class="event__input event__input--time"
        id="event-end-time-1"
        type="text"
        name="event-end-time"
        value="${escapeHtml(formatDate(point.dateTo))}"
        required
      >
    </div>

    <div class="event__field-group event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input
        class="event__input event__input--price"
        id="event-price-1"
        type="number"
        name="event-price"
        value="${escapeHtml(point.basePrice)}"
        min="1"
        step="1"
        required
      >
    </div>

    <button class="event__save-btn btn btn--blue" type="submit">
      Save
    </button>

    <button class="event__reset-btn" type="reset">
      ${isNew ? 'Cancel' : 'Delete'}
    </button>

    ${isNew ? '' : `
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    `}
  </header>
`;
