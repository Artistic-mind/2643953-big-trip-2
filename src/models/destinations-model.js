import { destinationsData } from '../mock/destinations.js';

export default class DestinationsModel {
  #destinations = null;
  init() {
    this.#destinations = [...destinationsData];
  }

  get destinations() {
    return this.#destinations;
  }

  getById(id) {
    return this.#destinations.find((item) => item.id === id) ?? null;
  }

  getNameById(id){
    return this.#destinations.find((item) => item.id === id)?.name;
  }

}
