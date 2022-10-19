import 'chartkick/chart.js';
import '../i18n';

import { BarChart, LineChart } from 'react-chartkick';

import Head from 'next/head';
import Header from '../components/head';
import Page from '../layouts/main';
import { SpotifyAppData } from '../lib/types';
import fetcher from '../lib/fetcher';
import useSWR from 'swr';
import { useState } from 'react';

function MyChart({ data }) {
  const d = {};
  data.forEach((dat) => {
    d[dat.name] = dat.value;
  });
  return <LineChart data={d} thousands="," />;
}


const LocationChart = ({ data }) => {
  const [expanded, setExpanded] = useState(false);

  if (expanded && data.length > 20) {
    return (
      <>
        <h2>Users by Location</h2>
        <BarChart data={data} height={`${data.length * 20}px`} />
      </>
    );
  } else {
    return (
      <>
        <h2>Users by Location (Top 20 countries/territories)</h2>
        <BarChart data={data.slice(0, 20)} height={`${20 * 20}px`} />
        <button onClick={() => setExpanded(true)}>See all locations</button>
      </>
    );
  }
};

const getLocationData = (data: SpotifyAppData) => data.map_data.locations.map((location) => [
  location.country_code,
  location.number_of_users,
]);

export default function Stats() {
  const { data } = useSWR<SpotifyAppData>('/api/data', fetcher);
  if (data?.error) {
    return <div>Stats not available</div>;
  }

  return (
    <Page>
      <Head>
        <title>Stats for Spotify Dedup</title>
        <meta name="og:title" content="Stats for Spotify Dedup" />
        <meta name="twitter:title" content="Stats for Spotify Dedup" />
        <meta
          name="description"
          content="Open stats about Spotify Dedup. Monthly Active Users, Daily Active Users, and Number of Requests."
        />
        <meta
          name="og:description"
          content="Open stats about Spotify Dedup. Monthly Active Users, Daily Active Users, and Number of Requests."
        />
        <meta
          name="twitter:description"
          content="Open stats about Spotify Dedup. Monthly Active Users, Daily Active Users, and Number of Requests."
        />
        <meta name="viewport" content="width=device-width" />
      </Head>
      <div className="container">
        <Header />
        <div className="row">
          <h1>Stats about Spotify Dedup</h1>
          <p>
            This page shows open data about Spotify Dedup. The metrics are
            gathered using{' '}
            <a href="https://github.com/JMPerez/spotify-app-stats">
              spotify-app-stats
            </a>
            , a npm package to read data from a Spotify app in Spotify&apos;s
            developer site dashboard.
          </p>
          <h2>Monthly Active Users (MAU)</h2>
          {data ?
            <><p>
              The most recent value for MAU is{' '}
              <strong>
                {Intl.NumberFormat('en-US').format(
                  data.mau[data.mau.length - 1].number_of_maus
                )}
              </strong>{' '}
              users
            </p>
              <MyChart
                data={data.mau.map((a) => ({
                  name: a.date,
                  value: a.number_of_maus,
                }))}
              /> </> : <p>Loading...</p>}
          <h2>Daily Active Users (DAU)</h2>
          {data ?
            <><p>
              This chart shows how many users are logging in on Spotify Dedup
              with their Spotify accounts every day. The most recent value for
              DAU is{' '}
              <strong>
                {Intl.NumberFormat('en-US').format(
                  data.dau[data.dau.length - 1].number_of_daus
                )}
              </strong>
              .
            </p>
              <MyChart
                data={data.dau.map((a) => ({
                  name: a.date,
                  value: a.number_of_daus,
                }))}
              /> </> : <p>Loading...</p>}
          {data &&
            <LocationChart data={getLocationData(data)} />}
          <h2>Number of Requests</h2>
          {data ?
            <><p>
              This chart shows how many requests to the Spotify Web API are made
              to read the list of playlists and saved songs, get the list of
              songs in a playlist, and remove duplicates. The most recent value
              is{' '}
              <strong>
                {Intl.NumberFormat('en-US').format(
                  data.total_requests[data.total_requests.length - 1].number_of_requests
                )}
              </strong>
              .
            </p>
              <MyChart
                data={data.total_requests.map((a) => ({
                  name: a.date,
                  value: a.number_of_requests,
                }))}
              /> </> : <p>Loading...</p>}
        </div>
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

// SSG can't be used here. Trying to use it will
// trigger an error on Vercel
// Error: Failed to launch the browser process! spawn /usr/bin/google-chrome ENOENT
