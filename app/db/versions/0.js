import Realm from 'realm';

export class Song extends Realm.Object {
  static schema = {
    name: 'Song',
    primaryKey: 'videoId',
    properties: {
      videoId: 'string',
      title: 'string',
      playlists: {type: 'linkingObjects', objectType: 'Playlist', property: 'songs'},
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
