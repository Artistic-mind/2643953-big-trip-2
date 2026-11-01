
import TripPresenter from './presenters/trip-presenter.js';

const siteHeaderElement = document.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.trip-events');
const tripMainElement = document.querySelector('.trip-main');


const tripPresenter = new TripPresenter({
  tripContainer: siteMainElement,
  filterContainer: siteHeaderElement,
  tripMainContainer: tripMainElement
});

tripPresenter.init();
