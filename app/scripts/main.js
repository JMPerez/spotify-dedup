import OAuthManager from './oauth-manager';
import SpotifyWebApi from './api';
import Deduplicator from './deduplicator';
import PromiseThrottle from 'promise-throttle';

import mainCss from '../styles/main.css';
import customCss from '../styles/custom.css';

const promiseThrottle = new PromiseThrottle({ requestsPerSecond: 5 });

let deduplicator;

let token, api;

let app = new Vue({
  el: '#app',
  data: {
    isLoggedIn: false,
    toProcess: 100,
    playlists: []
  },
  methods: {
    removeDuplicates: playlistModel =>
      (async () => {
        if (playlistModel.playlist.id === 'starred') {
          window.alert(
            'It is not possible to delete duplicates from your Starred playlist using this tool since this is not supported in the Spotify Web API. You will need to remove these manually.'
          );
        }
        if (playlistModel.playlist.collaborative) {
          window.alert(
            'It is not possible to delete duplicates from a collaborative playlist using this tool since this is not supported in the Spotify Web API. You will need to remove these manually.'
          );
        } else {
          const duplicates = await deduplicator.removeDuplicates(playlistModel);
          playlistModel.duplicates = [];
          playlistModel.status = 'Duplicates removed';
          if (window.ga) {
            ga('send', 'event', 'spotify-dedup', 'playlist-removed-duplicates');
          }
        }
      })()
  },
  computed: {
    duplicates: function() {
      return this.playlists.reduce(
        (prev, current) => prev + current.duplicates.length,
        0
      );
    }
  }
});

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
      return userOwnedPlaylists;
    });
}

function onPlaylistProcessed(playlist) {
  playlist.processed = true;
  var remaining = app.toProcess - 1;
  app.toProcess -= 1;
  if (remaining === 0 && window.ga) {
    ga('send', 'event', 'spotify-dedup', 'playlists-processed');
  }
}

const playlistToPlaylistModel = playlist => ({
  playlist: playlist,
  duplicates: [],
  status: '',
  processed: false
});

async function onUserDataFetched(data) {
  var user = data.id,
    playlistsToCheck = [];

  const ownedPlaylists = await fetchUserOwnedPlaylists(user);
  playlistsToCheck = ownedPlaylists;
  app.playlists = playlistsToCheck.map(p => playlistToPlaylistModel(p));
  app.toProcess = app.playlists.length;

  app.playlists.forEach(playlistModel =>
    (async () => {
      playlistModel.duplicates = await deduplicator.findDuplicates(
        playlistModel.playlist
      );
      onPlaylistProcessed(playlistModel.playlist);
    })()
  );
}

function onTokenReceived(accessToken) {
  app.isLoggedIn = true;
  api = new SpotifyWebApi();
  api.setAccessToken(accessToken);

  deduplicator = new Deduplicator(api, promiseThrottle);

  promiseThrottle.add(function() {
    return api.getMe().then(data =>
      (async () => {
        await onUserDataFetched(data);
      })()
    );
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
