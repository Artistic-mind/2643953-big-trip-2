import { render } from '../framework/render.js';
import ListView from '../views/list-view.js';
import PointPresenter from './point-presenter.js';


export default class ListPresenter {
  #listView = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #appModel = null;
  #noPointsView = null;
  #openedPoint = null;
  #listPresenters = new Map();

  constructor({
    pointsModel,
    destinationModel,
    offersModel,
    appModel
  }) {
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationModel;
    this.#offersModel = offersModel;
    this.#appModel = appModel;

    this.#pointsModel.addObserver(this.#handlePointModelEvent);
    this.#appModel.addObserver(this.#handleAppModelEvent);
  }

  init(containerElement) {
    this.#renderPoints(containerElement);
  }

  #renderPoints(listView) {
    this.#listView = listView;
    this.#pointsModel.points.forEach((point) => {
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

  #handleOpen = (id) => {
    this.#appModel.openEditForm(id);
  }

  #handleClose = () => {
     this.#appModel.closeForm();

  }

  #handlePointModelEvent = (type, data) => {
    console.log('change-fav');


    switch (type) {

      case 'CHANGE_FAVORITE':
        console.log(data);
        this.#listPresenters.get(data.id).changeFavorite(data);
    }
  }

  #handleAppModelEvent = (type, { closed, opened }) => {
    console.log(type);

      if (closed?.type === 'edit') {
        this.#listPresenters.get(closed.id).closeForm();
       // this.#openedPoint = null;
      }

  }
}
