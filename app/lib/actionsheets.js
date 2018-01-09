import {
  ActionSheetIOS,
  AlertIOS,
} from 'react-native';

import {
  ensureDownloaded,
  removeSong,
} from './songManagement';

import PlaylistsDB from '../db/PlaylistsDB';
import SongsDB from '../db/SongsDB';

export default class ActionSheet {

  // `afterCreateCallback` is a function that takes in the
  // new created playlist title as its only argument.
  static newPlaylist(afterCreateCallback) {
    AlertIOS.prompt(
      'New playlist',
      'Give it a name!',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Create', onPress: afterCreateCallback },
      ],
      'plain-text', // text input type
      '', // default text in text input
      'default', // keyboard type
    );
  }

  static _addSongToPlaylist(videoId, songTitle, songThumbnail) {
    const playlists = PlaylistsDB.getAll();
    const playlistTitles = playlists.map((playlist) => playlist.title);
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['+ New Playlist', ...playlistTitles, 'Cancel'],
      cancelButtonIndex: playlistTitles.length + 1,
      title: 'Add to Playlist',
      tintColor: 'black',
    }, (index) => {
      if (index == 0) {
        this.newPlaylist((playlistName) => {
          const playlistId = PlaylistsDB.create(playlistName);
          ensureDownloaded(videoId, songTitle, songThumbnail)
            .then(() => PlaylistsDB.addSong(playlistId, videoId))
            .catch((err) => console.log('an error happened when trying to download song', err));
        });
      } else if (index <= playlistTitles.length) {
        const playlistId = playlists[index - 1].playlistId;
        ensureDownloaded(videoId, songTitle, songThumbnail)
          .then(() => PlaylistsDB.addSong(playlistId, videoId))
          .catch((err) => console.log('an error happened', err));
      }
    });
  }

  static searchResultOptions(videoId, songTitle, songThumbnail) {
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Cancel', 'Download', 'Add to Playlist'],
      cancelButtonIndex: 0,
      title: songTitle,
      tintColor: 'black',
    }, (index) => {
      if (index == 1) {
        ensureDownloaded(videoId, songTitle, songThumbnail)
          .then(() => console.log('success!'))
          .catch((err) => console.log('an error happened', err));
      } else if (index == 2) {
        this._addSongToPlaylist(videoId, songTitle, songThumbnail);
      }
    });
  }

  static _renameSong(videoId, songTitle) {
    AlertIOS.prompt(
      'Rename song',
      songTitle,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Rename', onPress: (newTitle) => SongsDB.editTitle(videoId, newTitle) },
      ],
      'plain-text', // text input type
      '', // default text in text input
      'default', // keyboard type
    );
  }

  static savedSongOptions(videoId, songTitle, songThumbnail) {
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Cancel', 'Add to Playlist', 'Rename', 'Delete'],
      cancelButtonIndex: 0,
      destructiveButtonIndex: 3,
      title: songTitle,
      tintColor: 'black',
    }, (index) => {
      if (index == 1) {
        this._addSongToPlaylist(videoId, songTitle, songThumbnail);
      } else if (index == 2) {
        this._renameSong(videoId, songTitle);
      } else if (index == 3) {
        removeSong(videoId)
          .then(() => console.log('song successfully deleted!'));
      }
    });
  }
}
