import SpotifyWebApi, {
  SpotifyPlaylistTrackType,
  SpotifyPlaylistType,
  SpotifySavedTrackType,
  SpotifyTrackType,
} from './spotifyApi';
import { Duplicate, PlaylistModel } from './types';

import promisesForPages from './promiseForPages';

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
    let duplicates: Array<Duplicate> = [];
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
    }, duplicates);
    return result;
  }
}

function removeDuplicatesInArray(data: string[]): string[] {
  return data.filter((value, index, self) => self.indexOf(value) === index);
}

export class PlaylistDeduplicator extends BaseDeduplicator {
  static async getTracks(
    api: SpotifyWebApi,
    playlist: SpotifyPlaylistType,
    onProgressChanged: (progress: number) => void,
  ): Promise<Array<SpotifyTrackType>> {
    return new Promise((resolve, reject) => {
      const tracks: Array<SpotifyTrackType> = [];
      promisesForPages(
        api,
        api.getGeneric(playlist.tracks.href), // 'https://api.spotify.com/v1/users/11153223185/playlists/0yygtDHfwC7uITHxfrcQsF/tracks'
        onProgressChanged,
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
              if (item?.track) {
                tracks.push(item.track);
              }
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

        let promises: Array<() => {}> = [];

        // due to the change in Spotify's API, we can no longer specify a position to be deleted.
        // thus, we need to delete all the tracks with a certain id, and then add a track in the right position.

        // first, let's remove the duplicates that are based on artist name alone, as we are fine deleting
        // all instances of these

        // todo: we should probably use the id from "linked_from" for deduplication
        const tracksToRemoveSameNameArtist = removeDuplicatesInArray(playlistModel.duplicates.filter(duplicate => duplicate.reason === 'same-name-artist')
          .map((d) => d.track.linked_from ? d.track.linked_from.uri : d.track.uri));


        if (tracksToRemoveSameNameArtist.length) {
          do {
            const chunk = tracksToRemoveSameNameArtist.splice(0, 100);
            (function (playlistModel, chunk, api) {
              promises.push(() =>
                api.removeTracksFromPlaylist(
                  playlistModel.playlist.id,
                  chunk
                )
              );
            })(playlistModel, chunk, api);
          } while (tracksToRemoveSameNameArtist.length > 0);
        }

        // second, let's remove the duplicates that are based on ids
        const tracksToRemoveSameId = removeDuplicatesInArray(
          playlistModel.duplicates.filter(duplicate => duplicate.reason === 'same-id')
            .map((d) => d.track.linked_from ? d.track.linked_from.uri : d.track.uri)
        );

        const tracksToAddBack = [...tracksToRemoveSameId];
        if (tracksToRemoveSameId.length) {
          do {
            const chunk = tracksToRemoveSameId.splice(0, 100);
            (function (playlistModel, chunk, api) {
              promises.push(() => {
                const result = api.removeTracksFromPlaylist(
                  playlistModel.playlist.id,
                  chunk
                );
                return result;
              }
              );
            })(playlistModel, chunk, api);
          } while (tracksToRemoveSameId.length > 0);
        }

        // last, put back one instance for each of the removed set of tracks with the same id
        // to simplify things, just append it
        // ideally, we would store the index of the first appearance, and for each of the above
        // removals calculate the new position, but it's quite complex, and the API might throw
        // an error if the index is beyond the current playlist length

        // todo: check if there would be an error if trying to create it outbound

        if (tracksToAddBack.length) {
          do {
            const chunk = tracksToAddBack.splice(0, 100);
            (function (playlistModel, chunk, api) {
              promises.push(() =>
                api.addTracksToPlaylist(
                  playlistModel.playlist.id,
                  chunk
                )
              );
            })(playlistModel, chunk, api);
          } while (tracksToAddBack.length > 0);
        }

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
    initialRequest,
    onProgressChanged: (progress: number) => void,
  ): Promise<Array<SpotifyTrackType>> {
    return new Promise((resolve, reject) => {
      const tracks: Array<SpotifyTrackType> = [];
      promisesForPages(api, initialRequest, onProgressChanged)
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
              if (item?.track) {
                tracks.push(item.track);
              }
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
      duplicates: Array<Duplicate>;
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
