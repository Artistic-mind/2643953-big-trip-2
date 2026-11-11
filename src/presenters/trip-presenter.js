import PointsModel from '../models/points-model.js';
import OffersModel from '../models/offers-model.js';
import DestinationsModel from '../models/destinations-model.js';
import FilterPresenter from './filter-presenter.js';
import SortPresenter from './sort-presenter.js';
import ListPresenter from './list-presenter.js';
import CreatePointPresenter from './create-point-presenter.js';
import ListView from '../views/list-view.js';
import { render } from '../framework/render.js';
import FilterModel from '../models/filter-model.js';
import SortModel from '../models/sort-model.js';

export default class TripPresenter {
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;
  #sortModel = null;
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

    this.#filterModel = new FilterModel();
    this.#filterModel.init();

    this.#sortModel = new SortModel();
    this.#sortModel.init();

    this.#filterPresenter = new FilterPresenter({
      filterModel: this.#filterModel,
    });
    this.#filterPresenter.init(this.filterContainer);

    this.#sortPresenter = new SortPresenter({
      sortModel: this.#sortModel,
      filterModel: this.#filterModel,
    });
    this.#sortPresenter.init(this.tripContainer);

    this.#listView = new ListView();
    render(this.#listView, this.tripContainer);

    this.#createPointPresenter = new CreatePointPresenter({
      formContainer: this.#listView.element,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      filterModel: this.#filterModel,
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
