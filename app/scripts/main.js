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

  var api;
  var dedupResultElement = document.querySelector('.dedup-result'),
      resultElement = document.querySelector('.result'),
      defaultContentElement = document.querySelector('.default-content'),
      playlistsListElement = document.querySelector('.playlists-list');

  var duplicates;
  function process(accessToken) {
    token = accessToken;
    duplicates = [];
    resultElement.innerHTML = '';
    defaultContentElement.style.display = 'none';
    dedupResultElement.style.display = 'block';

    api = new SpotifyWebApi();
    api.setAccessToken(token);
    api.getMe().then(function(data) {
      var user = data.id;
      // todo: get more than 100
      api.getUserPlaylists(user).then(function(data) {
        var playlistsToCheck = data.items.filter(function(playlist) {
          return playlist.owner.id === user
        });

        playlistsListElement.innerHTML = playlistsToCheck.map(function(playlist) {
          return '<li>' + playlist.name + '</li>'
        }).join('');

        playlistsToCheck.forEach(processPlaylist);
      });
    });
  }

  function processPlaylist(playlist) {
    var seen = {};
    setTimeout(function() {
      // todo: paginate through tracks
      api.getGeneric(playlist.tracks.href).then(function(data) {
        data.items.forEach(function(item, index) {
          if (item.track.id !== null) {
            if (item.track.id in seen) {
              resultElement.innerHTML += '<p>Found a duplicate in playlist <strong>' + playlist.name +'</strong>: ' +
              item.track.name + ' by ' + item.track.artists[0].name + '</p>';
              duplicates.push({
                position: index,
                playlist: playlist,
                track: track
              });
            } else {
              seen[item.track.id] = true;
            }
          }
        });
      });
    }, (Math.random() * 3000));
  }
})();
