import dayjs from 'dayjs';
import { Sorting } from '../constants/constants.js';
import { getSortedPoints } from './sort-points.js';

const sortPointsByDay =
  getSortedPoints[`sort-${Sorting.DAY.name}`];

export const getCitiesString = (points, destinations) => {
  if (points.length === 0) {
    return '';
  }

  const sortedPoints = sortPointsByDay(points);

  const cities = sortedPoints.map((point) =>
    destinations.find(
      (destination) => destination.id === point.destination
    )?.name ?? 'Unknown destination'
  );

  if (cities.length > 3) {
    return `${cities[0]} — ... — ${cities.at(-1)}`;
  }

  return cities.join(' — ');
};

export const getTripPeriod = (points) => {
  if (points.length === 0) {
    return '';
  }

  const sortedPoints = sortPointsByDay(points);

  const firstPoint = sortedPoints[0];
  const lastPoint = sortedPoints.at(-1);

  const start = dayjs(firstPoint.dateFrom);
  const end = dayjs(lastPoint.dateTo);

  if (start.isSame(end, 'day')) {
    return start.format('D MMM');
  }

  if (start.isSame(end, 'month')) {
    return `${start.format('D')} — ${end.format('D MMM')}`;
  }

  if (start.isSame(end, 'year')) {
    return `${start.format('D MMM')} — ${end.format('D MMM')}`;
  }

  return `${start.format('D MMM YYYY')} — ${end.format('D MMM YYYY')}`;
};

export const getTripCost = (points, offersByType) =>
  points.reduce((total, point) => {
    const selectedOfferIds = new Set(point.offers ?? []);

    const availableOffers = offersByType.find(
      (item) => item.type === point.type
    )?.offers ?? [];

    const offersCost = availableOffers.reduce(
      (sum, offer) =>
        sum + (selectedOfferIds.has(offer.id) ? Number(offer.price) : 0),
      0
    );

    return total + Number(point.basePrice) + offersCost;
  }, 0);
