import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { escapeHtml } from '../utils/escape-html.js';

const createTemplate = ({ cities, period, cost }) => `
  <section class="trip-main__trip-info trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">
        ${escapeHtml(cities)}
      </h1>

      <p class="trip-info__dates">
        ${escapeHtml(period)}
      </p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;
      <span class="trip-info__cost-value">
        ${escapeHtml(cost)}
      </span>
    </p>
  </section>
`;

export default class InfoView extends AbstractStatefulView {
  constructor() {
    super();

    this._setState({
      cities: '',
      period: '',
      cost: 0,
    });
  }

  get template() {
    return createTemplate(this._state);
  }

  _restoreHandlers() {}

  setInfo(info) {
    this._setState(info);
  }
}
