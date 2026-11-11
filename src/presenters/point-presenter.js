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
      offersByType:  this.#offersModel.offers,
      destinations: this.#destinationModel.destinations,
      isNew: false,
      //destination: this.#destinationModel.getById(this.#point.destination),
      onFormSubmit: () => this.#submitForm(),
      onRollupClick: () => this.closeForm(),
    });

    render(this.#pointView, containerElement);
  }

  #getCheckedOffers() {
    return getPreparedOffers({
      checkedOffers: this.#point.offers,
      allOffers: this.#offersModel.getOffersByType(this.#point.type),
    });
  }

  // #handleFavoriteClick = () => {
  //   const updatedPoint = {
  //     ...this.#point,
  //     isFavorite: !this.#point.isFavorite,
  //   };

  //   this.#pointsModel.updatePoint(updatedPoint);
  //   this.#point = updatedPoint;

  //   const prevPointView = this.#pointView;

  //   this.#pointView = new PointView({
  //     point: this.#point,
  //     destinationName: this.#destinationModel.getNameById(this.#point.destination),
  //     checkedOffers: this.#getCheckedOffers(),
  //     onEditClick: () => this.#openForm(),
  //     onFavoriteClick: () => this.#handleFavoriteClick(),
  //   });

  //   replace(this.#pointView, prevPointView);
  // };

  #openForm() {
    this.#onOpenPoint(this.#point.id);
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#escDownHandler);
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

  #escDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.closeForm();
    }
  };

  closeForm() {
    this.#formView.reset(this.#point);
    this.#replaceFormToPoint();
    this.#onClosePoint();
    document.removeEventListener('keydown', this.#escDownHandler);
  }

  #handleFavoriteClick = () => {

    this.#pointsModel.changeFavorite(this.#point.id);
  };

  changeFavorite(point) {
    this.#pointView.updateElement({
      isFavorite: point.isFavorite
    })
  }

}
