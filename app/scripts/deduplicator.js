import promisesForPages from './promiseForPages';

let token;
let api;

export default class Deduplicator {
  constructor(api, promiseThrottle) {
    this.api = api;
    this.promiseThrottle = promiseThrottle;
  }

  async findDuplicates(playlist) {
    const seenIds = {};
    const seenNameAndArtist = {};
    const duplicates = [];
    return new Promise((resolve, reject) =>
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
              if (item.track.id !== null) {
                let isDuplicate = false;
                const seenNameAndArtistKey = `${item.track.name}:${
                  item.track.artists[0].name
                }`;
                if (item.track.id in seenIds) {
                  // if the two items have the same Spotify ID, they are duplicates
                  isDuplicate = true;
                } else {
                  // if they have the same name, main artist, and roughly same duration
                  // we consider tem duplicates too
                  if (
                    seenNameAndArtistKey in seenNameAndArtist &&
                    Math.abs(
                      seenNameAndArtist[seenNameAndArtistKey] -
                        item.track.duration_ms
                    ) < 2000
                  ) {
                    isDuplicate = true;
                  }
                }
                if (isDuplicate) {
                  duplicates.push({
                    index: pageOffset + index,
                    track: item.track,
                    reason:
                      item.track.id in seenIds ? 'same-id' : 'same-name-artist'
                  });
                } else {
                  seenIds[item.track.id] = true;
                  seenNameAndArtist[seenNameAndArtistKey] =
                    item.track.duration_ms;
                }
              }
            });
          });
          resolve(duplicates);
        })
        .catch(reject)
    );
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
          const tracksToRemove = playlistModel.duplicates.map(d => ({
            uri: d.track.linked_from ? d.track.linked_from.uri : d.track.uri,
            positions: [d.index]
          }));

          // remove chunks of max 100 tracks
          // find again duplicated tracks
          // delete another chunk

          const chunk = tracksToRemove.splice(0, 100);

          const result = await this.api.removeTracksFromPlaylist(
            playlistModel.playlist.owner.id,
            playlistModel.playlist.id,
            chunk
          );
          const duplicates = await this.findDuplicates(playlistModel.playlist);
          if (duplicates.length > 0) {
            playlistModel.duplicates = duplicates;
            this.removeDuplicates(playlistModel);
          } else {
            resolve();
          }
        });
      }
    });
  }
}
