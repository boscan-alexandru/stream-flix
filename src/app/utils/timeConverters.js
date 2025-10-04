/**
 * Converts total seconds into {h, m, s} format for form fields.
 * @param {number} totalSeconds
 * @returns {{h: number, m: number, s: number}}
 */
export const convertSecondsToHMS = (totalSeconds) => {
  const seconds = parseInt(totalSeconds || 0, 10);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return { h, m, s };
};
