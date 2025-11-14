export const toDate = (value: string | undefined | null): Date | null => {
  return value ? new Date(value) : null;
};
