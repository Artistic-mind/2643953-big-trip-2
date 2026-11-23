import {
  AppStatus,
  RenderTypes,
  SortEventTypes,
} from '../constants/constants.js';
import { getFilteredPoints } from '../utils/filter-points.js';
import { getSortedPoints } from '../utils/sort-points.js';
import PointPresenter from './point-presenter.js';

export default class ListPresenter {
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #appModel = null;
  #filterModel = null;
  #sortModel = null;

  #listPresenters = new Map();
  #renderListView = null;
  #removeListView = null;

  constructor({
    pointsModel,
    destinationModel,
    offersModel,
    appModel,
    filterModel,
    sortModel,
    renderListView,
    removeListView,
  }) {
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationModel;
    this.#offersModel = offersModel;
    this.#appModel = appModel;
    this.#filterModel = filterModel;
    this.#sortModel = sortModel;
    this.#renderListView = renderListView;
    this.#removeListView = removeListView;

    this.#pointsModel.addObserver(this.#handlePointModelEvent);
    this.#appModel.addObserver(this.#handleAppModelEvent);
    this.#sortModel.addObserver(this.#handleSortPointEvent);
    this.#filterModel.addObserver(this.#handleFilterPointEvent);
  }

  init() {
    this.#renderPoints();
  }

  #getPreparedPointList() {
    const filteredPoints = getFilteredPoints[this.#filterModel.filter](
      this.#pointsModel.points
    );

    return getSortedPoints[this.#sortModel.sort](filteredPoints);
  }

  #renderPoints() {

    if (this.#appModel.openedForm?.type === 'edit') {
      this.#appModel.closeForm();
    }

    this.#clearList();

    if (this.#appModel.appStatus !== AppStatus.READY) {
      this.#hideList();
      return;
    }

    const points = this.#getPreparedPointList();

    if (points.length === 0) {
      this.#hideList();
      return;
    }

    this.#sortModel.sortOn();

    const listView = this.#renderListView();

    points.forEach((point) => {
      const pointPresenter = new PointPresenter({
        point,
        pointsModel: this.#pointsModel,
        destinationModel: this.#destinationsModel,
        offersModel: this.#offersModel,
        onOpenPoint: this.#handleOpen,
        onClosePoint: this.#handleClose,
      });

      pointPresenter.init(listView.element);
      this.#listPresenters.set(point.id, pointPresenter);
    });
  }

  #clearList() {
    this.#listPresenters.forEach((presenter) => {
      presenter.destroy();
    });

    this.#listPresenters.clear();
  }

  #hideList() {
    this.#sortModel.sortOff();
    this.#removeListView();
  }

  #handleOpen = (id) => {
    this.#appModel.openEditForm(id);
  };

  #handleClose = () => {
    this.#appModel.closeForm();
  };

  #render(type, data) {
    switch (type) {
      case RenderTypes.MINOR: {
        const presenter = this.#listPresenters.get(data.id);

        if (presenter) {
          presenter.updatePoint(data);
        } else {
          this.#renderPoints();
        }
        break;
      }

      case RenderTypes.MAJOR:
        this.#renderPoints();
        break;

      case RenderTypes.DELETE:
        this.#listPresenters.get(data.id)?.destroy();
        this.#listPresenters.delete(data.id);

        if (this.#listPresenters.size === 0) {
          this.#hideList();
        }
        break;
    }
  }

  #handlePointModelEvent = (type, data) => {
    this.#render(type, data);
  };

  #handleFilterPointEvent = () => {
    this.#renderPoints();
  };

  #handleSortPointEvent = (type) => {
    if (type === SortEventTypes.SORT_CHANGED) {
      this.#renderPoints();
    }
  };

  #handleAppModelEvent = (type, data = {}) => {
    if (type === 'STATUS') {
      this.#renderPoints();
      return;
    }

    if (data.closed?.type === 'edit') {
      this.#listPresenters.get(data.closed.id)?.closeForm();
    }

    if (data.opened?.type === 'edit') {
      this.#listPresenters.get(data.opened.id)?.openForm();
    }

    if (type === 'CLOSE' && data.closed?.type === 'create') {
      this.#renderPoints();
    }
  };
}
