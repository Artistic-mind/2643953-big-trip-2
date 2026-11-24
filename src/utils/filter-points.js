import { Filter } from '../constants/constants.js';

export const getFilteredPoints = {
  [Filter.EVERYTHING]: (points) => points,
  [Filter.FUTURE]: (points) => points.filter((point) => new Date(point.dateFrom) > new Date()),
  [Filter.PRESENT]: (points) =>
    points.filter((point) => {
      const now = new Date();

      return (
        new Date(point.dateFrom) <= now &&
        new Date(point.dateTo) >= now
      );
    }),
  [Filter.PAST]: (points) =>
    points.filter((point) => new Date(point.dateTo) < new Date()),
};
