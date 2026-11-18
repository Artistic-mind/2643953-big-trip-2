import { render } from '../framework/render.js';
import { getFilters } from '../utils/filters.js';
import FilterView from '../views/filter-view.js';

export default class FilterPresenter {
  #filterView = null;
  #filterModel = null;
  #pointsModel = null;

  constructor({ filterModel, pointsModel }) {
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#filterModel.addObserver(this.#handleFilterModelEvent);
    this.#pointsModel.addObserver(this.#handlePointsModelEvent);
  }

  init(containerElement) {
    this.#filterView = new FilterView({
      filter: this.#filterModel.filter,
      onChange: this.#onChange,
      filters: getFilters(this.#pointsModel.points)
    });
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

  #handlePointsModelEvent = () => {
    this.#filterView.updateElement({
      filters: getFilters(this.#pointsModel.points)
    });
  }
}
