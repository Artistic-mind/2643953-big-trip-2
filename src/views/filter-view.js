
import { DEFAULT_FILTER, Filters } from '../constants/constants.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
const createTemplate = (activeFilter) => (`
  <form class="trip-filters" action="#" method="get">

   ${Object.values(Filters).map((item)=>(`
      <div class="trip-filters__filter">
        <input
         id="filter-${item}"
          class="trip-filters__filter-input
          visually-hidden"
          type="radio"
          name="trip-filter"
          value="${item}"
          ${activeFilter === item ? 'checked' : ''}
        >
       <label
         class="trip-filters__filter-label"
         for="filter-${item}"
       >${item}</label>
     </div>
    `)).join('')}
  </form> `);

export default class FilterView extends AbstractStatefulView{
  #onChange = null;
  constructor({ filter, onChange}) {
    super();
    this.#onChange = onChange;
    this._setState({
      filter,

    });
     this._restoreHandlers();
  }
  _restoreHandlers(){
    this.element.addEventListener('change', this.#handleChange);
  }
  get template() {
    return createTemplate(this._state.filter);
  }

  #handleChange = ({target}) => {

     this.#onChange(target.value);
  };
}
