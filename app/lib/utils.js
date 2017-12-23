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

// Returns a new array with the elements permuted randomly.
export function randomPermutation(array) {
  const newArray = new Array(array.length);
  for (let i = 0; i < newArray.length; ++i) {
    newArray[i] = array[i];
  }
  for (let i = 0; i < newArray.length; ++i) {
    const j = i + Math.floor(Math.random() * (newArray.length - i));
    const temp = newArray[i];
    newArray[i] = newArray[j];
    newArray[j] = temp;
  }
  return newArray;
}
