const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const getMonth = (date) => monthNames[date.getMonth()];
export const getShortMonth = (date) => getMonth(date).substring(0, 3);

export const getYear = (date) => date.getFullYear().toString();
export const getShortYear = (date) => getYear(date).substring(2);

export const isDateValid = (date) => {
  return date instanceof Date && !isNaN(date);
};
