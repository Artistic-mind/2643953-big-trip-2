
import { DEFAULT_FILTER, Filters } from '../constants/constants.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
const createTemplate = ({filter, filters}) => (`
  <form class="trip-filters" action="#" method="get">

   ${filters.map((item) => (`
      <div class="trip-filters__filter">
        <input
         id="filter-${item.name}"
          class="trip-filters__filter-input
          visually-hidden"
          type="radio"
          name="trip-filter"
          value="${item.name}"
          ${filter === item.name ? 'checked' : ''}
          ${item.isDisabled ? 'disabled' : ''}
        >
       <label
         class="trip-filters__filter-label"
         for="filter-${item.name}"
       >${item.name}</label>
     </div>
    `)).join('')}
  </form> `);

export default class FilterView extends AbstractStatefulView {
  #onChange = null;
  constructor({ filter, onChange, filters }) {
    super();
    this.#onChange = onChange;
    this._setState({
      filter,
      filters
    });
    this._restoreHandlers();
  }
  _restoreHandlers() {
    this.element.addEventListener('change', this.#handleChange);
  }
  get template() {
    return createTemplate({
      filter: this._state.filter,
      filters: this._state.filters
    });
  }

  #handleChange = ({ target }) => {

    this.#onChange(target.value);
  };
}
