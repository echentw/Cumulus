import Realm from 'realm';
import {
  Song,
  DownloadingSong,
  Playlist,
} from './schemas';

const realm = new Realm({
  schema: [
    Song,
    DownloadingSong,
    Playlist,
  ],
  schemaVersion: 1,
  migration: (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < 1) {
      const oldPlaylists = oldRealm.objects(Playlist.schema.name);
      const newPlaylists = newRealm.objects(Playlist.schema.name);

      for (let i = 0; i < newPlaylists.length; ++i) {
        newPlaylists[i].downloadingSongs = [];
      }
    }
  }
});

export default realm;
