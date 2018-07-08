import promisesForPages from './promiseForPages';

let token;
let api;

class BaseDeduplicator {
  constructor(api, promiseThrottle) {
    this.api = api;
    this.promiseThrottle = promiseThrottle;
  }

  async removeDuplicates(model) {
    throw 'Not implemented';
  }

  async getTracks() {
    throw 'Not implemented';
  }

  findDuplicatedTracks(tracks) {
    const seenIds = {};
    const seenNameAndArtist = {};
    const result = tracks.reduce((duplicates, track, index) => {
      if (track === null) return duplicates;
      if (track.id === null) return duplicates;
      let isDuplicate = false;
      const seenNameAndArtistKey = `${track.name}:${track.artists[0].name}`;
      if (track.id in seenIds) {
        // if the two tracks have the same Spotify ID, they are duplicates
        isDuplicate = true;
      } else {
        // if they have the same name, main artist, and roughly same duration
        // we consider tem duplicates too
        if (
          seenNameAndArtistKey in seenNameAndArtist &&
          Math.abs(
            seenNameAndArtist[seenNameAndArtistKey] - track.duration_ms
          ) < 2000
        ) {
          isDuplicate = true;
        }
      }
      if (isDuplicate) {
        duplicates.push({
          index: index,
          track: track,
          reason: track.id in seenIds ? 'same-id' : 'same-name-artist'
        });
      } else {
        seenIds[track.id] = true;
        seenNameAndArtist[seenNameAndArtistKey] = track.duration_ms;
      }
      return duplicates;
    }, []);
    return result;
  }
}

export class PlaylistDeduplicator extends BaseDeduplicator {
  constructor(api, promiseThrottle) {
    super(api, promiseThrottle);
  }
  async getTracks(playlist) {
    return new Promise((resolve, reject) => {
      const tracks = [];
      promisesForPages(
        this.promiseThrottle.add(() =>
          this.api.getGeneric(playlist.tracks.href)
        ),
        this.promiseThrottle,
        this.api
      )
        .then((
          pagePromises // todo: I'd love to replace this with
        ) =>
          // .then(Promise.all)
          // à la http://www.html5rocks.com/en/tutorials/es6/promises/#toc-transforming-values
          Promise.all(pagePromises)
        )
        .then(pages => {
          pages.forEach(page => {
            const pageOffset = page.offset;
            page.items.forEach((item, index) => {
              tracks.push(item.track);
            });
          });
          resolve(tracks);
        })
        .catch(reject);
    });
  }

  async removeDuplicates(playlistModel) {
    return new Promise((resolve, reject) => {
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
        this.promiseThrottle.add(async () => {
          const tracksToRemove = playlistModel.duplicates
            .map(d => ({
              uri: d.track.linked_from ? d.track.linked_from.uri : d.track.uri,
              positions: [d.index]
            }))
            .reverse(); // reverse so we delete the last ones first
          const promises = [];
          do {
            const chunk = tracksToRemove.splice(0, 100);
            promises.push(
              this.promiseThrottle.add(() => {
                return this.api.removeTracksFromPlaylist(
                  playlistModel.playlist.owner.id,
                  playlistModel.playlist.id,
                  chunk
                );
              })
            );
          } while (tracksToRemove.length > 0);
          Promise.all(promises).then(() => {
            playlistModel.duplicates.duplicates = [];
            resolve();
          });
        });
      }
    });
  }
}

export class SavedTracksDeduplicator extends BaseDeduplicator {
  constructor(api, promiseThrottle) {
    super(api, promiseThrottle);
  }

  async getTracks(savedTracks) {
    return new Promise((resolve, reject) => {
      const tracks = [];
      promisesForPages(
        this.promiseThrottle.add(() => this.api.getGeneric(savedTracks.href)),
        this.promiseThrottle,
        this.api
      )
        .then((
          pagePromises // todo: I'd love to replace this with
        ) =>
          // .then(Promise.all)
          // à la http://www.html5rocks.com/en/tutorials/es6/promises/#toc-transforming-values
          Promise.all(pagePromises)
        )
        .then(pages => {
          pages.forEach(page => {
            const pageOffset = page.offset;
            page.items.forEach((item, index) => {
              tracks.push(item.track);
            });
          });
          resolve(tracks);
        })
        .catch(reject);
    });
  }

  async removeDuplicates(model) {
    return new Promise((resolve, reject) => {
      const tracksToRemove = model.duplicates.map(
        d => (d.track.linked_from ? d.track.linked_from.id : d.track.id)
      );
      do {
        (async () => {
          const chunk = tracksToRemove.splice(0, 50);
          await this.promiseThrottle.add(() =>
            this.api.removeFromMySavedTracks(chunk)
          );
        })();
      } while (tracksToRemove.length > 0);
      model.duplicates = [];
      resolve();
    });
  }
}
