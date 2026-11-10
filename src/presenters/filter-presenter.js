import { render } from '../framework/render.js';
import FilterView from '../views/filter-view.js';

export default class FilterPresenter {
  #filterView = null;
  #filterModel = null;

  constructor({filterModel}) {
    this.#filterModel = filterModel;
    this.#filterModel.addObserver(this.#handleFilterModelEvent);
  }
  init(containerElement){
    this.#filterView = new FilterView({
      filter: this.#filterModel.filter,
      onChange: this.#onChange,
    }
    );
    render(this.#filterView, containerElement);
  }

  #onChange = (activeFilter) => {
    this.#filterModel.setFilter(activeFilter);
  };

  #handleFilterModelEvent = (type, currentFilter) => {
    this.#filterView.updateElement({
      filter: currentFilter,
    });

  };
}
