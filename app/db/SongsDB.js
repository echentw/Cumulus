import Realm from 'realm';

import { Song, Playlist } from './schemas';
import realm from './realm';

export default class SongsDB {
  static _getSong(videoId) {
    return realm.objects(Song.schema.name).filtered(`videoId = "${videoId}"`);
  }

  static getAll() {
    return realm.objects(Song.schema.name).sorted('title');
  }

  static exists(videoId) {
    const results = realm.objects(Song.schema.name).filtered(`videoId == "${videoId}"`);
    return (results.length != 0);
  }

  static create(videoId, title) {
    try {
      realm.write(() => {
        realm.create(Song.schema.name, {
          videoId: videoId,
          title: title,
        });
      });
      return true;
    } catch (e) {
      console.log(`Error creating song ${title} with videoId ${videoId}: ${e}`);
      return false;
    }
  }

  static delete(videoId) {
    const song = this._getSong(videoId);
    try {
      realm.write(() => realm.delete(song));
      return true;
    } catch (e) {
      console.log(`Error deleting song with videoId ${videoId}: ${e}`);
      return false;
    }
  }

  static addOnChangeListener(callback) {
    realm.addListener('change', callback);
  };
}
