import createReducer from '../lib/createReducer';
import * as types from '../actions/types';

export const searchBarFocused = createReducer(false, {
  [types.SEARCH_BAR_FOCUS]: (state, action) => {
    return true;
  },
  [types.SEARCH_BAR_BLUR]: (state, action) => {
    return false;
  },
});
