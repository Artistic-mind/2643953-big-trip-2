export const getPreparedOffers = ({ checkedOffers, allOffers }) => allOffers
  .map((item) => ({
    ...item,
    isChecked: checkedOffers.includes(item.id)
  }));

export const getCheckedOffers = ({ checkedOffers, allOffers }) => allOffers
  .filter((item) => checkedOffers.includes(item.id));
