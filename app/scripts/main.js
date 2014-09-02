/*global ko, PromiseThrottle, SpotifyWebApi, OAuthManager, Promise */

(function() {
    'use strict';

    var token,
        api,
        model;

    function PlaylistModel(playlist) {
        this.playlist = playlist;
        this.duplicates = ko.observableArray([]);
        var self = this;
        this.removeDuplicates = function() {
            PromiseThrottle.registerPromise(function() {
                return api.removeTracksFromPlaylist(
                    self.playlist.owner.id,
                    self.playlist.id,
                    self.duplicates().map(function(d) {
                        return {
                            uri: d.track.uri,
                            positions: [d.index]
                        };
                    })
                ).then(function() {
                    self.duplicates([]);
                    self.status('Duplicates removed');
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

    function onTokenReceived(accessToken) {
        model.isLoggedIn(true);
        token = accessToken;

        api = new SpotifyWebApi();
        api.setAccessToken(token);

        PromiseThrottle.registerPromise(function() {
            return api.getMe().then(function(data) {
                var user = data.id;
                PromiseThrottle.registerPromise(function() {
                    return api.getUserPlaylists(user).then(function(data) {
                        // do we have more?
                        var playlistsToCheck = data.items.filter(function(playlist) {
                            return playlist.owner.id === user;
                        });

                        model.playlists(playlistsToCheck.map(function(p) {
                            return new PlaylistModel(p);
                        }));

                        model.toProcess(model.playlists().length);
                        model.playlists().forEach(processPlaylist);
                    });
                });
            });
        });
    }

    function processPlaylist(playlist) {
        var seen = {};
        PromiseThrottle.registerPromise(function() {
            return promisesForPages(api.getGeneric(playlist.playlist.tracks.href))
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
                    playlist.processed(true);
                    model.toProcess(model.toProcess() - 1);
                }).catch (function() {
                    playlist.processed(true);
                    model.toProcess(model.toProcess() - 1);
                });

        });
    }

    function promisesForPages(promise) {
        // todo: go through throttle
        return new Promise(function(resolve, reject) {
            promise.then(function(results) {
                var promises = [promise],                       // add the initial page
                    offset = results.limit + results.offset,    // start from the second page
                    limit = results.limit;
                while (results.total > offset) {
                    promises.push(api.getGeneric(results.href + '?offset=' + offset + '&limit=' + limit));
                    offset += limit;
                }
                resolve(promises);
            }).catch(function() {
                reject([]);
            });
        });
    }
})();
