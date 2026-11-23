import PointsModel from '../models/points-model.js';
import OffersModel from '../models/offers-model.js';
import DestinationsModel from '../models/destinations-model.js';
import FilterModel from '../models/filter-model.js';
import SortModel from '../models/sort-model.js';
import AppModel from '../models/app-model.js';

import PointsApiService from '../api/points-api.js';
import OffersApiService from '../api/offers-api.js';
import DestinationsApiService from '../api/destinations-api.js';

import FilterPresenter from './filter-presenter.js';
import SortPresenter from './sort-presenter.js';
import ListPresenter from './list-presenter.js';
import CreatePointPresenter from './create-point-presenter.js';
import MessagePresenter from './message-presenter.js';

import ListView from '../views/list-view.js';
import { remove, render } from '../framework/render.js';
import {
  AppStatus,
  AUTHORIZATION,
  SERVER,
} from '../constants/constants.js';

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
  #messagePresenter = null;

  #listView = null;

  constructor({
    tripContainer,
    filterContainer,
    tripMainContainer,
  }) {
    this.tripContainer = tripContainer;
    this.filterContainer = filterContainer;
    this.tripMainContainer = tripMainContainer;
  }

  async init() {
    this.#pointsModel = new PointsModel({
      pointsApiService: new PointsApiService(SERVER, AUTHORIZATION),
    });

    this.#offersModel = new OffersModel({
      offersApiService: new OffersApiService(SERVER, AUTHORIZATION),
    });

    this.#destinationsModel = new DestinationsModel({
      destinationsApiService: new DestinationsApiService(
        SERVER,
        AUTHORIZATION
      ),
    });

    this.#filterModel = new FilterModel();
    this.#filterModel.init();

    this.#sortModel = new SortModel();
    this.#sortModel.init();

    this.#appModel = new AppModel();
    this.#appModel.addObserver(this.#handleAppModelEvent);

    this.#messagePresenter = new MessagePresenter({
      pointsModel: this.#pointsModel,
      appModel: this.#appModel,
      filterModel: this.#filterModel,
      tripContainerElement: this.tripContainer,
    });
    this.#messagePresenter.init();

    this.#filterPresenter = new FilterPresenter({
      filterModel: this.#filterModel,
      pointsModel: this.#pointsModel,
      appModel: this.#appModel,
    });
    this.#filterPresenter.init(this.filterContainer);

    this.#createPointPresenter = new CreatePointPresenter({
      pointsModel: this.#pointsModel,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      filterModel: this.#filterModel,
      appModel: this.#appModel,
      renderListView: this.#renderListView,
    });
    this.#createPointPresenter.init(this.tripMainContainer);

    try {
      await Promise.all([
        this.#pointsModel.init(),
        this.#offersModel.init(),
        this.#destinationsModel.init(),
      ]);
    } catch (error) {
      console.error('Failed to load trip data:', error);
      this.#appModel.setAppStatus(AppStatus.ERROR);
      return;
    }

    this.#sortPresenter = new SortPresenter({
      sortModel: this.#sortModel,
      filterModel: this.#filterModel,
      tripContainerElement: this.tripContainer,
    });
    this.#sortPresenter.init();

    this.#listPresenter = new ListPresenter({
      pointsModel: this.#pointsModel,
      destinationModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      appModel: this.#appModel,
      filterModel: this.#filterModel,
      sortModel: this.#sortModel,
      renderListView: this.#renderListView,
      removeListView: this.#removeListView,
    });
    this.#listPresenter.init();

    this.#appModel.setAppStatus(AppStatus.READY);
  }

  #renderListView = () => {
    if (!this.#listView) {
      this.#listView = new ListView();
      render(this.#listView, this.tripContainer);
    }

    return this.#listView;
  };

  #removeListView = () => {
    if (this.#appModel.openedForm?.type === 'create') {
      return;
    }

    if (this.#listView) {
      remove(this.#listView);
      this.#listView = null;
    }
  };

  #handleAppModelEvent = (type) => {
    if (type !== 'OPEN' && type !== 'CLOSE') {
      return;
    }

    if (this.#appModel.openedForm) {
      document.addEventListener('keydown', this.#handleDocumentKeydown);
    } else {
      document.removeEventListener('keydown', this.#handleDocumentKeydown);
    }
  };

  #handleDocumentKeydown = ({ key }) => {
    if (key === 'Escape') {
      this.#appModel.closeForm();
    }
  };
}