import { RenderTypes } from '../constants/constants.js';
import { render } from '../framework/render.js';
import { getFilteredPoints } from '../utils/filter-points.js';
import { getSortedPoints } from '../utils/sort-points.js';
import PointPresenter from './point-presenter.js';

export default class ListPresenter {
  #listView = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #appModel = null;
  #noPointsView = null;
  #openedPoint = null;
  #filterModel = null;
  #sortModel = null;
  #listPresenters = new Map();

  constructor({
    pointsModel,
    destinationModel,
    offersModel,
    appModel,
    filterModel,
    sortModel,
  }) {
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationModel;
    this.#offersModel = offersModel;
    this.#appModel = appModel;
    this.#filterModel = filterModel;
    this.#sortModel = sortModel;

    this.#pointsModel.addObserver(this.#handlePointModelEvent);
    this.#appModel.addObserver(this.#handleAppModelEvent);
    this.#sortModel.addObserver(this.#handleSortPointEvent);
    this.#filterModel.addObserver(this.#handleFilterPointEvent);
  }

  init(containerElement) {
    this.#listView = containerElement;
    this.#renderPoints();
  }

  #getPreparedPointList() {
    console.log(this.#filterModel.filter)
    const filteredPoints = getFilteredPoints[this.#filterModel.filter](this.#pointsModel.points);
    const sortedPoints = getSortedPoints[this.#sortModel.sort](filteredPoints);
    console.log(this.#sortModel.sort)
    return sortedPoints;
  }

  #renderPoints() {
    this.#clearList();
    const points = this.#getPreparedPointList();
    console.log(points);
    points.forEach((point) => {
      const pointPresenter = new PointPresenter({
        point,
        pointsModel: this.#pointsModel,
        destinationModel: this.#destinationsModel,
        offersModel: this.#offersModel,
        onOpenPoint: this.#handleOpen,
        onClosePoint: this.#handleClose
      });
      pointPresenter.init(this.#listView.element);
      this.#listPresenters.set(point.id, pointPresenter);
    });
  }

  #clearList() {
    this.#listPresenters.forEach((item) => {
      item.destroy();
    });
    this.#listPresenters.clear();
  }

  #handleOpen = (id) => {
    this.#appModel.openEditForm(id);
  }

  #handleClose = () => {
    this.#appModel.closeForm();
  }


  #render(type, data) {
    switch (type) {
      case RenderTypes.MINOR:
        this.#listPresenters.get(data.id).updatePoint(data);
        break;
      case RenderTypes.MAJOR:
        this.#renderPoints();
        break;
      case RenderTypes.DELETE:
        break;
    }

  }

  #handlePointModelEvent = (type, data) => {
    this.#render(type, data)
  }

  #handleFilterPointEvent = () => {
    this.#render(RenderTypes.MAJOR);
  }

  #handleSortPointEvent = () => {
    this.#render(RenderTypes.MAJOR);
  }

  #handleAppModelEvent = (type, { closed, opened }) => {

    if (closed?.type === 'edit') {
      this.#listPresenters.get(closed.id).closeForm();
    }
  }

}
