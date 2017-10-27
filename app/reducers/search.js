import createReducer from '../lib/createReducer';
import * as types from '../actions/types';

export const searchQuery = createReducer('', {
  [types.UPDATE_SEARCH_QUERY]: (state, action) => {
    return action.query;
  }
});

export const searchResults = createReducer([], {
  [types.UPDATE_SEARCH_RESULTS]: (state, action) => {
    return action.results;
  }
});
