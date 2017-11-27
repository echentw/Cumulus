function secondsToDisplay(seconds) {
  if (seconds < 10) {
    return '0' + seconds.toString();
  } else {
    return seconds.toString();
  }
}

// `currentTime` and `duration` should be in seconds.
export function progressToDisplay(currentTime, duration) {
  const currentTimeInt = Math.floor(currentTime);
  const durationInt = Math.floor(duration);

  const minutes = Math.floor(currentTimeInt / 60);
  const seconds = secondsToDisplay(currentTimeInt % 60);

  const durationMinutes = Math.floor(durationInt / 60);
  const durationSeconds = secondsToDisplay(durationInt % 60);

  return `${minutes}:${seconds} / ${durationMinutes}:${durationSeconds}`;
}
