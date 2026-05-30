# Spotify Deduplicator
A quick and easy way of tidying up your Spotify playlists.

[![Greenkeeper badge](https://badges.greenkeeper.io/JMPerez/spotify-dedup.svg)](https://greenkeeper.io/)
[![GitHub issues](https://img.shields.io/github/issues/JMPerez/spotify-dedup)](https://github.com/JMPerez/spotify-dedup/issues)

## Table of Contents
## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Usage](#usage)
4. [Installation](#installation)
   - [Using pnpm (recommended)](#using-pnpm-recommended)
   - [Using npm or yarn](#using-npm-or-yarn)
5. [Testing](#testing)
6. [About the Tools Used](#about-the-tools-used-and-implementation-details)
   - [Spotify Web API and Promises](#spotify-web-api-and-promises)
7. [Contributing](#contributing)
8. [License](#license)


## Introduction
Have you ever wanted to remove duplicated songs from your Spotify library? Now you can find and remove them using Spotify Dedup. Spotify Deduplicator is a simple and effective tool for cleaning up your Spotify library. Just log in and it will traverse your playlists, finding duplicate songs. It uses the [Spotify Web API](https://developer.spotify.com/web-api/) to identify songs that appear multiple times in a given playlist. With the press of a button, you can remove duplicate tracks from your playlists and liked songs. It saves time and effort by avoiding the need to manually check for duplicate entries, which can be especially useful for users with large music libraries. No playlists are re-created, ensuring all metadata like creation dates and followers are preserved.

## Features
- **Automatic Duplicate Detection**: Finds duplicate tracks in playlists and liked songs.
- **Detect all duplicate**: Finds duplicates that Spotify does not detect by comparing ID, title, artist, and duration similarity.
- **Playlist Integrity**: Removes duplicates without creating new playlists, retaining original creation dates and follower counts.
- **Save Time and Effort**: No more manually searching for duplicates. Spotify Deduplicator scans your entire library efficiently.
- **Cross-Platform**: Works directly in your browser or can be run locally.

## Usage

Here is a quick guide on how to use Spotify-Dedup:
1. Visit the website on [https://spotify-dedup.com](https://spotify-dedup.com) (or your local version).
2. Login with your Spotify account. The website will remember previous spotify logins if you use this tool multiple times without clearing your browsers cache.
3. Once logged in, your playlists and liked songs will automatically be scanned for duplicate songs.
4. Review detected duplicates for each playlist.
5. Remove all duplicates in one playlist by clicking the removal button. The first instance of each song will stay in your playlist.


###Scan results
![image](https://github.com/user-attachments/assets/291641a6-49f3-40b7-924e-f59b6ae5c518)

###After deduping
![image](https://github.com/user-attachments/assets/4e4a6f82-cb39-449f-a39b-6f2f7519e03d)


If you have further questions, check the ["Frequently asked questions"-section on the website](https://spotify-dedup.com/).

## Installation

### Using pnpm (recommended)

Using pnpm is recommended for installing this project. pnpm can easily be installed with npm. If you don't have npm installed, check out the [installation guide](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) for NPM.

To install the project, ensure you have **pnpm** installed. If you don't have it, install it using the following command:

    npm install -g pnpm

Now, clone the repository and install dependencies::
    
    git clone https://github.com/JMPerez/spotify-dedup.git
    cd spotify-dedup
    pnpm install
    
Run it locally:

    pnpm dev

Then, open your browser and navigate to http://localhost:3000.

### Using npm or yarn:

Instructions for npm or yarn can be found on their respective websites. The basic steps are similar to using pnpm.

## Testing

In order to test saved tracks, create duplicated tracks by executing the Web API request on https://developer.spotify.com/console/put-current-user-saved-tracks/?ids=2JZfTvWWtpaE8NohqRXqFr,1poUtf2dDdVUtWL8tn03Wd,6ADSaE87h8Y3lccZlBJdXH,2x45xqISlmmDJqxOqr8BuS,1iQ1BpOGF1Umd3lpTV4OPO.

## About the tools used and implementation details

### Spotify Web API and Promises

This app is a good example of how to traverse a user's library without incurring in rate limit. Have a look at the code and see how Promises and a Promise Queue are used to control the amount of requests sent to the Spotify Web API. If you are interested in throttling promises, check out [promise-throttle](https://github.com/JMPerez/promise-throttle).

## Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit and push your changes (`git commit -m "Add feature"`).
5. Open a pull request.

For larger changes, it is recommended to open an issue first to discuss your ideas.

## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) for details.
