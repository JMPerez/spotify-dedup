import SpotifyAppStats from 'spotify-app-stats';
import Page from '../../layouts/main';
import Header from '../../components/head';
import Head from 'next/head';

import { LineChart } from 'react-chartkick';
import 'chart.js'

import '../../i18n';

function MyChart({ data }) {
  const d = {};
  data.forEach(dat => {
    d[dat.name] = dat.value;
  });
  return (
    <LineChart data={d} />
  );
}

const trimRightZeros = (array, fn) => {
  if (array === null) return array;
  let index = array.length - 1;
  let skipped = 0;
  while (index >= 0) {
    if (fn(array[index]) !== 0) {
      if (skipped === 0) return array;
      return array.slice(0, -skipped);
    }
    skipped++;
    index--;
  }
  return [];
};

export default function Stats({ data }) {
  const maus = trimRightZeros(data.mau, (item) => item.number_of_maus);
  const daus = trimRightZeros(data.dau, (item) => item.number_of_daus);
  const total_requests = trimRightZeros(
    data.total_requests,
    (item) => item.number_of_requests
  );

  return (
    <Page>
      <Head>
        <title>Stats for Spotify Dedup</title>
        <meta name="og:title" content="Stats for Spotify Dedup" />
        <meta name="twitter:title" content="Stats for Spotify Dedup" />
        <meta
          name="description"
          content="Monthly Active Users, Daily Active Users, Number of Requests for Spotify Dedup"
        />
        <meta
          name="og:description"
          content="Monthly Active Users, Daily Active Users, Number of Requests for Spotify Dedup"
        />
        <meta
          name="twitter:description"
          content="Monthly Active Users, Daily Active Users, Number of Requests for Spotify Dedup"
        />
        <meta name="viewport" content="width=device-width" />
      </Head>
      <div className="container">
        <Header />
        {data === null ? null : (
          <div className="row">
            <h1>Stats about Spotify Dedup</h1>
            <p>This page lists shows open data about Spotify Dedup. The metrics are gathered using {' '}
              <a href="https://github.com/JMPerez/spotify-app-stats">
                spotify-app-stats
              </a>, a npm package to read data from a Spotify app in Spotify's developer site dashboard.
            </p>
            <h2>Monthly Active Users (MAU)</h2>
            <p>
              The most recent value for MAU is{' '}
              <strong>
                {Intl.NumberFormat('en-US').format(
                  maus[maus.length - 1].number_of_maus
                )}
              </strong>{' '}
              users
            </p>
            <MyChart
              data={maus.map((a) => ({
                name: a.date,
                value: a.number_of_maus,
              }))}
            />
            <h2>Daily Active Users (DAU)</h2>
            <p>This chart shows how many users are logging in on Spotify Dedup with their Spotify accounts every day. The most recent value for DAU is{' '}
              <strong>
                {Intl.NumberFormat('en-US').format(
                  daus[daus.length - 1].number_of_daus
                )}
              </strong>.
            </p>
            <MyChart
              data={daus.map((a) => ({
                name: a.date,
                value: a.number_of_daus,
              }))}
            />
            <h2>Number of Requests</h2>
            <p>This chart shows how many requests to the Spotify Web API are made to read the list of playlists ans saved songs, get the list of songs in a playlist, and remove duplicates. The most recent value is{' '}
            <strong>
                {Intl.NumberFormat('en-US').format(
                  total_requests[total_requests.length - 1].number_of_requests
                )}
              </strong>.
            </p>
            <MyChart
              data={total_requests.map((a) => ({
                name: a.date,
                value: a.number_of_requests,
              }))}
            />
          </div>
        )}
      </div>
      <style jsx>
        {`
          h2 {
            padding-top: 1em;
          }
          .row {
            padding-right: 15px;
            padding-left: 15px;
          }
      `}
      </style>
    </Page>
  );
}

export async function getStaticProps() {
  let data = null;
  if (
    process.env.SPOTIFY_USERNAME &&
    process.env.SPOTIFY_PASSWORD &&
    process.env.SPOTIFY_APP_ID
  ) {
    const spotifyAppStats = new SpotifyAppStats();
    await spotifyAppStats.init();
    await spotifyAppStats.login(
      process.env.SPOTIFY_USERNAME,
      process.env.SPOTIFY_PASSWORD
    );
    data = await spotifyAppStats.getStats(process.env.SPOTIFY_APP_ID);
    spotifyAppStats.destroy();
  }
  return {
    props: {
      data,
    },
  };
}
