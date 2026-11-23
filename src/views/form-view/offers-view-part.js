export const getOffersView = (offers) => (`
  <section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offers.map((item) => (`
          <div class="event__offer-selector">
            <input
              class="event__offer-checkbox  visually-hidden"
              id="event-offer-${item.id}"
              type="checkbox"
              name="event-offer-${item.id}"
              ${item.isChecked ? 'checked' : ''}
              value=${item.id}
            >
            <label
              class="event__offer-label"
              for="event-offer-${item.id}"
            >
              <span class="event__offer-title">${item.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${item.price}</span>
            </label>
          </div>
        `)).join('')}
      </div>
  </section>        
`);
