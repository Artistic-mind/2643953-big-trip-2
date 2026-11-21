import Observable from '../framework/observable.js';
import { RenderTypes } from '../constants/constants.js';

export default class PointsModel extends Observable {
  #points = [];
  #pointsApiService = null;

  constructor({ pointsApiService }) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get points() {
    return this.#points;
  }

  async init() {
    this.#points = await this.#pointsApiService.getPoints();
  }

  async addPoint(point) {
    const createdPoint = await this.#pointsApiService.addPoint(point);

    this.#points = [...this.#points, createdPoint];
    this._notify(RenderTypes.MAJOR, createdPoint);

    return createdPoint;
  }

  async updatePoint(updatedPoint, renderType = RenderTypes.MAJOR) {
    const index = this.#points.findIndex(
      (point) => point.id === updatedPoint.id
    );

    if (index === -1) {
      throw new Error(`Point ${updatedPoint.id} was not found`);
    }

    const savedPoint = await this.#pointsApiService.updatePoint(updatedPoint);

    this.#points = this.#points.map((point) =>
      point.id === savedPoint.id ? savedPoint : point
    );

    this._notify(renderType, savedPoint);

    return savedPoint;
  }

  async changeFavorite(id) {
    const point = this.#points.find((item) => item.id === id);

    if (!point) {
      throw new Error(`Point ${id} was not found`);
    }

    return this.updatePoint(
      {
        ...point,
        isFavorite: !point.isFavorite,
      },
      RenderTypes.MINOR
    );
  }

  async deletePoint(id) {
    const point = this.#points.find((item) => item.id === id);

    if (!point) {
      throw new Error(`Point ${id} was not found`);
    }

    await this.#pointsApiService.deletePoint(id);

    this.#points = this.#points.filter((item) => item.id !== id);
    this._notify(RenderTypes.DELETE, point);
  }
}