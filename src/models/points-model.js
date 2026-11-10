import { pointsData } from '../mock/points.js';
import Observable from '../framework/observable.js';
export default class PointsModel extends Observable{
  #points = [];
  init() {
    this.#points = [...pointsData];
  }

  get points() {
    return this.#points;
  }

  changeFavorite(idPoint) {

    const index = this.#points.findIndex((item) => idPoint === item.id);
    this.#points[index].isFavorite = !this.#points[index].isFavorite;
    // this.#points = this.#points.map((item)=>{
    //   if(idPoint === item.id){
    //     item.isFavorite = !item.isFavorite
    //   }

    //   return item;
    // })
    this._notify('CHANGE_FAVORITE', this.#points[index]);
  }

  //  updatePoint(updatedPoint) {
  //   this.#points = this.#points.map((point) =>
  //     point.id === updatedPoint.id ? updatedPoint : point
  //   );



}
