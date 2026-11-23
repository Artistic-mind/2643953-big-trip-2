import { escapeHtml } from '../../utils/escape-html.js';

const createPhotoTemplate = (picture) => `
  <img
    class="event__photo"
    src="${escapeHtml(picture.src)}"
    alt="${escapeHtml(picture.description ?? '')}"
  >
`;

export const createDestinationTemplate = (destination) => {
  const description =
    typeof destination?.description === 'string'
      ? destination.description.trim()
      : '';

  const pictures = (destination?.pictures ?? []).filter(
    (picture) => picture?.src
  );

  if (!description && pictures.length === 0) {
    return '';
  }

  return `
    <section class="event__section event__section--destination">
      <h3 class="event__section-title">Destination</h3>

      ${description ? `
        <p class="event__destination-description">
          ${escapeHtml(description)}
        </p>
      ` : ''}

      ${pictures.length > 0 ? `
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${pictures.map(createPhotoTemplate).join('')}
          </div>
        </div>
      ` : ''}
    </section>
  `;
};
