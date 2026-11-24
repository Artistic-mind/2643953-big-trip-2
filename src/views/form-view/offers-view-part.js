import { escapeHtml } from '../../utils/escape-html.js';

const createOfferTemplate = (item) => {
  const id = escapeHtml(item.id);

  return `
    <div class="event__offer-selector">
      <input
        class="event__offer-checkbox visually-hidden"
        id="event-offer-${id}"
        type="checkbox"
        name="event-offer-${id}"
        value="${id}"
        ${item.isChecked ? 'checked' : ''}
      >

      <label
        class="event__offer-label"
        for="event-offer-${id}"
      >
        <span class="event__offer-title">
          ${escapeHtml(item.title)}
        </span>

        &plus;&euro;&nbsp;

        <span class="event__offer-price">
          ${escapeHtml(item.price)}
        </span>
      </label>
    </div>
  `;
};

export const getOffersView = (offers) => `
  <section class="event__section event__section--offers">
    <h3 class="event__section-title event__section-title--offers">
      Offers
    </h3>

    <div class="event__available-offers">
      ${offers
    .map((item) => createOfferTemplate(item))
    .join('')}
    </div>
  </section>
`;
