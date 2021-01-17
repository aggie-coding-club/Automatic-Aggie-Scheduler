export const FIRST_HOUR = 8;
export const LAST_HOUR = 22;
/**
 * Given the hours and minutes of a time, returns a formatted string representation of
 * that time. By default, this uses 12-hour format, but an extra argument can be specified
 * to use 24-hour format
 * @param h hours
 * @param m minutes
 * @param use24Hour if true, applies 24-hour format instead of the default 12-hour format
 */
export function formatTime(h: number, m: number, use24Hour = false, padZeroes = false): string {
  let amOrpm = '';
  if (!use24Hour) {
    amOrpm = h < 12 ? 'AM' : 'PM';
  }

  const formattedHours = use24Hour ? h : (h - 1) % 12 + 1;
  const padZero = new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 });
  return `${padZeroes ? padZero.format(formattedHours) : formattedHours}:${padZero.format(m)}${amOrpm}`;
}

/**
 * Creates fake mouse events at a certain time. For use in testing.
 * @param h hours of the desired time, in 24-hr format
 * @param m minutes of the desired time
 * @param offset top of the calendar day in which the event is fired
 * @param clientHeight height of the calendar day
 */
export const timeToEvent = (h: number, m: number, offset = 0, clientHeight = 1000): {} => {
  const minsPastStart = h * 60 + m - FIRST_HOUR * 60;
  const minsPerDay = (LAST_HOUR - FIRST_HOUR) * 60;

  return {
    button: 0,
    clientY: offset + minsPastStart / minsPerDay * clientHeight,
    clientX: 100,
  };
};
