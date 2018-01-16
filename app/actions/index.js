import * as UserActions from './user';
import * as PlayerActions from './player';
import * as SearchActions from './search';
import * as SearchBarActions from './searchBar';
import * as CurrentlyPlayingActions from './currentlyPlaying';
import * as CurrentlyDownloadingActions from './currentlyDownloading';

export const ActionCreators = Object.assign({},
  UserActions,
  PlayerActions,
  SearchActions,
  SearchBarActions,
  CurrentlyPlayingActions,
  CurrentlyDownloadingActions,
);
