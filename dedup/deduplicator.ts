import promisesForPages from './promiseForPages';
import SpotifyWebApi, {
  SpotifyTrackType,
  SpotifyPlaylistType,
  SpotifyPlaylistTrackType,
  SpotifySavedTrackType,
} from './spotifyApi';
import { PlaylistModel } from './types';

class BaseDeduplicator {
  async removeDuplicates(model) {
    throw 'Not implemented';
  }

  async getTracks() {
    throw 'Not implemented';
  }

  static findDuplicatedTracks(tracks: Array<SpotifyTrackType>) {
    const seenIds: { [key: string]: boolean } = {};
    const seenNameAndArtist: { [key: string]: Array<number> } = {};
    const result = tracks.reduce((duplicates, track, index) => {
      if (track === null) return duplicates;
      if (track.id === null) return duplicates;
      let isDuplicate = false;
      const seenNameAndArtistKey =
        `${track.name}:${track.artists[0].name}`.toLowerCase();
      if (track.id in seenIds) {
        // if the two tracks have the same Spotify ID, they are duplicates
        isDuplicate = true;
      } else {
        // if they have the same name, main artist, and roughly same duration
        // we consider tem duplicates too
        if (seenNameAndArtistKey in seenNameAndArtist) {
          // we check if _any_ of the previous durations is similar to the one we are checking
          if (
            seenNameAndArtist[seenNameAndArtistKey].filter(
              (duration) => Math.abs(duration - track.duration_ms) < 2000
            ).length !== 0
          ) {
            isDuplicate = true;
          }
        }
      }
      if (isDuplicate) {
        duplicates.push({
          index: index,
          track: track,
          reason: track.id in seenIds ? 'same-id' : 'same-name-artist',
        });
      } else {
        seenIds[track.id] = true;
        seenNameAndArtist[seenNameAndArtistKey] =
          seenNameAndArtist[seenNameAndArtistKey] || [];
        seenNameAndArtist[seenNameAndArtistKey].push(track.duration_ms);
      }
      return duplicates;
    }, []);
    return result;
  }
}

export class PlaylistDeduplicator extends BaseDeduplicator {
  static async getTracks(
    api: SpotifyWebApi,
    playlist: SpotifyPlaylistType
  ): Promise<Array<SpotifyTrackType>> {
    return new Promise((resolve, reject) => {
      const tracks = [];
      promisesForPages(
        api,
        api.getGeneric(playlist.tracks.href) // 'https://api.spotify.com/v1/users/11153223185/playlists/0yygtDHfwC7uITHxfrcQsF/tracks'
      )
        .then(
          (
            pagePromises // todo: I'd love to replace this with
          ) =>
            // .then(Promise.all)
            // à la http://www.html5rocks.com/en/tutorials/es6/promises/#toc-transforming-values
            Promise.all(pagePromises)
        )
        .then((pages) => {
          pages.forEach((page) => {
            page.items.forEach((item: SpotifyPlaylistTrackType) => {
              tracks.push(item && item.track);
            });
          });
          resolve(tracks);
        })
        .catch(reject);
    });
  }

  static async removeDuplicates(
    api: SpotifyWebApi,
    playlistModel: PlaylistModel
  ) {
    return new Promise<void>((resolve, reject) => {
      if (playlistModel.playlist.id === 'starred') {
        reject(
          'It is not possible to delete duplicates from your Starred playlist using this tool since this is not supported in the Spotify Web API. You will need to remove these manually.'
        );
      }
      if (playlistModel.playlist.collaborative) {
        reject(
          'It is not possible to delete duplicates from a collaborative playlist using this tool since this is not supported in the Spotify Web API. You will need to remove these manually.'
        );
      } else {
        const tracksToRemove = playlistModel.duplicates
          .map((d) => ({
            uri: d.track.linked_from ? d.track.linked_from.uri : d.track.uri,
            positions: [d.index],
          }))
          .reverse(); // reverse so we delete the last ones first
        const promises = [];
        do {
          const chunk = tracksToRemove.splice(0, 100);
          (function (playlistModel, chunk, api) {
            promises.push(() =>
              api.removeTracksFromPlaylist(
                playlistModel.playlist.owner.id,
                playlistModel.playlist.id,
                chunk
              )
            );
          })(playlistModel, chunk, api);
        } while (tracksToRemove.length > 0);

        promises
          .reduce(
            (promise, func) => promise.then(() => func()),
            Promise.resolve(null)
          )
          .then(() => {
            playlistModel.duplicates = [];
            resolve();
          })
          .catch((e) => {
            reject(e);
          });
      }
    });
  }
}

export class SavedTracksDeduplicator extends BaseDeduplicator {
  static async getTracks(
    api: SpotifyWebApi,
    initialRequest
  ): Promise<Array<SpotifyTrackType>> {
    return new Promise((resolve, reject) => {
      const tracks = [];
      promisesForPages(api, initialRequest)
        .then(
          (
            pagePromises // todo: I'd love to replace this with
          ) =>
            // .then(Promise.all)
            // à la http://www.html5rocks.com/en/tutorials/es6/promises/#toc-transforming-values
            Promise.all(pagePromises)
        )
        .then((pages) => {
          pages.forEach((page) => {
            page.items.forEach((item: SpotifySavedTrackType) => {
              tracks.push(item.track);
            });
          });
          resolve(tracks);
        })
        .catch((e) => {
          console.error(
            `There was an error fetching the tracks from playlist ${initialRequest.href}`,
            e
          );
          reject(e);
        });
    });
  }

  static async removeDuplicates(
    api: SpotifyWebApi,
    model: {
      duplicates: Array<{
        index: number;
        reason: string;
        track: SpotifyTrackType;
      }>;
    }
  ) {
    return new Promise<void>((resolve, reject) => {
      const tracksToRemove: Array<string> = model.duplicates.map((d) =>
        d.track.linked_from ? d.track.linked_from.id : d.track.id
      );
      do {
        (async () => {
          const chunk = tracksToRemove.splice(0, 50);
          await api.removeFromMySavedTracks(chunk);
        })();
      } while (tracksToRemove.length > 0);
      model.duplicates = [];
      resolve();
    });
  }
}
