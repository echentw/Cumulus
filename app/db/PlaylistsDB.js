import Realm from 'realm';
import uuid from 'uuid';

import { Song, Playlist } from './schemas';
import realm from './realm';

export default class PlaylistsDB {
  static _getSong(videoId) {
    return realm.objects(Song.schema.name).filtered(`videoId = "${videoId}"`)[0];
  }

  static _getPlaylist(playlistId) {
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
      return true;
    } catch (e) {
      console.log(`Error creating playlist with title ${title}: ${e}`);
      return false;
    }
  }

  static delete(playlistId) {
    const playlist = PlaylistsDB._getPlaylist(playlistId);
    try {
      realm.write(() => realm.delete(playlist));
      return true;
    } catch (e) {
      console.log(`Error deleting playlist with id ${playlistId}: ${e}`);
      return false;
    }
  }

  static editTitle(playlistId, newTitle) {
    const playlist = PlaylistsDB._getPlaylist(playlistId);
    try {
      realm.write(() => playlist.title = newTitle);
      return true;
    } catch (e) {
      console.log(`Error editing the title of playlist with id ${playlistId}: ${e}`);
      return false;
    }
  };

  static addSong(playlistId, videoId) {
    const playlist = PlaylistsDB._getPlaylist(playlistId);
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
    const playlist = PlaylistsDB._getPlaylist(playlistId);
    const index = playlist.songs.findIndex((song) => song.videoId == videoId);
    if (index == -1) {
      console.log(`Song ${videoId} doesn't exist in playlist ${playlistId}.`);
      return true;
    }
    try {
      realm.write(() => playlist.songs.splice(index));
      return true;
    } catch (e) {
      console.log(`Error removing song ${videoId} from playlist ${playlistId}.`);
      return false;
    }
  }

  static addOnChangeListener(callback) {
    realm.addListener('change', callback);
  }
}

PlaylistsDB.create('My first playlist');
PlaylistsDB.create('My second playlist');
