import { Filters } from '../constants/constants.js';
import { getFilteredPoints } from './filter-points.js';

export const getFilters = (points) => {
  return Object.values(Filters).map((item) => {
    return ({
      name: item,
      isDisabled: getFilteredPoints[item](points).length === 0
    })
  })
}
