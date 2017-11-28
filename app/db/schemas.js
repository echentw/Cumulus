export class Song extends Realm.Object {
  static schema = {
    name: 'Song',
    primaryKey: 'videoId',
    properties: {
      videoId: 'string',
      title: 'string',
    },
  }
}

export class Playlist extends Realm.Object {
  static schema = {
    name: 'Playlist',
    primaryKey: 'playlistId',
    properties: {
      playlistId: 'string',
      title: 'string',
      songs: 'Song[]',
    },
  }
}

const realm = new Realm({ schema: [Song, Playlist] });

export default realm;
