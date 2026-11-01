import {render, RenderPosition} from '../framework/render.js';
import CreateButtonView from '../views/create-button-view.js';
import FormView from '../views/form-view.js';

const initialData = {
    point: {
    basePrice: '',
    dateFrom: '',
    dateTo: '',
    destination: "d3",
    isFavorite: false,
    offers: [
      "of4", "of6"
    ],
    type: "train"
  },
  offers: [],
  onFormSubmit: ()=>{},
  onRollupClick: ()=>{}
}

export default class CreatePointPresenter {
  #createButtonView = null;
  #formView = null;
  #formContainer = null;
  constructor({formContainer}) {
    this.#formContainer = formContainer;
  }
  init(buttonContainer){
    this. #createButtonView = new CreateButtonView({onClick: this.#onClick});
    render(this.#createButtonView, buttonContainer);
  }
  #onClick = () => {
   this.#formView = new FormView(initialData);
    render(this.#formView, this.#formContainer, RenderPosition.AFTERBEGIN);
  }
}
