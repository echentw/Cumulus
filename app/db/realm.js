import Realm from 'realm'
import uuid from 'uuid';

class Song extends Realm.Object {
  static schema = {
    name: 'Song',
    properties: {
      videoId: 'string',
      title: 'string',
    },
  }
}

export default class SongsDB {
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

  saveSong = (videoId, title) => {
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

  getSongs = () => {
    return this.realm.objects(Song.schema.name);
  }
}
