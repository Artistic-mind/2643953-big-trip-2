import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import dayjs from 'dayjs';

import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';
import { getPreparedOffers } from '../../utils/offers.js';
import { createFormHeaderTemplate } from './form-header-view-part.js';
import { createFormDetailsTemplate } from './form-details-view-part.js';
import { DATEPICKER_FORMAT } from '../../constants/constants.js';

const createTemplate = ({
  point,
  offers,
  destination,
  destinations,
  isNew,
}) => `
  <li class="trip-events__item">
    <form
      class="event event--edit"
      action="#"
      method="post"
    >
      ${createFormHeaderTemplate({
        point,
        destination,
        destinations,
        isNew,
      })}

      ${createFormDetailsTemplate({
        offers,
        destination,
      })}
    </form>
  </li>
`;

export default class FormView extends AbstractStatefulView {
  #offersByType = null;
  #destinations = null;
  #onFormSubmit = null;
  #onRollupClick = null;
  #onResetClick = null;

  #dateFromPicker = null;
  #dateToPicker = null;

  constructor({
    point,
    offersByType,
    destinations,
    isNew = false,
    onFormSubmit,
    onRollupClick,
    onResetClick,
  }) {
    super();

    this.#offersByType = offersByType;
    this.#destinations = destinations;
    this.#onFormSubmit = onFormSubmit;
    this.#onRollupClick = onRollupClick;
    this.#onResetClick = onResetClick;

    this._setState(this.#parsePointToState(point, isNew));
    this._restoreHandlers();
  }

  get template() {
    const destination =
      this.#destinations.find(
        (item) => item.id === this._state.point.destination
      ) ?? null;

    return createTemplate({
      ...this._state,
      destination,
      destinations: this.#destinations,
    });
  }

  _restoreHandlers() {
    this.#initDatepickers();

    if (!this._state.isNew) {
      this.element
        .querySelector('.event__rollup-btn')
        .addEventListener('click', this.#handleRollupClick);
    }

    this.element.addEventListener(
      'submit',
      this.#handleFormSubmit
    );

    this.element
      .querySelector('.event__type-group')
      .addEventListener('change', this.#handleTypeChange);

    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#handleResetClick);

    this.element
      .querySelector('.event__input--price')
      .addEventListener('input', this.#handlePriceInput);

    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#handleDestinationChange);

    this.element
      .querySelector('.event__available-offers')
      ?.addEventListener('change', this.#handleOffersChange);
  }

  #initDatepickers() {
    this.#destroyDatepickers();

    const dateFrom = this._state.point.dateFrom
      ? new Date(this._state.point.dateFrom)
      : undefined;

    const dateTo = this._state.point.dateTo
      ? new Date(this._state.point.dateTo)
      : undefined;

    const options = {
      enableTime: true,
      dateFormat: DATEPICKER_FORMAT,
      time_24hr: true,
      minuteIncrement: 1,
    };

    this.#dateFromPicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        ...options,
        defaultDate: dateFrom,
        maxDate: dateTo,
        onChange: this.#handleDateFromChange,
      }
    );

    this.#dateToPicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        ...options,
        defaultDate: dateTo,
        minDate: dateFrom,
        onChange: this.#handleDateToChange,
      }
    );
  }

  #destroyDatepickers() {
    this.#dateFromPicker?.destroy();
    this.#dateToPicker?.destroy();

    this.#dateFromPicker = null;
    this.#dateToPicker = null;
  }

  removeElement() {
    this.#destroyDatepickers();
    super.removeElement();
  }

  #handleDateFromChange = ([date]) => {
    const dateFrom = date
      ? new Date(date.getTime())
      : '';

    this._setState({
      point: {
        ...this._state.point,
        dateFrom,
      },
    });

    this.#dateToPicker?.set(
      'minDate',
      dateFrom || undefined
    );
  };

  #handleDateToChange = ([date]) => {
    const dateTo = date
      ? new Date(date.getTime())
      : '';

    this._setState({
      point: {
        ...this._state.point,
        dateTo,
      },
    });

    this.#dateFromPicker?.set(
      'maxDate',
      dateTo || undefined
    );
  };

  #handlePriceInput = (evt) => {
    this._setState({
      point: {
        ...this._state.point,
        basePrice: evt.target.value,
      },
    });
  };

  #handleOffersChange = () => {
    const checkedOffersIds = Array.from(
      this.element.querySelectorAll(
        '.event__offer-checkbox:checked'
      ),
      (input) => input.value
    );

    this._setState({
      point: {
        ...this._state.point,
        offers: checkedOffersIds,
      },
    });
  };

  #handleTypeChange = ({ target }) => {
    const availableOffers =
      this.#offersByType.find(
        (item) => item.type === target.value
      )?.offers ?? [];

    this.updateElement({
      point: {
        ...this._state.point,
        type: target.value,
        offers: [],
      },
      offers: getPreparedOffers({
        checkedOffers: [],
        allOffers: availableOffers,
      }),
    });
  };

  #handleDestinationChange = (evt) => {
    const selectedDestination = this.#destinations.find(
      (destination) => destination.name === evt.target.value
    );

    if (!selectedDestination) {
      evt.target.value =
        this.#destinations.find(
          (destination) =>
            destination.id === this._state.point.destination
        )?.name ?? '';

      return;
    }

    this.updateElement({
      point: {
        ...this._state.point,
        destination: selectedDestination.id,
      },
    });
  };

  #handleFormSubmit = (evt) => {
    evt.preventDefault();

    const destinationInput = this.element.querySelector(
      '.event__input--destination'
    );

    const selectedDestination = this.#destinations.find(
      (destination) =>
        destination.name === destinationInput.value
    );

    if (!selectedDestination) {
      destinationInput.value = '';
      destinationInput.focus();
      destinationInput.reportValidity();
      return;
    }

    const { dateFrom, dateTo, basePrice } = this._state.point;

    if (!dateFrom) {
      this.#dateFromPicker?.open();
      return;
    }

    if (!dateTo || dayjs(dateTo).isBefore(dayjs(dateFrom))) {
      this.#dateToPicker?.open();
      return;
    }

    const price = Number(basePrice);

    if (!Number.isInteger(price) || price <= 0) {
      const priceInput = this.element.querySelector(
        '.event__input--price'
      );

      priceInput.focus();
      priceInput.reportValidity();
      return;
    }

    this.#onFormSubmit({
      ...this.#parseStateToPoint(this._state),
      destination: selectedDestination.id,
      basePrice: price,
    });
  };

  #handleResetClick = (evt) => {
    evt.preventDefault();
    this.#onResetClick?.();
  };

  #handleRollupClick = (evt) => {
    evt.preventDefault();
    this.#onRollupClick();
  };

  reset(point) {
    this.updateElement(
      this.#parsePointToState(point, this._state.isNew)
    );
  }

  #parsePointToState = (point = null, isNew = false) => {
    const preparedPoint = {
      ...(point ?? {}),
      offers: [...(point?.offers ?? [])],
    };

    const availableOffers =
      this.#offersByType.find(
        (item) => item.type === preparedPoint.type
      )?.offers ?? [];

    return {
      point: preparedPoint,
      offers: getPreparedOffers({
        checkedOffers: [...preparedPoint.offers],
        allOffers: availableOffers,
      }),
      isNew,
    };
  };

  #parseStateToPoint = (state) => ({
    ...state.point,
  });
}