import { DEFAULT_SORT, SortEventTypes } from '../constants/constants.js';
import Observable from '../framework/observable.js';


export default class SortModel extends Observable {
  #activeSort = null;
  #isVisible = false;

  init() {

    this.#activeSort = DEFAULT_SORT;
  }

  get sort() {
    return this.#activeSort;
  }

  setSort(sort) {
    this.#activeSort = sort;

    this._notify(SortEventTypes.SORT_CHANGED, this.#activeSort);

  }

  get isVisible() {
    return this.#isVisible;
  }

  sortOn() {
    if (this.#isVisible) {
      return;
    }

    this.#isVisible = true;

    this._notify(SortEventTypes.SORT_ON);
  }

  sortOff() {
    this.#isVisible = false;

    this._notify(SortEventTypes.SORT_OFF);
  }
}
