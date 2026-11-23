import { Filters } from '../constants/constants.js';

export const getFilteredPoints = {
  [Filters.EVERYTHING]: (points) => points,
  [Filters.FUTURE]: (points) => points.filter((point) => new Date(point.dateFrom) > new Date()),
  [Filters.PRESENT]: (points) =>
    points.filter((point) => {
      const now = new Date();

      return (
        new Date(point.dateFrom) <= now &&
        new Date(point.dateTo) >= now
      );
    }),
  [Filters.PAST]: (points) =>
    points.filter((point) => new Date(point.dateTo) < new Date()),
};
