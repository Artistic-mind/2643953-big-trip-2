import { getOffersView } from './offers-view-part.js';
import { createDestinationTemplate } from './destination-view-part.js';

export const createFormDetailsTemplate = ({
  offers,
  destination,
}) => {
  const offersTemplate =
    offers.length > 0 ? getOffersView(offers) : '';

  const destinationTemplate =
    createDestinationTemplate(destination);

  if (!offersTemplate && !destinationTemplate) {
    return '';
  }

  return `
    <section class="event__details">
      ${offersTemplate}
      ${destinationTemplate}
    </section>
  `;
};
