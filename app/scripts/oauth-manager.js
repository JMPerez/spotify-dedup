/*global Promise, OAuthConfig*/
/*exported OAuthManager*/

var OAuthManager = (function() {
    'use strict';

    function toQueryString(obj) {
        var parts = [];
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                parts.push(encodeURIComponent(i) +
                    '=' +
                    encodeURIComponent(obj[i]));
            }
        }
        return parts.join('&');
    }

    function obtainToken(options) {
        options = options || {};

        var promise = new Promise(function(resolve, reject) {

            var authWindow = null,
                pollAuthWindowClosed = null;

            function receiveMessage(event) {
                clearInterval(pollAuthWindowClosed);
                if (event.origin !== OAuthConfig.host) {
                    reject();
                    return;
                }
                if (authWindow !== null) {
                    authWindow.close();
                    authWindow = null;
                }

                window.removeEventListener('message',
                    receiveMessage,
                    false);

                // todo: manage case when the user rejects the oauth
                // or the oauth fails to obtain a token
                resolve(event.data);
            }

            window.addEventListener('message',
                receiveMessage,
                false);

            var width = 400,
                height = 600,
                left = (screen.width / 2) - (width / 2),
                top = (screen.height / 2) - (height / 2);

            /*jshint camelcase:false*/
            var params = {
                client_id: OAuthConfig.clientId,
                redirect_uri: OAuthConfig.redirectUri,
                response_type: 'token'
            };

            if (options.scopes) {
                params.scope = options.scopes.join(' ');
            }

            authWindow = window.open(
                'https://accounts.spotify.com/authorize?' + toQueryString(params),
                'Spotify',
                'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
            );

            pollAuthWindowClosed = setInterval(function() {
                if (authWindow !== null) {
                    if (authWindow.closed) {
                        clearInterval(pollAuthWindowClosed);
                        reject({message: 'access_denied'});
                    }
                }
            }, 1000);

        });

        return promise;
    }

    return {
        obtainToken: obtainToken
    };

})();
