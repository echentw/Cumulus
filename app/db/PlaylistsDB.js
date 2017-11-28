import Realm from 'realm';
import uuid from 'uuid';

import realm, { Song, Playlist } from './schemas';

export default class PlaylistsDB {
  static getAll() {
    return realm.objects(Playlist.schema.name).sorted('title');
  }

  static create(title) {
    return new Promise((resolve, reject) => {
      realm.write(() => {
        const playlistId = 'blah'; // TODO: use uuid to generate a unique id
        realm.create(Playlist.schema.name, {
          playlistId: playlistId,
          title: title,
        });
        resolve();
      });
    });
  }

  static delete(playlistId) {
    return new Promise((resolve, reject) => {
      realm.write(() => {
        const playlist = realm.objects(Playlist.schema.name).filtered(`playlistId = "${playlistId}"`);
        realm.delete(playlist);
        resolve();
      });
    });
  }

  static editTitle(playlistId, newTitle) {
    // TODO: implement me!
  };

  static addSong(videoId) {
    // TODO: implement me!
  }

  static removeSong(videoId) {
    // TODO: implement me!
  }

  static addOnChangeListener(callback) {
    realm.addListener('change', callback);
  }
}
