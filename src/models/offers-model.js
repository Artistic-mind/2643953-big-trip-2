import { offersData } from '../mock/offers.js';

export default class OffersModel {
  #offers = null;
  init() {
    this.#offers = [...offersData];
  }

  get offers() {
    return this.#offers;
  }

  getOffersByType(type){
    return this.#offers.find((item)=> item.type === type)?.offers;

  }

}
