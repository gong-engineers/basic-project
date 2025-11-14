export const formatDatePeriod = (
  startDate: string | null,
  endDate: string | null,
) => {
  if (!startDate && !endDate) return null;

  const format = (date: string) =>
    new Date(date).toLocaleDateString('ko-KR').replace(/\.$/, '');

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
