import fetch from './customFetch';

export interface SpotifyArtist {
  id: string;
  name: string;
}

export interface SpotifyTrack {
  artists: Array<SpotifyArtist>;
  duration_ms: number;
  id: string;
  linked_from?: SpotifyTrack;
  name: string;
  uri: string;
  added_at?: string;
}

export interface SpotifyPlaylist {
  id: string;
  images?: Array<{ url: string }>;
  name: string;
  owner: SpotifyUser;
  snapshot_id?: string;
  tracks: {
    href: string;
    total: number;
  };
}

export interface SpotifyPlaylistTrack {
  added_at: string;
  added_by: SpotifyUser;
  is_local: boolean;
  track: SpotifyTrack | null;
}

export interface SpotifySavedTrack {
  added_at: string;
  track: SpotifyTrack | null;
}

export interface SpotifyUser {
  display_name?: string;
  href: string;
  id: string;
  type: 'user';
  uri: string;
}

export interface SpotifyCurrentUser {
  country: string;
  display_name: string;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  product: string;
  type: string;
  uri: string;
}

type Page<Type> = {
  href: string;
  items: Array<Type>;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}

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
      let parsedJSON: Object;
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
  token: string | null;

  constructor() {
    this.token = null;
  }

  setAccessToken(token: string) {
    this.token = token;
  }


  async getMe(): Promise<SpotifyCurrentUser> {
    return await this.getGeneric(`${apiPrefix}/me`) as SpotifyCurrentUser;
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
      return parseAPIResponse(res as Response);
    } catch (e) {
      console.error('e', e);
      return Promise.reject(e);
    }
  }

  async getCurrentUserPlaylists(options?: { limit?: number }) {
    const url = `${apiPrefix}/me/playlists`;
    return await this.getGeneric(url, options);
  }

  async removeTracksFromPlaylist(
    playlistId: string,
    positions: Array<number>
  ) {
    const res = await fetch(
      `${apiPrefix}/playlists/${playlistId}/tracks`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({
          positions
        })
      });
    return parseAPIResponse(res as Response);
  }

  async addTracksToPlaylist(
    playlistId: string,
    uris: Array<string>,
    position: number
  ) {
    const res = await fetch(
      `${apiPrefix}/playlists/${playlistId}/tracks`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({ uris, position }),
      }
    );
    return parseAPIResponse(res as Response);
  }

  async getMySavedTracks(options?: { limit?: number }): Promise<Page<SpotifySavedTrack>> {
    return this.getGeneric(`${apiPrefix}/me/tracks`, options) as Promise<Page<SpotifySavedTrack>>;
  }

  async removeFromMySavedTracks(trackIds: Array<string>) {
    const res = await fetch(`${apiPrefix}/me/tracks`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({ ids: trackIds }),
    });
    return parseAPIResponse(res as Response);
  }
}
