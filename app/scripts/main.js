/*global ko, Queue, SpotifyWebApi, OAuthManager, Promise */

(function() {
  'use strict';

  var token,
      api;

  function PlaylistModel(playlist) {
    this.playlist = playlist;
    this.duplicates = ko.observableArray([]);
    var self = this;
    this.removeDuplicates = function() {
      queue.add(function() {

        var tracksToRemove = self.duplicates().map(function(d) {
          return {
            uri: d.track.uri,
            positions: [d.index]
          };
        });

        // remove chunks of max 100 tracks
        // find again duplicated tracks
        // delete another chunk

        var chunk = tracksToRemove.splice(0, 100);

        api.removeTracksFromPlaylist(
          self.playlist.owner.id,
          self.playlist.id,
          chunk).then(function() {
            playlistProcessor.process(self)
              .then(function() {
                if (tracksToRemove.length > 0) {
                  self.removeDuplicates();
                } else {
                  self.duplicates([]);
                  self.status('Duplicates removed');
                }
              });
          });
      });
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
    var seen = {};
    playlist.duplicates([]);
    return new Promise(function(resolve, reject) {
      return promisesForPages(
        queue.add(function() {
          return api.getGeneric(playlist.playlist.tracks.href);
        }))
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
              if (item.track.id in seen) {
                playlist.duplicates.push({
                  index: pageOffset + index,
                  track: item.track
                });
              } else {
                seen[item.track.id] = true;
              }
            }
          });
        });
        resolve();
      }).catch (reject);
    });
  };

  var queue = new Queue(10),
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
          'playlist-modify-public',
          'playlist-modify-private'
        ]
      }).then(function(token) {
        onTokenReceived(token);
      }).catch(function(error) {
        console.error(error);
      });
  });

  function fetchUserOwnedPlaylists(user) {
    return promisesForPages(queue.add(function() {
      // fetch user's playlists, 50 at a time
        return api.getUserPlaylists(user, {limit: 50});
      }))
      .then(function(pagePromises) {
        // wait for all promises to be finished
        return Promise.all(pagePromises);
      }).then(function(pages) {
        // combine and filter playlists
        var userOwnedPlaylists = [];
        pages.forEach(function(page) {
          userOwnedPlaylists = userOwnedPlaylists.concat(
            page.items.filter(function(playlist) {
              return playlist.owner.id === user;
            })
          );
        });
        return userOwnedPlaylists;
      });
  }

  function onPlaylistProcessed(playlist) {
    playlist.processed(true);
    model.toProcess(model.toProcess() - 1);
  }

  function onUserDataFetched(data) {
    var user = data.id,
        playlistsToCheck = [];

    fetchUserOwnedPlaylists(user)
      .then(function(ownedPlaylists) {
        playlistsToCheck = ownedPlaylists;
    
        model.playlists(playlistsToCheck.map(function(p) {
          return new PlaylistModel(p);
        }));

        model.toProcess(model.playlists().length);

        model.playlists().forEach(function(playlist) {
          playlistProcessor.process(playlist)
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

    queue.add(function() {
      return api.getMe().then(onUserDataFetched);
    });
  }


  function promisesForPages(promise) {

    function stripParameters(href) {
      var u = new URL(href);
      return u.origin + u.pathname;
    }

    function fetchGeneric(results, offset, limit) {
      return api.getGeneric(stripParameters(results.href) +
        '?offset=' + offset +
        '&limit=' + limit);
    }

    return new Promise(function(resolve, reject) {
      promise.then(function(results) {
        var promises = [promise],                       // add the initial page
            offset = results.limit + results.offset,    // start from the second page
            limit = results.limit;
        while (results.total > offset) {
          var q = queue.add(fetchGeneric.bind(this, results, offset, limit));
          promises.push(q);
          offset += limit;
        }
        resolve(promises);
      }).catch(function() {
        reject([]);
      });
    });
  }

})();
