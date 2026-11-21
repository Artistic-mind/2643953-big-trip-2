import { AppStatus, DEFAULT_FILTER, DEFAULT_TYPE } from '../constants/constants.js';
import { runWithBlockedUi } from '../utils/ui-request-blocker.js';
import {
  remove,
  render,
  RenderPosition,
} from '../framework/render.js';
import {
  setFormPending,
  showFormError,
} from '../utils/form-feedback.js';
import CreateButtonView from '../views/create-button-view.js';
import FormView from '../views/form-view/form-view.js';

export default class CreatePointPresenter {
  #createButtonView = null;
  #formView = null;

  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;
  #appModel = null;
  #renderListView = null;

  #isPending = false;

  constructor({
    pointsModel,
    offersModel,
    destinationsModel,
    filterModel,
    appModel,
    renderListView,
  }) {
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;
    this.#appModel = appModel;
    this.#renderListView = renderListView;

    this.#appModel.addObserver(this.#handleAppModelEvent);
  }

  init(buttonContainer) {
    this.#createButtonView = new CreateButtonView({
      onClick: this.#onClick,
    });

    render(this.#createButtonView, buttonContainer);
    this.#updateButtonState();
  }

  #updateButtonState() {
    const isDisabled =
      this.#appModel.appStatus !== AppStatus.READY ||
      this.#appModel.openedForm?.type === 'create';

    this.#createButtonView.updateElement({ isDisabled });
  }

  #onClick = () => {
    if (
      this.#appModel.appStatus !== AppStatus.READY ||
      this.#appModel.openedForm?.type === 'create'
    ) {
      return;
    }

    this.#appModel.openCreateForm();
  };

  #open() {
    this.#filterModel.setFilter(DEFAULT_FILTER);

    const listView = this.#renderListView();

    this.#formView = new FormView({
      point: {...DEFAULT_POINT},
      offersByType: this.#offersModel.offers,
      destinations: this.#destinationsModel.destinations,
      isNew: true,
      onFormSubmit: this.#onFormSubmit,
      onRollupClick: this.#handleCancel,
      onResetClick: this.#handleCancel,
    });

    render(this.#formView, listView.element, RenderPosition.AFTERBEGIN);
    this.#createButtonView.updateElement({ isDisabled: true });
  }

  #onFormSubmit = async (point) => {
    if (this.#isPending) {
      return;
    }

    this.#isPending = true;
    setFormPending(this.#formView, 'saving');

    try {
      await runWithBlockedUi(() =>
        this.#pointsModel.addPoint(point)
      );
      this.#appModel.closeForm();
    } catch (error) {
      console.error('Failed to create point:', error);

      this.#isPending = false;
      setFormPending(this.#formView);
      showFormError(this.#formView, 'Could not save the event. Try again.');
    }
  };

  #handleCancel = () => {
    if (!this.#isPending) {
      this.#appModel.closeForm();
    }
  };

  #close() {
    if (!this.#formView) {
      return;
    }

    remove(this.#formView);
    this.#formView = null;
    this.#isPending = false;

    this.#createButtonView.updateElement({ isDisabled: false });
  }

  #handleAppModelEvent = (type, data = {}) => {
    if (type === 'STATUS') {
      this.#updateButtonState();
      return;
    }

    if (type !== 'OPEN' && type !== 'CLOSE') {
      return;
    }

    if (data.closed?.type === 'create') {
      this.#close();
    }

    if (data.opened?.type === 'create') {
      this.#open();
    }

    this.#updateButtonState();
  };
}