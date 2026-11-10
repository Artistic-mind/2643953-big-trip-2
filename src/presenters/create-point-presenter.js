import { DEFAULT_FILTER } from '../constants/constants.js';
import {remove, render, RenderPosition} from '../framework/render.js';
import CreateButtonView from '../views/create-button-view.js';
import FormView from '../views/form-view.js';
export default class CreatePointPresenter {
  #createButtonView = null;
  #formView = null;
  #formContainer = null;
  #offersModel = null;
  #filterModel = null;
  constructor({formContainer, offersModel, filterModel}) {
    this.#formContainer = formContainer;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;

   // this.#filterModel.addObserver(this.#handleFilterModelEvent);
  }
  init(buttonContainer){
    this. #createButtonView = new CreateButtonView({onClick: this.#onClick});
    render(this.#createButtonView, buttonContainer);
  }

  #onClick = () => {
   this.#formView = new FormView({
    offersByType: this.#offersModel.offers,
    onFormSubmit: this.#onFormSubmit,
    onRollupClick: this.#onRollupClick,
   });
    render(this.#formView, this.#formContainer, RenderPosition.AFTERBEGIN);

    this.#filterModel.setFilter(DEFAULT_FILTER);
  }

  #onFormSubmit =()=> {
    console.log('!!!');
  }

  #onRollupClick = () => {
    console.log('@@@@@@@@@@@@@');
    remove(this.#formView);
    this. #createButtonView.updateElement({
      isDisabled: false,
    })

  }

  // #handleFilterModelEvent = () => {

  //   this.#filterModel.setFilter(DEFAULT_FILTER);
  // }
}
