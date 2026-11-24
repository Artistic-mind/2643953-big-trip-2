import { Filter } from '../constants/constants.js';
import { getFilteredPoints } from './filter-points.js';

export const getFilters = (points) => Object.values(Filter)
  .map((item) => ({
    name: item,
    isDisabled: getFilteredPoints[item](points).length === 0
  }));

