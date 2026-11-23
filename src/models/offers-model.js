export default class OffersModel {
  #offers = [];
  #offersApiService = null;

  constructor({ offersApiService }) {
    this.#offersApiService = offersApiService;
  }

  get offers() {
    return this.#offers;
  }

  async init() {
    this.#offers = await this.#offersApiService.getOffers();
  }

  getOffersByType(type) {
    return this.#offers.find((item) => item.type === type)?.offers ?? [];
  }
}
