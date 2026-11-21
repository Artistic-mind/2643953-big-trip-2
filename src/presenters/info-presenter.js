import { remove, render, RenderPosition } from '../framework/render.js';
import InfoView from '../views/info-view.js';
import {
  getCitiesString,
  getTripPeriod,
  getTripCost,
} from '../utils/trip-info.js';

export default class InfoPresenter {
  #pointsModel = null;
  #destinationModel = null;
  #offersModel = null;
  #containerElement = null;

  #infoView = null;
  #isVisible = false;

  constructor({
    pointsModel,
    destinationModel,
    offersModel,
    containerElement,
  }) {
    this.#pointsModel = pointsModel;
    this.#destinationModel = destinationModel;
    this.#offersModel = offersModel;
    this.#containerElement = containerElement;
  }

  init() {
    this.#infoView = new InfoView();
    this.#pointsModel.addObserver(this.#handlePointsModelEvent);

    this.#render();
  }

  #render() {
    const points = this.#pointsModel.points;

    if (points.length === 0) {
      if (this.#isVisible) {
        remove(this.#infoView);
        this.#isVisible = false;
      }

      return;
    }

    const info = {
      cities: getCitiesString(
        points,
        this.#destinationModel.destinations
      ),
      period: getTripPeriod(points),
      cost: getTripCost(
        points,
        this.#offersModel.offers
      ),
    };

    if (this.#isVisible) {
      this.#infoView.updateElement(info);
      return;
    }

    this.#infoView.setInfo(info);
    render(
      this.#infoView,
      this.#containerElement,
      RenderPosition.AFTERBEGIN
    );
    this.#isVisible = true;
  }

  #handlePointsModelEvent = () => {
    this.#render();
  };
}