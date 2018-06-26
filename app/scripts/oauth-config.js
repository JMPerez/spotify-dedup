const clientId = '04dca0de1c4e4aca88cc615ac23581be';
const redirectUri =
  location.host === 'localhost:8005'
    ? 'http://localhost:8005/callback.html'
    : 'https://jmperezperez.com/spotify-dedup/callback.html';

const host = /http[s]?:\/\/[^/]+/.exec(redirectUri)[0];

export default {
  clientId,
  redirectUri,
  host
};
