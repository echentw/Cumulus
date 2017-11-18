import Realm from 'realm'
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
  open = () => {
    return new Promise((resolve, reject) => {
      Realm.open({
        schema: [Song],
      })
      .then((realm) => {
        this.realm = realm;
        resolve();
      })
      .catch((error) => reject(error));
    });
  }

  getAll = () => {
    return this.realm.objects(Song.schema.name);
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
songsDB.open().then(() => console.log('finished opening songsDB'));

export default songsDB;
