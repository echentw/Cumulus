import Realm from 'realm';
import { Song, Playlist } from './schemas';

const realm = new Realm({ schema: [Song, Playlist] });

export default realm;
