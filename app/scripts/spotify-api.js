import fetch from './custom-fetch';

const apiPrefix = 'https://api.spotify.com/v1';

const parseAPIResponse = response =>
  new Promise(resolve => resolve(response.text()))
    .catch(err =>
      Promise.reject({
        type: 'NetworkError',
        status: response.status,
        message: err,
      })
    )
    .then(responseBody => {
      try {
        const parsedJSON = JSON.parse(responseBody);
        if (response.ok) return parsedJSON;
        if (response.status >= 500) {
          return Promise.reject({
            type: 'ServerError',
            status: response.status,
            body: parsedJSON,
          });
        } else {
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject({
            type: 'ApplicationError',
            status: response.status,
            body: parsedJSON,
          });
        }
      } catch (e) {
        // We should never get these unless response is mangled
        // Or API is not properly implemented
        return Promise.reject({
          type: 'InvalidJSON',
          status: response.status,
          body: responseBody,
        });
      }
    });

export default class SpotifyWebApi {
  constructor() {
    this.token = null;
  }

  /**
   * @void
   * @param {string} token
   */
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
    return parseAPIResponse(res);
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
    return parseAPIResponse(res);
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
    return parseAPIResponse(res);
  }
}
