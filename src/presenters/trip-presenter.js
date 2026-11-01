import PointsModel from '../models/points-model.js';
import OffersModel from '../models/offers-model.js';
import DestinationsModel from '../models/destinations-model.js';
import FilterPresenter from './filter-presenter.js';
import SortPresenter from './sort-presenter.js';
import ListPresenter from './list-presenter.js';
import CreatePointPresenter from './create-point-presenter.js';
import ListView from '../views/list-view.js';
import { render } from '../framework/render.js';

export default class TripPresenter {
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterPresenter = null;
  #sortPresenter = null;
  #listPresenter = null;
  #createPointPresenter = null;
  #listView = null;

  constructor({
    tripContainer,
    filterContainer,
    tripMainContainer
   }) {
    this.tripContainer = tripContainer;
    this.filterContainer = filterContainer;
    this.tripMainContainer = tripMainContainer;
  }

  init() {
    this.#pointsModel = new PointsModel();
    this.#pointsModel.init();

    this.#offersModel = new OffersModel();
    this.#offersModel.init();

    this.#destinationsModel = new DestinationsModel();
    this.#destinationsModel.init();

    this.#filterPresenter = new FilterPresenter();
    this.#filterPresenter.init(this.filterContainer);

    this.#sortPresenter = new SortPresenter();
    this.#sortPresenter.init(this.tripContainer);

    this.#listView = new ListView();
    render(this.#listView, this.tripContainer);

    this.#createPointPresenter = new CreatePointPresenter({
      formContainer: this.#listView.element
    });
    this.#createPointPresenter.init(this.tripMainContainer);


    this.#listPresenter = new ListPresenter({
      pointsModel: this.#pointsModel,
      destinationModel: this.#destinationsModel,
      offersModel: this.#offersModel
    });

    this.#listPresenter.init(this.#listView);


  }

}
