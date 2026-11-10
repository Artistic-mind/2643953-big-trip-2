import { Sorting } from '../constants/constants.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';


const createTemplate = ({sort}) => (`
  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">

    ${Object.values(Sorting).map(({name, isDisabled})=> (`
      <div class="trip-sort__item  trip-sort__item--${name}">
        <input
          id="sort-${name}"
          class="trip-sort__input  visually-hidden"
          type="radio"
          name="trip-sort"
          value="sort-${name}"

          ${sort === `sort-${name}` ? 'checked' : ''}
          ${isDisabled ? 'disabled':''}
        >
        <label
          class="trip-sort__btn"
          for="sort-${name}"
        >${name}</label>
      </div>
    `)).join('')}
  </form>
          `);

export default class SortingView extends AbstractStatefulView{
    #onChange = null;
  constructor({sort, onChange}){
    super();
    this.#onChange = onChange;
    this._setState({
      sort,

    });

    this._restoreHandlers();
  }

  _restoreHandlers(){
    this.element.addEventListener('change', this.#handleChange);
  }

  get template() {
    return createTemplate({
      sort: this._state.sort
    });
  }

  #handleChange = ({target}) => {
    console.log(target.value);
    this.#onChange (target.value);
  };
}
