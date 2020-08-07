import SpotifyAppStats from 'spotify-app-stats';
import Page from '../../layouts/main';
import Header from '../../components/head';
import Head from 'next/head';

import { VictoryChart, VictoryLine, VictoryAxis } from 'victory';

import '../../i18n';

function MyChart({ data }) {
  return (
    <VictoryChart>
      <VictoryAxis
        fixLabelOverlap
        style={{ tickLabels: { padding: 10, fontSize: 12 } }}
      />
      <VictoryAxis
        dependentAxis
        style={{ tickLabels: { padding: 10, fontSize: 12 } }}
      />
      <VictoryLine
        style={{
          data: { stroke: '#c43a31' },
          parent: { border: '1px solid #ccc' },
        }}
        data={data}
        x="name"
        y="value"
      />
    </VictoryChart>
  );
}

export default function Stats({ data }) {
  const mau =
    data.mau[data.mau.length - 1].number_of_maus ??
    data.mau[data.mau.length - 2].number_of_maus;

  const dau =
    data.dau[data.dau.length - 1].number_of_daus ??
    data.dau[data.dau.length - 2].number_of_daus;
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
          <div>
            <h1>Stats about Spotify Dedup</h1>
            <p>
              Data reported by Spotify. Fetched using{' '}
              <a href="https://github.com/JMPerez/spotify-app-stats">
                spotify-app-stats
              </a>
              .
            </p>
            <h2>Monthly Active Users (MAU)</h2>
            <p>
              The most recent value for MAU is{' '}
              <strong>{Intl.NumberFormat('en-US').format(mau)}</strong> users
            </p>
            <MyChart
              data={data.mau.map((a) => ({
                name: a.date,
                value: a.number_of_maus,
              }))}
            />
            <h2>Daily Active Users (DAU)</h2>
            <p>
              The most recent value for DAU is{' '}
              <strong>{Intl.NumberFormat('en-US').format(dau)}</strong> users
            </p>
            <MyChart
              data={data.dau.map((a) => ({
                name: a.date,
                value: a.number_of_daus,
              }))}
            />
            <h2>Number of Requests</h2>
            <MyChart
              data={data.total_requests.map((a) => ({
                name: a.date,
                value: a.number_of_requests,
              }))}
            />
          </div>
        )}
      </div>
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
