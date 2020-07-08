import fetch, { ResponseType } from './custom-fetch';
export type SpotifyArtistType = {
  id: string;
  name: string;
};

export type SpotifyTrackType = {
  artists: Array<SpotifyArtistType>;
  duration_ms: number;
  id: string;
  linked_from: SpotifyTrackType;
  name: string;
  uri: string;
};

export type SpotifyPlaylistType = {
  collaborative: boolean;
  id: string;
  images?: Array<{ url: string }>;
  name: string;
  owner: SpotifyUserType;
  snapshot_id?: string;
  tracks: {
    href: string;
  };
};

export type SpotifyPlaylistTrackType = {
  added_at: string;
  added_by: SpotifyUserType;
  is_local: boolean;
  track: SpotifyTrackType | null;
}

export type SpotifySavedTrackType = {
  added_at: string;
  track: SpotifyTrackType | null;
}

export type SpotifyUserType = {
  display_name?: string;
  href: string;
  id: string;
  type: 'user';
  uri: string;
};

const apiPrefix = 'https://api.spotify.com/v1';

const parseAPIResponse = (response: Response): Promise<string> =>
  new Promise(resolve => resolve(response.text()))
    .catch(err =>
      Promise.reject({
        type: 'NetworkError',
        status: response.status,
        message: err,
      })
    )
    .then((responseBody: string) => {
      try {
        const parsedJSON =
          responseBody === '' ? null : JSON.parse(responseBody);
        if (response.ok) return parsedJSON;
        if (response.status >= 500) {
          return Promise.reject({
            type: 'ServerError',
            status: response.status,
            body: parsedJSON,
          });
        } else {
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
  token: string;

  constructor() {
    this.token = null;
  }

  setAccessToken(token: string) {
    this.token = token;
  }

  async getMe() {
    return await this.getGeneric(`${apiPrefix}/me`);
  }

  async getGeneric(url: string, options = {}) {
    const optionsString =
      Object.keys(options).length === 0
        ? ''
        : `?${Object.keys(options)
          .map(k => `${k}=${options[k]}`)
          .join('&')}`;

    try {
      const res = await fetch({
        url: `${url}${optionsString}`,
        options: {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        },
      });
      return parseAPIResponse(res);
    } catch (e) {
      console.error('e', e);
      return Promise.reject(e);
    }
  }

  async getUserPlaylists(userId: string, options?: { limit?: number }) {
    const url =
      typeof userId === 'string'
        ? `${apiPrefix}/users/${encodeURIComponent(userId)}/playlists`
        : `${apiPrefix}/me/playlists`;
    return await this.getGeneric(url, options);
  }

  async removeTracksFromPlaylist(
    userId: string,
    playlistId: string,
    uris: Array<string | { uri: string; positions: number[] }>
  ) {
    const dataToBeSent = {
      tracks: uris.map(uri => (typeof uri === 'string' ? { uri: uri } : uri)),
    };

    const res = await fetch({
      url: `${apiPrefix}/users/${encodeURIComponent(
        userId
      )}/playlists/${playlistId}/tracks`,
      options: {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(dataToBeSent),
      },
    });
    return parseAPIResponse(res);
  }

  async getMySavedTracks(options?: { limit?: number }) {
    return this.getGeneric(`${apiPrefix}/me/tracks`, options);
  }

  async removeFromMySavedTracks(trackIds: Array<string>) {
    const res = await fetch({
      url: `${apiPrefix}/me/tracks`,
      options: {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(trackIds),
      },
    });
    return parseAPIResponse(res);
  }
}
