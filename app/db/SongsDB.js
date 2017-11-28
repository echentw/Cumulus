import Realm from 'realm';
import uuid from 'uuid';

import realm, { Song, Playlist } from './schemas';

export default class SongsDB {
  static getAll() {
    return realm.objects(Song.schema.name).sorted('title');
  }

  static exists(videoId) {
    const results = realm.objects(Song.schema.name).filtered(`videoId == "${videoId}"`);
    return (results.length != 0);
  }

  static create(videoId, title) {
    return new Promise((resolve, reject) => {
      realm.write(() => {
        realm.create(Song.schema.name, {
          videoId: videoId,
          title: title,
        });
        resolve();
      });
    });
  }

  static delete(videoId) {
    return new Promise((resolve, reject) => {
      realm.write(() => {
        const song = realm.objects(Song.schema.name).filtered(`videoId = "${videoId}"`);
        realm.delete(song);
        resolve();
      });
    });
  }

  static addOnChangeListener(callback) {
    realm.addListener('change', callback);
  };
}
