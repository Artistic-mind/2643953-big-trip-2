import PointsModel from '../models/points-model.js';
import OffersModel from '../models/offers-model.js';
import DestinationsModel from '../models/destinations-model.js';
import FilterPresenter from './filter-presenter.js';
import SortPresenter from './sort-presenter.js';
import ListPresenter from './list-presenter.js';

export default class TripPresenter {
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterPresenter = null;
  #sortPresenter = null;
  #listPresenter = null;

  constructor({ tripContainer, filterContainer }) {
    this.tripContainer = tripContainer;
    this.filterContainer = filterContainer;
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

    this.#listPresenter = new ListPresenter({
      pointsModel: this.#pointsModel,
      destinationModel: this.#destinationsModel,
      offersModel: this.#offersModel
    });

    this.#listPresenter.init(this.tripContainer);


  }

}
