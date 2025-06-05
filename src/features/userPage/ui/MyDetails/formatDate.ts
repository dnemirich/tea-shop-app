export const formatDate = (dateStr: string | null) => {
  if (!dateStr) {
    return '';
  }

  const [year, month, day] = dateStr.split('-');
  return `${day}.${month}.${year}`;
};
