// Date-time utils for the persistent date hook and for date comparison

export const dateToTimeInMilliSeconds = (date: Date | undefined) =>
  date ? Math.floor(date.getTime()) : -1;

export const date1GreaterThanDate2 = (date1: Date | undefined, date2: Date | undefined) =>
  dateToTimeInMilliSeconds(date1) > dateToTimeInMilliSeconds(date2);

export const dateDifferenceInMilliSeconds = (date1: Date | undefined, date2: Date | undefined) =>
  dateToTimeInMilliSeconds(date1) - dateToTimeInMilliSeconds(date2);
