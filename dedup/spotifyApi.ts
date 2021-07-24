import fetch from './customFetch';
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
  playlist: SpotifyPlaylistType
};

export type SpotifySavedTrackType = {
  added_at: string;
  track: SpotifyTrackType | null;
};

export type SpotifyUserType = {
  display_name?: string;
  href: string;
  id: string;
  type: 'user';
  uri: string;
};

const apiPrefix = 'https://api.spotify.com/v1';

function NetworkException(message: string, status: number) {
  this.message = message;
  this.status = status;
  this.name = 'NetworkException';
}

function ServerException(json: Object, status: number) {
  this.message = 'There was a Server Exception';
  this.json = json;
  this.status = status;
  this.name = 'ServerException';
}

function ApplicationException(json: Object, status: number) {
  this.message = 'There was an Application Exception';
  this.json = json;
  this.status = status;
  this.name = 'ApplicationException';
}

function InvalidJSONException(body: string, status: number) {
  this.message = 'There was an Invalid JSON Exception';
  this.body = body;
  this.status = status;
  this.name = 'InvalidJSONException';
}

const parseAPIResponse = (response: Response): Object =>
  new Promise((resolve) => resolve(response.text()))
    .catch((err) => {
      throw new NetworkException(err.message, response.status);
    })
    .then((responseBody: string) => {
      let parsedJSON: Object = null;
      try {
        parsedJSON = responseBody === '' ? null : JSON.parse(responseBody);
      } catch (e) {
        // We should never get these unless response is mangled
        // Or API is not properly implemented
        throw new InvalidJSONException(responseBody, response.status);
      }
      if (response.ok) return parsedJSON;
      if (response.status >= 500) {
        throw new ServerException(parsedJSON, response.status);
      } else {
        throw new ApplicationException(parsedJSON, response.status);
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
          .map((k) => `${k}=${options[k]}`)
          .join('&')}`;

    try {
      const res = await fetch(`${url}${optionsString}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.token}`,
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
      tracks: uris.map((uri) => (typeof uri === 'string' ? { uri: uri } : uri)),
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

  async getMySavedTracks(options?: { limit?: number }) {
    return this.getGeneric(`${apiPrefix}/me/tracks`, options);
  }

  async removeFromMySavedTracks(trackIds: Array<string>) {
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
