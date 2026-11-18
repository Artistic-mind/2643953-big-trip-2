import { remove, render, replace } from '../framework/render.js';
import { getPreparedOffers } from '../utils/offers.js';
import FormView from '../views/form-view/form-view.js';
import PointView from '../views/point-view.js';

export default class PointPresenter {
  #pointsModel = null;
  #destinationModel = null;
  #offersModel = null;
  #point = null;
  #pointView = null;
  #formView = null;
  #onOpenPoint = null;
  #onClosePoint = null;

  constructor({
    pointsModel,
    destinationModel,
    offersModel,
    point,
    onOpenPoint,
    onClosePoint,
  }) {
    this.#pointsModel = pointsModel;
    this.#destinationModel = destinationModel;
    this.#offersModel = offersModel;
    this.#point = point;
    this.#onOpenPoint = onOpenPoint;
    this.#onClosePoint = onClosePoint;
  }

  init(containerElement) {
    this.#pointView = new PointView({
      point: this.#point,
      destinationName: this.#destinationModel.getNameById(this.#point.destination),
      checkedOffers: this.#getCheckedOffers(),
      onEditClick: () => this.#openForm(),
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#formView = new FormView({
      point: this.#point,
      offersByType: this.#offersModel.offers,
      destinations: this.#destinationModel.destinations,
      isNew: false,
      onFormSubmit: this.#handleSubmitForm,
      onRollupClick: this.#handleRollupClick,
    });

    render(this.#pointView, containerElement);
  }

  #getCheckedOffers() {
    return getPreparedOffers({
      checkedOffers: this.#point.offers,
      allOffers: this.#offersModel.getOffersByType(this.#point.type),
    });
  }

  #handleRollupClick = () => {
    this.#onClosePoint();
  }

  #handleSubmitForm = (point) => {
    this.#onClosePoint();
    this.#pointsModel.updatePoint(point)
  }

  #openForm() {
    this.#onOpenPoint(this.#point.id);
    this.#replacePointToForm();
  }

  #submitForm() {
    this.closeForm();
  }

  #replacePointToForm() {
    replace(this.#formView, this.#pointView);
  }

  #replaceFormToPoint() {
    replace(this.#pointView, this.#formView);
  }

  closeForm() {
    this.#formView.reset(this.#point);
    this.#replaceFormToPoint();
  }

  #handleFavoriteClick = () => {
    this.#pointsModel.changeFavorite(this.#point.id);
  };

  updatePoint(point) {
    this.#pointView.updateElement({...point})
  }

  destroy(){
    remove(this.#pointView);
    remove(this.#formView);
  }

}
