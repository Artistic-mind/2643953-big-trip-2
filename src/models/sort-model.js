import { DEFAULT_SORT } from '../constants/constants.js';
import Observable from '../framework/observable.js';


export default class SortModel extends Observable{
  #activeSort = null;

    init() {

      this.#activeSort = DEFAULT_SORT;
    }

    get sort(){
      return this.#activeSort;
    }

    setSort(sort) {
      this.#activeSort = sort;

      this._notify('Sort_CHANGED', this.#activeSort);

    }
}
