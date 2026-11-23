import { Sorting } from '../constants/constants.js';

export const getSortedPoints = {
  [`sort-${Sorting.DAY.name}`]: (points) =>
    [...points].sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom)),

  [`sort-${Sorting.EVENT.name}`]: (points) =>
    [...points].sort((a, b) => a.type.localeCompare(b.type)),

  [`sort-${Sorting.TIME.name}`]: (points) =>
    [...points].sort((a, b) => {
      const durationA =
        new Date(a.dateTo) - new Date(a.dateFrom);

      const durationB =
        new Date(b.dateTo) - new Date(b.dateFrom);

      return durationB - durationA;
    }),

  [`sort-${Sorting.PRICE.name}`]: (points) =>
    [...points].sort((a, b) => b.basePrice - a.basePrice),

  [`sort-${Sorting.OFFERS.name}`]: (points) =>
    [...points].sort((a, b) => b.offers.length - a.offers.length),
};
