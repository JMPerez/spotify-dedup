const clientId = '04dca0de1c4e4aca88cc615ac23581be';
const redirectUri =
  'location' in global && global['location']['host'] === 'localhost:3000'
    ? 'http://localhost:3000/callback'
    : 'https://spotify-dedup.com/callback/';

let host: string | null = null;
const h = /http[s]?:\/\/[^/]+/.exec(redirectUri);
if (h) {
  host = h[0];
}

export default {
  clientId,
  redirectUri,
  host,
};
