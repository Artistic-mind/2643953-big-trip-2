import { render } from '../framework/render.js';
import SortingView from '../views/sorting-view.js';

export default class SortPresenter {
  #sortView = null;

  init(containerElement){
    this.#sortView = new SortingView();
    render(this.#sortView, containerElement);
  }
}
