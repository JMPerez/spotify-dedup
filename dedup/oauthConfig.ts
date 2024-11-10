const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;

const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI || '';

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
