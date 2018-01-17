import Realm from 'realm';

import { DownloadingSong, Playlist } from './schemas';
import realm from './realm';

export default class DownloadingSongsDB {
  static _getSong(videoId) {
    return realm.objects(DownloadingSong.schema.name).filtered(`videoId = "${videoId}"`)[0];
  }

  static getAll() {
    return realm.objects(DownloadingSong.schema.name).sorted('title');
  }

  static exists(videoId) {
    const results = realm.objects(DownloadingSong.schema.name).filtered(`videoId == "${videoId}"`);
    return (results.length != 0);
  }

  static create(videoId, title) {
    try {
      realm.write(() => {
        realm.create(DownloadingSong.schema.name, {
          videoId: videoId,
          title: title,
        });
      });
      return true;
    } catch (e) {
      console.log(`Error creating downloadingSong ${title} with videoId ${videoId}: ${e}`);
      return false;
    }
  }

  static editTitle(videoId, title) {
    const song = this._getSong(videoId);
    try {
      realm.write(() => song.title = title);
      return true;
    } catch (e) {
      console.log(`Error editing the title of downloadingSong with id ${videoId}: ${e}`);
      return false;
    }
  };

  static delete(videoId) {
    const song = this._getSong(videoId);
    try {
      realm.write(() => realm.delete(song));
      return true;
    } catch (e) {
      console.log(`Error deleting downloadingSong with videoId ${videoId}: ${e}`);
      return false;
    }
  }

  static addOnChangeListener(callback) {
    realm.addListener('change', callback);
  };
}
