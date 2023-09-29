export const msToTime = (ms: number) => {
  const hours = Math.floor(ms / 1000 / 3600);
  const minutes = Math.floor((ms / 1000 / 60) % 60);
  const seconds = Math.round((ms / 1000) % 60);
  // prettier-ignore
  return hours > 0
    ? hours + ":" +(minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds
    : hours < 1
    ? minutes + ":" + (seconds < 10 ? "0" : "") + seconds
    : "Error";
};

export const msToHourMin = (ms: number) => {
  const hours = Math.floor(ms / 1000 / 3600);
  const minutes = Math.floor((ms / 1000 / 60) % 60);
  return hours > 0 ? hours + "hr " + minutes + "min" : minutes + "min";
};
