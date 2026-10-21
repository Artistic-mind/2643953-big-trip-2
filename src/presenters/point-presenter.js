import { render, replace } from '../framework/render.js';
import { getPreparedOffers } from '../utils/offers.js';
import FormView from '../views/form-view.js';
import PointView from '../views/point-view.js';

export default class PointPresenter {
  #pointsModel = null;
  #destinationModel = null;
  #offersModel = null;
  #point = null;
  #pointView = null;
  #formView = null;

  constructor({ pointsModel, destinationModel, offersModel, point }) {
    this.#pointsModel = pointsModel;
    this.#destinationModel = destinationModel;
    this.#offersModel = offersModel;
    this.#point = point;
  }

  init(containerElement) {
    this.#pointView = new PointView({
      point: this.#point,
      destinationName: this.#destinationModel.getNameById(this.#point.destination),
      checkedOffers: this.#getCheckedOffers(),
      onEditClick: () => this.#replacePointToForm()
    });

    render(this.#pointView, containerElement);
  }

  #getCheckedOffers() {
    return getPreparedOffers({
      checkedOffers: this.#point.offers,
      allOffers: this.#offersModel.getOffersByType(this.#point.type)
    });
  }

  #createFormView() {
    return new FormView({
      point: this.#point,
      offers: this.#getCheckedOffers(),
      onFormSubmit: () => this.#replaceFormToPoint(),
      onRollupClick: () => this.#replaceFormToPoint(),
    });
  }

  #replacePointToForm() {
    this.#formView = this.#createFormView();
    replace(this.#formView, this.#pointView);
    document.addEventListener('keydown', this.#escDownHandler);
  }

  #replaceFormToPoint() {
    replace(this.#pointView, this.#formView);
    document.removeEventListener('keydown', this.#escDownHandler);
  }

  #escDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };
}
