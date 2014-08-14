(function() {
  'use strict';

  function receiveMessage(event){
      if (event.origin !== "http://localhost:8000") {
          return;
      }
      if (authWindow) {
          authWindow.close();
      }
      process(event.data);
  }

  window.addEventListener("message", receiveMessage, false);

  function toQueryString(obj) {
      var parts = [];
      for (var i in obj) {
          if (obj.hasOwnProperty(i)) {
              parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
          }
      }
      return parts.join("&");
  }

  var authWindow = null;

  var token = null;

  var api;

  var model;

  function PlaylistModel(playlist){
    this.playlist = playlist;
    this.duplicates = ko.observableArray([]);
    var self = this;
    this.removeDuplicates = function() {
      api.removeTracksFromPlaylist(
        this.playlist.owner.id,
        this.playlist.id,
        this.duplicates().map(function(d) {
          return {
            uri: d.track.uri,
            positions: [d.index]
          }
        })).then(function() {
          self.duplicates([]);
          self.status('Duplicates removed');
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

  model = new PlaylistsDedupModel();
  ko.applyBindings(model);

  document.getElementById('login').addEventListener('click', function() {

      var width = 400,
          height = 600;
      var left = (screen.width / 2) - (width / 2);
      var top = (screen.height / 2) - (height / 2);

      var params = {
          client_id: '04dca0de1c4e4aca88cc615ac23581be',
          redirect_uri: 'http://localhost:8000/callback.html',
          scope: 'playlist-read-private playlist-modify-public playlist-modify-private',
          response_type: 'token'
      };
      authWindow = window.open(
          "https://accounts.spotify.com/authorize?" + toQueryString(params),
          "Spotify",
          'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
      );

  });


  function process(accessToken) {
    model.isLoggedIn(true);
    token = accessToken;

    api = new SpotifyWebApi();
    api.setAccessToken(token);
    api.getMe().then(function(data) {
      var user = data.id;
      // todo: get more than 100
      api.getUserPlaylists(user).then(function(data) {
        // do we have more?
        var playlistsToCheck = data.items.filter(function(playlist) {
          return playlist.owner.id === user
        });

        model.playlists(playlistsToCheck.map(function(p){
          return new PlaylistModel(p);
        }));

        model.toProcess(model.playlists().length);
        model.playlists().forEach(processPlaylist);
      });
    });
  }

  function processPlaylist(playlist) {
    var seen = {};
    setTimeout(function() {
      // todo: paginate through tracks
      api.getGeneric(playlist.playlist.tracks.href).then(function(data) {
        data.items.forEach(function(item, index) {
          if (item.track.id !== null) {
            if (item.track.id in seen) {
              playlist.duplicates.push({
                index: index,
                track: item.track
              });
            } else {
              seen[item.track.id] = true;
            }
          }
        });
        playlist.processed(true);
        model.toProcess(model.toProcess() - 1);
      }).catch(function() {
        playlist.processed(true);
        model.toProcess(model.toProcess() - 1);
      })
    }, (Math.random() * 3000));
  }
})();
