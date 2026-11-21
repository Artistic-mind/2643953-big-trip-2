import { remove, render, replace } from '../framework/render.js';
import { getCheckedOffers, getPreparedOffers } from '../utils/offers.js';
import { runWithBlockedUi } from '../utils/ui-request-blocker.js';
import {
  setFormPending,
  showFormError,
} from '../utils/form-feedback.js';
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

  #isEditing = false;
  #isPending = false;
  #isFavoritePending = false;

  constructor({
    point,
    pointsModel,
    destinationModel,
    offersModel,
    onOpenPoint,
    onClosePoint,
  }) {
    this.#point = point;
    this.#pointsModel = pointsModel;
    this.#destinationModel = destinationModel;
    this.#offersModel = offersModel;
    this.#onOpenPoint = onOpenPoint;
    this.#onClosePoint = onClosePoint;
  }

  init(containerElement) {
    this.#pointView = new PointView({
      point: this.#point,
      destinationName: this.#destinationModel.getNameById(
        this.#point.destination
      ),
      checkedOffers: this.#getCheckedOffers(),
      onEditClick: () => this.#onOpenPoint(this.#point.id),
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#formView = new FormView({
      point: this.#point,
      offersByType: this.#offersModel.offers,
      destinations: this.#destinationModel.destinations,
      isNew: false,
      onFormSubmit: this.#handleFormSubmit,
      onRollupClick: this.#handleRollupClick,
      onResetClick: this.#handleDeleteClick,
    });

    render(this.#pointView, containerElement);
  }

  #getCheckedOffers() {
    return getCheckedOffers({
      checkedOffers: this.#point.offers,
      allOffers: this.#offersModel.getOffersByType(this.#point.type),
    });
  }

  openForm() {
    if (this.#isEditing) {
      return;
    }

    replace(this.#formView, this.#pointView);
    this.#isEditing = true;
  }

  closeForm() {
    if (!this.#isEditing) {
      return;
    }

    this.#formView.reset(this.#point);
    replace(this.#pointView, this.#formView);
    this.#isEditing = false;
  }

  updatePoint(point) {
    this.#point = point;
    this.#pointView.updateElement({
      isFavorite: point.isFavorite,
    });
  }

  destroy() {
    if (this.#isEditing) {
      remove(this.#formView);
    } else {
      remove(this.#pointView);
      this.#formView.removeElement();
    }

    this.#isEditing = false;
  }

  #handleRollupClick = () => {
    if (!this.#isPending) {
      this.#onClosePoint();
    }
  };

  #handleFormSubmit = async (updatedPoint) => {
    if (this.#isPending) {
      return;
    }

    this.#isPending = true;
    setFormPending(this.#formView, 'saving');

    try {
      await runWithBlockedUi(() =>
        this.#pointsModel.updatePoint({
          ...updatedPoint,
          id: this.#point.id,
        })
      );

      this.#onClosePoint();
    } catch (error) {
      console.error('Failed to update point:', error);

      this.#isPending = false;
      setFormPending(this.#formView);
      showFormError(this.#formView, 'Could not save the event. Try again.');
    }
  };

  #handleDeleteClick = async () => {
    if (this.#isPending) {
      return;
    }

    this.#isPending = true;
    setFormPending(this.#formView, 'deleting');

    try {
      await runWithBlockedUi(() =>
        this.#pointsModel.deletePoint(this.#point.id)
      );
      this.#onClosePoint();
    } catch (error) {
      console.error('Failed to delete point:', error);

      this.#isPending = false;
      setFormPending(this.#formView);
      showFormError(this.#formView, 'Could not delete the event. Try again.');
    }
  };

  #handleFavoriteClick = async () => {
    if (this.#isFavoritePending) {
      return;
    }

    this.#isFavoritePending = true;

    try {
      await runWithBlockedUi(() =>
        this.#pointsModel.changeFavorite(this.#point.id)
      );
    } catch (error) {
      console.error('Failed to update favorite:', error);
      this.#pointView.shake();
    } finally {
      this.#isFavoritePending = false;
    }
  };
}