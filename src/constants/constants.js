export const AUTHORIZATION = `Basic ${crypto.randomUUID()}`;
export const SERVER = 'https://22.objects.htmlacademy.pro/big-trip';

export const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export const EndPoints = {
  POINTS: 'points',
  OFFERS: 'offers',
  DESTINATIONS: 'destinations',
  POINT: 'points/:id'
};

export const AppStatus = {
  LOADING: 'loading',
  READY: 'ready',
  ERROR: 'error',
};

export const AppMessages = {
  [AppStatus.LOADING]: 'Loading...',
  [AppStatus.ERROR]: 'Failed to load latest route information',
};

export const Type = {
  TAXI: 'taxi',
  BUS: 'bus',
  TRAIN: 'train',
  SHIP: 'ship',
  DRIVE: 'drive',
  FLIGHT: 'flight',
  CHECK_IN: 'check-in',
  SIGHTSEEING: 'sightseeing',
  RESTAURANT: 'restaurant',
};

export const DEFAULT_TYPE = Type.FLIGHT;

export const DEFAULT_POINT = {
  basePrice: 0,
  dateFrom: '',
  dateTo: '',
  destination: '',
  isFavorite: false,
  offers: [],
  type: DEFAULT_TYPE,
};

export const DATEPICKER_FORMAT = 'd/m/y H:i';

export const Filter = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};
export const DEFAULT_FILTER = Filter.EVERYTHING;

export const EmptyMessages = {
  [Filter.EVERYTHING]: 'Click New Event to create your first point',
  [Filter.PAST]: 'There are no past events now',
  [Filter.PRESENT]: 'There are no present events now',
  [Filter.FUTURE]: 'There are no future events now',
};

export const Sorting = {
  DAY: {
    name: 'day',
    isDisabled: false,
  },
  EVENT: {
    name: 'event',
    isDisabled: true,
  },
  TIME: {
    name: 'time',
    isDisabled: false,
  },
  PRICE: {
    name: 'price',
    isDisabled: false,
  },
  OFFERS: {
    name: 'offers',
    isDisabled: true,
  },
};

export const DEFAULT_SORT = `sort-${Sorting.DAY.name}`;

export const RenderType = {
  MINOR: 'minor',
  MAJOR: 'major',
  DELETE: 'delete'
};

export const SortEventType = {
  SORT_CHANGED: 'SORT_CHANGED',
  SORT_ON: 'SORT_ON',
  SORT_OFF: 'SORT_OFF',
};

