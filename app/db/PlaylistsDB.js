import Realm from 'realm';
import uuid from 'uuid';

import { Song, Playlist } from './schemas';
import realm from './realm';

// TODO: change API to sometimes return the id, like in `create()`
export default class PlaylistsDB {
  static _getSong(videoId) {
    return realm.objects(Song.schema.name).filtered(`videoId = "${videoId}"`)[0];
  }

  static getPlaylist(playlistId) {
    return realm.objects(Playlist.schema.name).filtered(`playlistId = "${playlistId}"`)[0];
  }

  static getAll() {
    return realm.objects(Playlist.schema.name).sorted('title');
  }

  static create(title) {
    const playlistId = uuid();
    try {
      realm.write(() => {
        realm.create(Playlist.schema.name, {
          playlistId: playlistId,
          title: title,
          songs: [],
        });
      });
      return playlistId;
    } catch (e) {
      console.log(`Error creating playlist with title ${title}: ${e}`);
      return false;
    }
  }

  static delete(playlistId) {
    const playlist = PlaylistsDB.getPlaylist(playlistId);
    try {
      realm.write(() => realm.delete(playlist));
      return true;
    } catch (e) {
      console.log(`Error deleting playlist with id ${playlistId}: ${e}`);
      return false;
    }
  }

  static editTitle(playlistId, newTitle) {
    const playlist = PlaylistsDB.getPlaylist(playlistId);
    try {
      realm.write(() => playlist.title = newTitle);
      return true;
    } catch (e) {
      console.log(`Error editing the title of playlist with id ${playlistId}: ${e}`);
      return false;
    }
  };

  static addSong(playlistId, videoId) {
    const playlist = PlaylistsDB.getPlaylist(playlistId);
    const index = playlist.songs.findIndex((song) => song.videoId == videoId);
    if (index != -1) {
      console.log(`Song ${videoId} already exists in playlist ${playlistId}.`);
      return true;
    }
    const song = PlaylistsDB._getSong(videoId);
    try {
      realm.write(() => playlist.songs.push(song));
      return true;
    } catch (e) {
      console.log(`Error adding song ${videoId} to playlist ${playlistId}: ${e}`);
      return false;
    }
  }

  static removeSong(playlistId, videoId) {
    const playlist = PlaylistsDB.getPlaylist(playlistId);
    const index = playlist.songs.findIndex((song) => song.videoId == videoId);
    if (index == -1) {
      console.log(`Song ${videoId} doesn't exist in playlist ${playlistId}.`);
      return true;
    }
    try {
      realm.write(() => playlist.songs.splice(index, 1));
      return true;
    } catch (e) {
      console.log(`Error removing song ${videoId} from playlist ${playlistId}: ${e}.`);
      return false;
    }
  }

  static addOnChangeListener(callback) {
    realm.addListener('change', callback);
  }

  static removeOnChangeListener(callback) {
    realm.removeListener('change', callback);
  }
}
