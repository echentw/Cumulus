export function onPlayEnd(success) {
  if (success) {
    console.log('successfully finished playing');
    this.props.playerPause();
  } else {
    console.log('playback failed due to audio decoding errors');
  }
}
