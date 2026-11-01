import { pointsData } from '../mock/points.js';

export default class PointsModel {
  #points = [];
  init() {
    this.#points = [...pointsData];
  }

  get points() {
    return this.#points;
  }

   updatePoint(updatedPoint) {
    this.#points = this.#points.map((point) =>
      point.id === updatedPoint.id ? updatedPoint : point
    );

  }

}
