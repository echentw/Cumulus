import { AsyncStorage } from 'react-native';

import { refreshAccessToken } from './serverRequest';

const MAX_RESULTS = 15;

function hitYoutubeSearchEndpoint(searchQuery, accessToken) {
  const url = [
    'https://content.googleapis.com/youtube/v3/search?maxResults=' + MAX_RESULTS,
    'part=snippet',
    'q=' + searchQuery,
    'type=video'
  ].join('&');

  return fetch(url, {
    method: 'GET',
    referrerPolicy: 'no-referrer-when-downgrade',
    headers: {
      'accept': '*/*',
      'accept-encoding': 'deflate',
      'accept-language': 'en-US,en;q=0.8',
      'authorization': 'Bearer ' + accessToken,
    },
  });
}

export default function youtubeSearch(searchQuery) {
  return AsyncStorage.getItem('accessToken')
    .then((accessToken) => {
      return hitYoutubeSearchEndpoint(searchQuery, accessToken);
    })
    .then((response) => {
      return new Promise((resolve, reject) => {
        if (response.status == 200) {
          return resolve(response);
        }

        if (response.status == 401) {
          // Need to refresh access token.
          refreshAccessToken()
            .then((response) => {
              const accessToken = JSON.parse(response._bodyText).accessToken;
              AsyncStorage.setItem('accessToken', accessToken).then(() => {
                hitYoutubeSearchEndpoint(searchQuery, accessToken)
                  .then((response) => {
                    if (response.status == 200) {
                      return resolve(response);
                    } else {
                      return reject('Unknown error when trying to refresh access token.');
                    }
                  });
              });
            });
        }
      });
    });
}
