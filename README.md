# Spotify Deduplicator

[![Greenkeeper badge](https://badges.greenkeeper.io/JMPerez/spotify-dedup.svg)](https://greenkeeper.io/)

Have you ever wanted to remove duplicated songs from your Spotify library? Now you can find and remove them using Spotify Dedup.

This project uses the [Spotify Web API](https://developer.spotify.com/web-api/) for managing playlists. Just log in and it will traverse your playlists, finding songs that appear multiple times with the same identifier (Spotify URI) in a given playlist.

If it finds duplicates, they can be removed just pushing a button. And since it doesn't create a whole new playlist, it keeps all the information like creation date and subscribers.

## Try it

You can check it out on [https://spotify-dedup.com](https://spotify-dedup.com) or run it locally.

## Install and run

Install the dependencies:

    pnpm install

Run it:

    pnpm dev

Then open http://localhost:3000 in a browser

## Testing

In order to test saved tracks, create duplicated tracks by executing the Web API request on https://developer.spotify.com/console/put-current-user-saved-tracks/?ids=2JZfTvWWtpaE8NohqRXqFr,1poUtf2dDdVUtWL8tn03Wd,6ADSaE87h8Y3lccZlBJdXH,2x45xqISlmmDJqxOqr8BuS,1iQ1BpOGF1Umd3lpTV4OPO.

## About the tools used and implementation details

### Spotify Web API and Promises

This app is a good example of how to traverse a user's library without incurring in rate limit. Have a look at the code and see how Promises and a Promise Queue are used to control the amount of requests sent to the Spotify Web API. If you are interested in throttling promises, check out [promise-throttle](https://github.com/JMPerez/promise-throttle).
