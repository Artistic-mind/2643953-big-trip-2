export const Types = {
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
export const Filters = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};
export const DEFAULT_FILTER = Filters.EVERYTHING;



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
    name: 'Offers',
    isDisabled: true,
  },
}

export const DEFAULT_SORT = `sort-${Sorting.DAY.name}`;

