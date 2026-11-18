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
import AppModel from '../models/app-model.js';

export default class TripPresenter {
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;
  #sortModel = null;
  #appModel = null;
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

    this.#appModel = new AppModel();
    this.#appModel.addObserver(this.#handleAppModelEvent);

    this.#filterPresenter = new FilterPresenter({
      filterModel: this.#filterModel,
      pointsModel: this.#pointsModel,
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
      appModel: this.#appModel,
    });
    this.#createPointPresenter.init(this.tripMainContainer);


    this.#listPresenter = new ListPresenter({
      pointsModel: this.#pointsModel,
      destinationModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      appModel: this.#appModel,
      filterModel: this.#filterModel,
      sortModel: this.#sortModel,
    });

    this.#listPresenter.init(this.#listView);


  }

  #handleAppModelEvent = () => {
    if (this.#appModel.openedForm) {
      document.addEventListener('keydown', this.#handleDocumentKeydown);
      return;
    }
    document.removeEventListener('keydown', this.#handleDocumentKeydown);
  }

  #handleDocumentKeydown = ({ key }) => {
    if (key !== 'Escape') {
      return;
    }
    this.#appModel.closeForm();
  }

}
