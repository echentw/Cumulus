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

const realm = new Realm({schema: [Song]});

export const saveSong = (videoId, title, done) => {
  realm.write(() => {
    realm.create(Song.schema.name, {
      videoId: videoId,
      title: title,
    });
    done();
  });
}

export const getSongs = () => {
  return realm.objects(Song.schema.name);
}
