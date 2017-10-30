import { Navigation } from 'react-native-navigation';

import Login from './components/Login/Login';
import Search from './components/Search/Search';
import Drawer from './components/Drawer/Drawer';
import SavedSongs from './components/SavedSongs/SavedSongs';
import Playlists from './components/Playlists/Playlists';

export function registerScreens(store, Provider) {
  Navigation.registerComponent('Cumulus.Login', () => Login, store, Provider);
  Navigation.registerComponent('Cumulus.Search', () => Search, store, Provider);
  Navigation.registerComponent('Cumulus.Drawer', () => Drawer, store, Provider);
  Navigation.registerComponent('Cumulus.SavedSongs', () => SavedSongs, store, Provider);
  Navigation.registerComponent('Cumulus.Playlists', () => Playlists, store, Provider);
}
