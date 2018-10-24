const apiPrefix = 'https://api.spotify.com/v1';

export default class SpotifyWebApi {
  constructor() {
    this.token = null;
  }

  setAccessToken(token) {
    this.token = token;
  }

  async getMe() {
    return await this.getGeneric(`${apiPrefix}/me`);
  }

  async getGeneric(url, options = {}) {
    const optionsString =
      Object.keys(options).length === 0
        ? ''
        : `?${Object.keys(options)
            .map(k => `${k}=${options[k]}`)
            .join('&')}`;

    const res = await fetch(`${url}${optionsString}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    const json = await res.json();
    if (res.ok) return json;
    return null;
  }

  async getUserPlaylists(userId, options) {
    const url =
      typeof userId === 'string'
        ? `${apiPrefix}/users/${encodeURIComponent(userId)}/playlists`
        : `${apiPrefix}/me/playlists`;
    return await this.getGeneric(url, options);
  }

  async removeTracksFromPlaylist(userId, playlistId, uris) {
    const dataToBeSent = {
      tracks: uris.map(uri => (typeof uri === 'string' ? { uri: uri } : uri)),
    };

    const res = await fetch(
      `${apiPrefix}/users/${encodeURIComponent(
        userId
      )}/playlists/${playlistId}/tracks`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(dataToBeSent),
      }
    );

    const json = await res.json();
    if (res.ok) {
      return json;
    } else {
      global.Raven &&
        Raven.captureMessage(
          `Status ${res.status} when deleting tracks from playlist`,
          {
            extra: {
              json: json,
            },
          }
        );
    }
    return null;
  }

  async getMySavedTracks(options) {
    return this.getGeneric(`${apiPrefix}/me/tracks`, options);
  }

  async removeFromMySavedTracks(trackIds) {
    const res = await fetch(`${apiPrefix}/me/tracks`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(trackIds),
    });

    if (res.ok) return true;
    return false;
  }
}
