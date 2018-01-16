import { combineReducers } from 'redux';

import * as playerReducer from './player';
import * as userReducer from './user';
import * as searchReducer from './search';
import * as searchBarReducer from './searchBar';
import * as currentlyPlayingReducer from './currentlyPlaying';
import * as currentlyDownloadingReducer from './currentlyDownloading';

export default combineReducers(Object.assign({},
  playerReducer,
  userReducer,
  searchReducer,
  searchBarReducer,
  currentlyPlayingReducer,
  currentlyDownloadingReducer,
));
