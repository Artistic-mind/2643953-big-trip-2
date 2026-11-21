import dayjs from 'dayjs';

export const getCitiesString = (points, destinations) => {
  if (points.length === 0) {
    return '';
  }

  const sortedPoints = [...points].sort(
    (first, second) =>
      dayjs(first.dateFrom).valueOf() - dayjs(second.dateFrom).valueOf()
  );

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

  let start = dayjs(points[0].dateFrom);
  let end = dayjs(points[0].dateTo);

  for (const point of points) {
    const dateFrom = dayjs(point.dateFrom);
    const dateTo = dayjs(point.dateTo);

    if (dateFrom.isBefore(start)) {
      start = dateFrom;
    }

    if (dateTo.isAfter(end)) {
      end = dateTo;
    }
  }

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