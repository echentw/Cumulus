import * as types from './types';

export function updateSearchQuery(query) {
  return {
    type: types.UPDATE_SEARCH_QUERY,
    query: query,
  };
}

export function updateSearchResults(results) {
  return {
    type: types.UPDATE_SEARCH_RESULTS,
    results: results,
  };
}
