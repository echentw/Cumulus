import { Navigation } from 'react-native-navigation';

import Login from '../components/Login/Login';
import Search from '../components/Search/Search';
import SearchBar from '../components/SearchBar/SearchBar';
import SavedSongs from '../components/SavedSongs/SavedSongs';
import Playlist from '../components/Playlist/Playlist';
import Playlists from '../components/Playlists/Playlists';
import CurrentSong from '../components/CurrentSong/CurrentSong';

export function registerScreens(store, Provider) {
  Navigation.registerComponent('Cumulus.Login', () => Login, store, Provider);
  Navigation.registerComponent('Cumulus.Search', () => Search, store, Provider);
  Navigation.registerComponent('Cumulus.SearchBar', () => SearchBar, store, Provider);
  Navigation.registerComponent('Cumulus.SavedSongs', () => SavedSongs, store, Provider);
  Navigation.registerComponent('Cumulus.Playlist', () => Playlist, store, Provider);
  Navigation.registerComponent('Cumulus.Playlists', () => Playlists, store, Provider);
  Navigation.registerComponent('Cumulus.CurrentSong', () => CurrentSong, store, Provider);
}
