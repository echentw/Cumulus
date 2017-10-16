import { combineReducers } from 'redux';

import * as playerReducer from './player';

export default combineReducers(Object.assign({},
  playerReducer,
));
