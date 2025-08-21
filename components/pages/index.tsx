import SpotifyWebApi, { SpotifyCurrentUser } from '../../dedup/spotifyApi';

import { AvailableLanguages } from '@/languages';
import { obtainToken } from '@/src/auth/oauth2window';
import { logEvent } from '@/utils/analytics';
import Head from 'next/head';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Faq from '../faq';
import Features from '../features';
import Header from '../head';
import Intro from '../intro';
import MatchingSettings from '../matchingSettings';
import Main from '../main';
import Reviews from '../reviews';

const MetaHead = () => {
  const { t, i18n } = useTranslation();
  return (
    <Head>
      <title>{t('meta.title')}</title>
      <meta property="og:title" content={t('meta.title')} />
      <meta name="twitter:title" content={t('meta.title')} />
      <meta name="description" content={t('meta.description')} />
      <meta property="og:description" content={t('meta.description')} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@jmperezperez" />
      <meta name="viewport" content="width=device-width" />
      <meta property="og:image" content="https://spotify-dedup.com/spotify-dedup-meta.png" />
      <link
        rel="canonical"
        href={
          i18n.language === 'en'
            ? 'https://spotify-dedup.com/'
            : `https://spotify-dedup.com/${i18n.language}`
        }
      />
      <meta
        property="og:url"
        content={
          i18n.language === 'en'
            ? 'https://spotify-dedup.com/'
            : `https://spotify-dedup.com/${i18n.language}`
        }
      />
      <meta property="og:type" content="website" />
      {AvailableLanguages.map(
        (language) => (
          <link
            key={language}
            rel="alternate"
            hrefLang={language}
            href={
              language === 'en'
                ? 'https://spotify-dedup.com/'
                : `https://spotify-dedup.com/${language}`
            }
          ></link>
        )
      )}
      <link rel="alternate" hrefLang="x-default" href="https://spotify-dedup.com/" />
      <link rel="icon" href="https://spotify-dedup.com/logo.svg" />
    </Head>
  );
};

export default function Index() {
  const [state, setState] = React.useState({
    isLoggedIn: false,
    user: null as SpotifyCurrentUser | null,
    accessToken: null as string | null,
  });

  // UI settings (seconds in UI, convert later when used)
  const [settings, setSettings] = React.useState({
    enableNameAndArtistMatching: true,
    durationThresholdSec: 2,
  });

  const apiRef = React.useRef<SpotifyWebApi | null>(null);

  const handleLoginClick = async () => {
    let accessToken: string | null = null;
    try {
      accessToken = await obtainToken({
        scopes: [
          'playlist-read-private',
          'playlist-read-collaborative',
          'playlist-modify-public',
          'playlist-modify-private',
          'user-library-read',
          'user-library-modify',
        ],
      });
    } catch (error) {
      console.error(error);
      logEvent('user_authentication_failed', { message: error });
      alert('There was an issue logging in. Please try again.');
    }

    if (accessToken !== null) {
      apiRef.current = new SpotifyWebApi();
      apiRef.current.setAccessToken(accessToken as string);

      const user = await apiRef.current.getMe();
      logEvent('user_logged_in');
      setState({ isLoggedIn: true, user, accessToken });
    }
  };

  React.useEffect(() => {
    const handleTokenRefresh = (event: CustomEvent) => {
      if (apiRef.current) {
        apiRef.current.setAccessToken(event.detail.accessToken);
        setState(prev => ({ ...prev, accessToken: event.detail.accessToken }));
      }
    };

    window.addEventListener('spotify_token_refreshed', handleTokenRefresh as EventListener);

    return () => {
      window.removeEventListener('spotify_token_refreshed', handleTokenRefresh as EventListener);
    };
  }, []);

  return (
    <div
      style={state.isLoggedIn ? {} : { background: "radial-gradient(ellipse 80% 50% at 50% -20%,rgba(120,119,198,0.3),rgba(0,0,0,0))" }}
      className="flex h-full flex-col"
    >
      <MetaHead />
      <Header />
      <div className="flex-1">
        <div className="pb-16 mx-6">
          {state.isLoggedIn && state.user !== null && state.accessToken !== null ? (
            <div className="max-w-3xl m-auto">
              <Main
                api={apiRef.current}
                user={state.user}
                accessToken={state.accessToken}
                matchingSettings={{
                  enableNameAndArtistMatching: settings.enableNameAndArtistMatching,
                  durationThresholdMs: Math.max(0, Math.round((settings.durationThresholdSec || 0) * 1000)),
                }}
              />
            </div>
          ) : (
            <>
              <Intro onLoginClick={handleLoginClick} />
              <MatchingSettings
                enableNameAndArtistMatching={settings.enableNameAndArtistMatching}
                durationThresholdSec={settings.durationThresholdSec}
                onChange={(update) => setSettings((prev) => ({ ...prev, ...update }))}
              />
            </>
          )}
        </div>
        {state.isLoggedIn
          ? null
          : [
            <div key={0}>
              <Features />
            </div>,
            <div className="bg-slate-50" key={1}>
              <Reviews />
            </div>,
            <div className="bg-slate-50" key={2}>
              <Faq />
            </div>,
          ]
        }
      </div>
    </div>
  );
}
