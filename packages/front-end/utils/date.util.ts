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
