import { DEFAULT_FILTER } from '../constants/constants.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import CreateButtonView from '../views/create-button-view.js';
import FormView from '../views/form-view.js';
export default class CreatePointPresenter {
  #createButtonView = null;
  #formView = null;
  #formContainer = null;
  #offersModel = null;
  #destinationsModel;
  #filterModel = null;

  constructor({ formContainer, offersModel, destinationsModel, filterModel }) {
    this.#formContainer = formContainer;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;
  }
  init(buttonContainer) {
    this.#createButtonView = new CreateButtonView({ onClick: this.#onClick });
    render(this.#createButtonView, buttonContainer);
  }

  #onClick = () => {
    const now = new Date();
    const start = now;
    const end = new Date(now.getTime() + 60 * 60 * 1000);

    this.#formView = new FormView({
      point: {
        basePrice: 0,
        dateFrom: start,
        dateTo: end,
        destination: '',
        offers: [],
        type: 'train',
        isFavorite: false,
      },
      offersByType: this.#offersModel.offers,
      destinations: this.#destinationsModel.destinations,
      isNew: true,
      onFormSubmit: this.#onFormSubmit,
      onRollupClick: this.#onRollupClick,
    });

    render(this.#formView, this.#formContainer, RenderPosition.AFTERBEGIN);
    this.#filterModel.setFilter(DEFAULT_FILTER);
    //this.#createButtonView.updateElement({ isDisabled: true });
  };

  #onFormSubmit = () => {
    console.log('!!!');
  }

  #onRollupClick = () => {
    remove(this.#formView);
    this.#createButtonView.updateElement({
      isDisabled: false,
    });
  };
}
