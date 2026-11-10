import { DEFAULT_FILTER } from '../constants/constants.js';
import Observable from '../framework/observable.js';


export default class FilterModel extends Observable{
  #activeFilter = null;

  init() {

    this.#activeFilter = DEFAULT_FILTER;
  }

  get filter(){
    return this.#activeFilter;
  }

  setFilter(filter) {
    this.#activeFilter = filter;

    this._notify('FILTER_CHANGED', this.#activeFilter);

  }
}
