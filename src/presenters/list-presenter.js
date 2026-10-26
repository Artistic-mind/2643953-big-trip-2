import { render } from '../framework/render.js';
import ListView from '../views/list-view.js';
import PointPresenter from './point-presenter.js';


export default class ListPresenter {
  #listView = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #noPointsView = null;
  #openedPoint = null;
  #listPresenters = new Map();

  constructor({ pointsModel, destinationModel, offersModel }) {
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationModel;
    this.#offersModel = offersModel;
  }

    init(containerElement) {
    // if (this.#pointsModel.points.length === 0) {
    //   this.#renderNoPoints(containerElement);
    //   return;
    // }

    this.#renderPoints(containerElement);
  }

  // #renderNoPoints(containerElement) {
  //   this.#noPointsView = new NoPointsView();
  //   render(this.#noPointsView, containerElement);
  // }

  #renderPoints(containerElement) {
    this.#listView = new ListView();
    render(this.#listView, containerElement);

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
    if(this.#openedPoint){
      this.#listPresenters.get(this.#openedPoint).closeForm();
    }
    this.#openedPoint = id;
  }

  #handleClose = () => {
    this.#openedPoint = null;
  }

}
