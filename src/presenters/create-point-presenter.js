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
  #appModel = null;

  constructor({
    formContainer,
    offersModel,
    destinationsModel,
    filterModel,
    appModel,
  }) {
    this.#formContainer = formContainer;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;
    this.#appModel = appModel;

    this.#appModel.addObserver(this.#handleAppModelEvent)
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
    this.#appModel.openCreateForm()
  };

  #onFormSubmit = () => {
    console.log('!!!');
  }

  #close() {
    remove(this.#formView);
    this.#createButtonView.updateElement({
      isDisabled: false,
    });
  }

  #onRollupClick = () => {
    this.#close();
     this.#appModel.closeForm();
  };

  #handleAppModelEvent = (type, { closed, opened }) => {
    console.log(type)
    if (closed) {
      if (closed.type === 'create') {
        this.#close()

      }
    }

  }
}
