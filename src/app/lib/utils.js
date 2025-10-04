export const convertSecondsToHMS = (totalSeconds) => {
  const seconds = parseInt(totalSeconds || 0, 10);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return { h, m, s };
};
