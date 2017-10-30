export default function youtubeSearch(searchQuery, accessToken) {
  const maxResults = 10;

  const url = [
    'https://content.googleapis.com/youtube/v3/search?maxResults=' + maxResults,
    'part=snippet',
    'q=' + searchQuery,
    'type=video'
  ].join('&');

  return fetch(url, {
    method: 'GET',
    referrerPolicy: 'no-referrer-when-downgrade',
    headers: {
      'accept': '*/*',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en-US,en;q=0.8',
      'authorization': 'Bearer ' + accessToken,
    },
  });
}
