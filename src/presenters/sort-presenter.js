import { DEFAULT_SORT, SortEventType } from '../constants/constants.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import SortingView from '../views/sorting-view.js';

export default class SortPresenter {
  #sortView = null;
  #sortModel = null;
  #filterModel = null;
  #tripContainerElement = null;

  constructor({ sortModel, filterModel, tripContainerElement }) {
    this.#sortModel = sortModel;
    this.#filterModel = filterModel;
    this.#tripContainerElement = tripContainerElement;
  }

  init() {
    this.#sortModel.addObserver(this.#handleSortModelEvent);
    this.#filterModel.addObserver(this.#handleFilterModelEvent);
  }

  #renderSort() {
    this.#sortView = new SortingView({
      sort: this.#sortModel.sort,
      onChange: this.#onChange,
    });
    render(this.#sortView, this.#tripContainerElement, RenderPosition.AFTERBEGIN);
  }

  #onChange = (sort) => {
    this.#sortModel.setSort(sort);
  };

  #handleSortModelEvent = (type, sort) => {
    switch (type) {
      case SortEventType.SORT_CHANGED:
        if (!this.#sortView) {
          return;
        }
        this.#sortView.updateElement({
          sort,
        });
        break;

      case SortEventType.SORT_ON:
        this.#renderSort();
        break;
      case SortEventType.SORT_OFF:
        this.#destroySort();
        break;
    }
  };

  #handleFilterModelEvent = () => {
    this.#sortModel.setSort(DEFAULT_SORT);
  };

  #destroySort() {
    remove(this.#sortView);
  }
}
