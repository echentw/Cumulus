import Realm from 'realm';
import uuid from 'uuid';

class Playlist extends Realm.Object {
  static schema = {
    name: 'Playlist',
    primaryKey: 'playlistId',
    properties: {
      playlistId: 'string',
      title: 'string',
      songs: 'list', // TODO: what's the right way to do this?
    },
  }
}

class PlaylistsDB {
  constructor() {
    this.realm = new Realm({ schema: [Playlist] });
  }

  getAll = () => {
    return this.realm.objects(Playlist.schema.name).sorted('title');
  }

  create = (title) => {
    return new Promise((resolve, reject) => {
      this.realm.write(() => {
        const playlistId = 'blah'; // TODO: use uuid to generate a unique id
        this.realm.create(Playlist.schema.name, {
          playlistId: playlistId,
          title: title,
        });
        resolve();
      });
    });
  }

  delete = (playlistId) => {
    return new Promise((resolve, reject) => {
      this.realm.write(() => {
        const playlist = this.realm.objects(Playlist.schema.name).filtered(`playlistId = "${playlistId}"`);
        this.realm.delete(playlist);
        resolve();
      });
    });
  }

  editTitle = (playlistId, newTitle) => {
    // TODO: implement me!
  };

  addSong = (videoId) => {
    // TODO: implement me!
  }

  removeSong = (videoId) => {
    // TODO: implement me!
  }

  addOnChangeListener = (callback) => {
    this.realm.addListener('change', callback);
  }
}

const playlistsDB = new PlaylistsDB();

export default playlistsDB;
