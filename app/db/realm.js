import Realm from 'realm';
import uuid from 'uuid';

class Song extends Realm.Object {
  static schema = {
    name: 'Song',
    primaryKey: 'videoId',
    properties: {
      videoId: 'string',
      title: 'string',
    },
  }
}

class SongsDB {
  constructor() {
    this.realm = new Realm({ schema: [Song] });
  }

  getAll = () => {
    return this.realm.objects(Song.schema.name).sorted('title');
  }

  exists = (videoId) => {
    const results = this.realm.objects(Song.schema.name).filtered(`videoId == "${videoId}"`);
    return (results.length != 0);
  }

  create = (videoId, title) => {
    return new Promise((resolve, reject) => {
      this.realm.write(() => {
        this.realm.create(Song.schema.name, {
          videoId: videoId,
          title: title,
        });
        resolve();
      });
    });
  }

  delete = (videoId) => {
    return new Promise((resolve, reject) => {
      this.realm.write(() => {
        const song = this.realm.objects(Song.schema.name).filtered(`videoId = "${videoId}"`);
        this.realm.delete(song);
        resolve();
      });
    });
  }

  addOnChangeListener = (callback) => {
    this.realm.addListener('change', callback);
  };
}

const songsDB = new SongsDB();

export default songsDB;
