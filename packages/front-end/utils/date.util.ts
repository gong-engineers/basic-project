export const formatDatePeriod = (
  startDate: string | null,
  endDate: string | null,
) => {
  if (!startDate && !endDate) {
    return null;
  }

  const format = (date: string) => date.slice(0, 10);

  if (startDate && endDate) {
    return `${format(startDate)} ~ ${format(endDate)}`;
  }

  if (startDate && !endDate) {
    return `${format(startDate)} ~`;
  }

  if (!startDate && endDate) {
    return `~ ${format(endDate)}`;
  }

  return null;
};

export const checkDiscountPeriod = (
  startDate: string | null,
  endDate: string | null,
) => {
  const today = new Date();
  const discountStart = startDate ? new Date(startDate) : null;
  const discountEnd = endDate ? new Date(endDate) : null;

  if (discountStart && discountEnd) {
    return today >= discountStart && today <= discountEnd;
  }

  if (discountStart && !discountEnd) {
    return today >= discountStart;
  }

  if (!discountStart && discountEnd) {
    return today <= discountEnd;
  }

  return false;
};
