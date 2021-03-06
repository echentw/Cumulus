import Realm from 'realm';

import { Song, Playlist } from './schemas';
import realm from './realm';

export default class SongsDB {
  static _getSong(videoId) {
    return realm.objects(Song.schema.name).filtered(`videoId = "${videoId}"`)[0];
  }

  static getAll() {
    return realm.objects(Song.schema.name).sorted('title');
  }

  static getLike(query) {
    return realm.objects(Song.schema.name).filtered(`title CONTAINS[c] "${query}"`).sorted('title');
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

  static editTitle(videoId, title) {
    const song = this._getSong(videoId);
    try {
      realm.write(() => song.title = title);
      return true;
    } catch (e) {
      console.log(`Error editing the title of song with id ${videoId}: ${e}`);
      return false;
    }
  };

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
