/*global ko, PromiseThrottle, SpotifyWebApi, OAuthManager, Promise */

(function() {
  'use strict';

  var token, api;

  function PlaylistModel(playlist) {
    this.playlist = playlist;
    this.duplicates = ko.observableArray([]);
    var self = this;
    this.removeDuplicates = function() {
      if (self.playlist.id === 'starred') {
        window.alert(
          'It is not possible to delete duplicates from your Starred playlist using this tool since this is not supported in the Spotify Web API. You will need to remove these manually.'
        );
      }
      if (self.playlist.collaborative) {
        window.alert(
          'It is not possible to delete duplicates from a collaborative playlist using this tool since this is not supported in the Spotify Web API. You will need to remove these manually.'
        );
      } else {
        promiseThrottle.add(function() {
          var tracksToRemove = self.duplicates().map(function(d) {
            /*jshint camelcase:false*/
            return {
              uri: d.track.linked_from ? d.track.linked_from.uri : d.track.uri,
              positions: [d.index]
            };
          });

          // remove chunks of max 100 tracks
          // find again duplicated tracks
          // delete another chunk

          var chunk = tracksToRemove.splice(0, 100);

          return api
            .removeTracksFromPlaylist(
              self.playlist.owner.id,
              self.playlist.id,
              chunk
            )
            .then(function() {
              return playlistProcessor.process(self).then(function() {
                if (tracksToRemove.length > 0) {
                  self.removeDuplicates();
                } else {
                  self.duplicates([]);
                  self.status('Duplicates removed');
                  if (window.ga) {
                    ga('spotify-dedup', 'playlist-removed-duplicates');
                  }
                }
              });
            });
        });
      }
    };
    this.status = ko.observable('');
    this.processed = ko.observable(false);
  }

  function PlaylistsDedupModel() {
    var self = this;
    this.playlists = ko.observableArray([]);
    this.isLoggedIn = ko.observable(false);
    this.toProcess = ko.observable(100);
    this.duplicates = ko.computed(function() {
      var total = 0;
      ko.utils.arrayForEach(self.playlists(), function(playlist) {
        total += ko.utils.unwrapObservable(playlist.duplicates()).length;
      });
      return total;
    });
  }

  var PlaylistProcessor = function() {};

  PlaylistProcessor.prototype.process = function(playlist) {
    var seenIds = {},
      seenNameAndArtist = {};
    playlist.duplicates([]);
    return new Promise(function(resolve, reject) {
      return promisesForPages(
        promiseThrottle.add(function() {
          return api.getGeneric(playlist.playlist.tracks.href);
        })
      )
        .then(function(pagePromises) {
          // todo: I'd love to replace this with
          // .then(Promise.all)
          // à la http://www.html5rocks.com/en/tutorials/es6/promises/#toc-transforming-values
          return Promise.all(pagePromises);
        })
        .then(function(pages) {
          pages.forEach(function(page) {
            var pageOffset = page.offset;
            page.items.forEach(function(item, index) {
              if (item.track.id !== null) {
                var isDuplicate = false,
                  seenNameAndArtistKey =
                    item.track.name + ':' + item.track.artists[0].name;
                if (item.track.id in seenIds) {
                  // if the two items have the same Spotify ID, they are duplicates
                  isDuplicate = true;
                } else {
                  // if they have the same name, main artist, and roughly same duration
                  // we consider tem duplicates too
                  /*jshint camelcase:false*/
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
                  playlist.duplicates.push({
                    index: pageOffset + index,
                    track: item.track,
                    reason:
                      item.track.id in seenIds ? 'same-id' : 'same-name-artist'
                  });
                } else {
                  seenIds[item.track.id] = true;
                  /*jshint camelcase:false*/
                  seenNameAndArtist[seenNameAndArtistKey] =
                    item.track.duration_ms;
                }
              }
            });
          });
          resolve();
        })
        .catch(reject);
    });
  };

  var promiseThrottle = new PromiseThrottle({ requestsPerSecond: 5 }),
    playlistProcessor = new PlaylistProcessor(),
    model = new PlaylistsDedupModel();

  ko.applyBindings(model);

  document.getElementById('login').addEventListener('click', function() {
    OAuthManager.obtainToken({
      scopes: [
        /*
          the permission for reading public playlists is granted
          automatically when obtaining an access token through
          the user login form
          */
        'playlist-read-private',
        'playlist-read-collaborative',
        'playlist-modify-public',
        'playlist-modify-private'
      ]
    })
      .then(function(token) {
        onTokenReceived(token);
      })
      .catch(function(error) {
        console.error(error);
      });
  });

  function fetchUserOwnedPlaylists(user) {
    return promisesForPages(
      promiseThrottle.add(function() {
        // fetch user's playlists, 50 at a time
        return api.getUserPlaylists(user, { limit: 50 });
      })
    )
      .then(function(pagePromises) {
        // wait for all promises to be finished
        return Promise.all(pagePromises);
      })
      .then(function(pages) {
        // combine and filter playlists
        var userOwnedPlaylists = [];
        pages.forEach(function(page) {
          userOwnedPlaylists = userOwnedPlaylists.concat(
            page.items.filter(function(playlist) {
              return playlist.owner.id === user;
            })
          );
        });
        // add starred
        userOwnedPlaylists.push({
          id: 'starred',
          owner: {
            id: user
          },
          name: 'Starred',
          href: 'https://api.spotify.com/v1/users/' + user + '/starred',
          tracks: {
            href: 'https://api.spotify.com/v1/users/' + user + '/starred/tracks'
          }
        });
        return userOwnedPlaylists;
      });
  }

  function onPlaylistProcessed(playlist) {
    playlist.processed(true);
    var remaining = model.toProcess() - 1;
    model.toProcess(remaining);
    if (remaining === 0 && window.ga) {
      ga('spotify-dedup', 'playlists-processed');
    }
  }

  function onUserDataFetched(data) {
    var user = data.id,
      playlistsToCheck = [];

    fetchUserOwnedPlaylists(user).then(function(ownedPlaylists) {
      playlistsToCheck = ownedPlaylists;
      model.playlists(
        playlistsToCheck.map(function(p) {
          return new PlaylistModel(p);
        })
      );

      model.toProcess(model.playlists().length);

      model.playlists().forEach(function(playlist) {
        playlistProcessor
          .process(playlist)
          .then(onPlaylistProcessed.bind(this, playlist))
          .catch(onPlaylistProcessed.bind(this, playlist));
      });
    });
  }

  function onTokenReceived(accessToken) {
    model.isLoggedIn(true);
    token = accessToken;

    api = new SpotifyWebApi();
    api.setAccessToken(token);

    promiseThrottle.add(function() {
      return api.getMe().then(onUserDataFetched);
    });
  }

  function promisesForPages(promise) {
    function stripParameters(href) {
      var u = new URL(href);
      return u.origin + u.pathname;
    }

    function fetchGeneric(results, offset, limit) {
      return api.getGeneric(
        stripParameters(results.href) + '?offset=' + offset + '&limit=' + limit
      );
    }

    return new Promise(function(resolve, reject) {
      promise
        .then(function(results) {
          var promises = [promise], // add the initial page
            offset = results.limit + results.offset, // start from the second page
            limit = results.limit;
          while (results.total > offset) {
            var q = promiseThrottle.add(
              fetchGeneric.bind(this, results, offset, limit)
            );
            promises.push(q);
            offset += limit;
          }
          resolve(promises);
        })
        .catch(function() {
          reject([]);
        });
    });
  }
})();
