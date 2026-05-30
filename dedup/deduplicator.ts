import SpotifyWebApi, { SpotifyPlaylist, SpotifyPlaylistTrack, SpotifySavedTrack, SpotifyTrack } from './spotifyApi';
import { Duplicate, PlaylistModel } from './types';

import promisesForPages from './promiseForPages';

class BaseDeduplicator {
  async removeDuplicates(model) {
    throw 'Not implemented';
  }

  async getTracks() {
    throw 'Not implemented';
  }

  static findDuplicatedTracks(tracks: Array<SpotifyTrack>) {
    const seenIds: { [key: string]: boolean } = {};
    const seenNameAndArtist: { [key: string]: Array<number> } = {};
    let duplicates: Array<Duplicate> = [];
    const result = tracks.reduce((duplicates, track, index) => {
      if (track === null) return duplicates;
      if (track.id === null) return duplicates;
      let reasonDuplicate: 'same-id' | 'same-name-artist' | null = null;
      const seenNameAndArtistKey =
        `${track.name}:${track.artists.map(artist => artist.name).join(",")}`.toLowerCase();
      if (track.id in seenIds) {
        // if the two tracks have the same Spotify ID, they are duplicates
        reasonDuplicate = 'same-id';
      } else {
        // if they have the same name, all artists, and roughly same duration
        // we consider them duplicates too
        if (seenNameAndArtistKey in seenNameAndArtist) {
          // we check if _any_ of the previous durations is similar to the one we are checking
          if (
            seenNameAndArtist[seenNameAndArtistKey].filter(
              (duration) => Math.abs(duration - track.duration_ms) < 2000
            ).length !== 0
          ) {
            reasonDuplicate = 'same-name-artist';
          }
        }
      }
      if (reasonDuplicate !== null) {
        duplicates.push({
          index: index,
          track: track,
          reason: reasonDuplicate,
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

export class PlaylistDeduplicator extends BaseDeduplicator {
  static async getTracks(
    api: SpotifyWebApi,
    playlist: SpotifyPlaylist,
    onProgressChanged: (progress: number) => void,
  ): Promise<Array<SpotifyTrack>> {
    return new Promise((resolve, reject) => {
      const tracks: Array<SpotifyTrack> = [];
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
            page.items.forEach((item: SpotifyPlaylistTrack) => {
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
      const tracksToRemove = playlistModel.duplicates
        .map((d) => ({
          uri: d.track.linked_from ? d.track.linked_from.uri : d.track.uri,
          positions: [d.index],
        }))
      const promises: Array<() => {}> = [];

      // generate the list of all the positions to be removed
      const positions: Array<number> =
        tracksToRemove.reduce((prev, current) => prev.concat(current.positions),
          [] as number[])
          .sort((a, b) => b - a); // reverse so we delete the last ones first
      do {
        const chunk = positions.splice(0, 100);
        (function (playlistModel, chunk, api) {
          promises.push(() =>
            api.removeTracksFromPlaylist(
              playlistModel.playlist.id,
              chunk
            )
          );
        })(playlistModel, chunk, api);
      } while (positions.length > 0);

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

    });
  }
}

export class SavedTracksDeduplicator extends BaseDeduplicator {
  static async getTracks(
    api: SpotifyWebApi,
    initialRequest,
    onProgressChanged: (progress: number) => void,
  ): Promise<Array<SpotifyTrack>> {
    console.log('getTracks', initialRequest)
    return new Promise((resolve, reject) => {
      const tracks: Array<SpotifyTrack> = [];
      console.log('promisesForPages', initialRequest)
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
            page.items.forEach((item: SpotifySavedTrack) => {
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