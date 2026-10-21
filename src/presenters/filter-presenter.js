import { render } from '../framework/render.js';
import FilterView from '../views/filter-view.js';

export default class FilterPresenter {
  #filterView = null;

  init(containerElement){
    this.#filterView = new FilterView();
    render(this.#filterView, containerElement);
  }
}
