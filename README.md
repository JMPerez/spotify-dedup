# Spotify Deduplicator

Have you ever wanted to remove duplicated songs from your Spotify library? Now you can find and remove them using Spotify Dedup.

This project uses the [Spotify Web API](https://developer.spotify.com/web-api/) for managing playlists. Just log in and it will traverse your playlists, finding songs that appear multiple times with the same identifier (Spotify URI) in a given playlist.

If it finds duplicates, they can be removed just pushing a button. And since it doesn't create a whole new playlist, it keeps all the information like creation date and subscribers.

## Try it

You can check it out on [https://jmperezperez.com/spotify-dedup/](https://jmperezperez.com/spotify-dedup/) or run it locally.

## Install and run

Install the dependencies:

    npm install

Run it:

    npm start

Then open http://localhost:8005/index.html in a browser

## About the tools used and implementation details

### Spotify Web API and Promises

This app is a good example of how to traverse a user's library without incurring in rate limit. Have a look at the code and see how Promises and a Promise Queue are used to control the amount of requests sent to the Spotify Web API. If you are interested in throttling promises, check out [promise-throttle](https://github.com/JMPerez/promise-throttle).
