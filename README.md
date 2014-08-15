A Spotify Playlist Duplicator
=============================

Have you ever wanted to remove duplicated tracks from your Spotify Playlists?
Now you can detect and remove them using Spotify dedup.

This project uses the [Spotify Web API](https://developer.spotify.com/web-api/) for managing playlists. Just log in and it will traverse your playlists, finding tracks
that appear multiple times with the same identifier in a given playlist.

If it finds duplicates, they can be removed just pushing a button.

Check it out on [http://jmperezperez.com/spotify-dedup/](http://jmperezperez.com/spotify-dedup/) or run it locally.

Install the dependencies:

    npm install
    bower install

Run it:

    grunt serve

## TODO

- Process more than one page of playlists
- Process more than one page of a playlist's tracks
- Better management of OAuth errors
- Improve style
