import { DEFAULT_SORT } from '../constants/constants.js';
import { render } from '../framework/render.js';
import SortingView from '../views/sorting-view.js';

export default class SortPresenter {
  #sortView = null;
  #sortModel = null;
  #filterModel = null;
  constructor({sortModel, filterModel}) {
    this.#sortModel = sortModel;
    this.#filterModel = filterModel;
    this.#sortModel.addObserver(this.#handleSortModelEvent);
    this.#filterModel.addObserver(this.#handleFilterModelEvent);
  }
  init(containerElement){
    this.#sortView = new SortingView({
      sort: this.#sortModel.sort,
      onChange: this.#onChange,
    });
    render(this.#sortView, containerElement);
  }

  #onChange = (sort) => {
    this.#sortModel.setSort(sort);
  };

  #handleSortModelEvent = (type, sort) => {
    this.#sortView.updateElement({
      sort,
    });
  }

  #handleFilterModelEvent = () => {
    this.#sortModel.setSort(DEFAULT_SORT);

  };
}
