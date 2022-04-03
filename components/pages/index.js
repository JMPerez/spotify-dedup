import i18n, { AvailableLanguages } from '../../i18n';

import Features from '../features';
import Footer from '../footer';
import Head from 'next/head';
import Header from '../head';
import Intro from '../intro';
import LanguageSelector from '../languageSelector';
import Main from '../main';
import OAuthManager from '../../dedup/oauthManager';
import React from 'react';
import Reviews from '../reviews';
import SpotifyWebApi from '../../dedup/spotifyApi';
import { useTranslation } from 'react-i18next';

const MetaHead = () => {
  const { t, i18n } = useTranslation();
  return (
    <Head>
      <title>{t('meta.title')}</title>
      <meta property="og:title" content={t('meta.title')} />
      <meta name="twitter:title" content={t('meta.title')} />
      <meta name="description" content={t('meta.description')} />
      <meta property="og:description" content={t('meta.description')} />
      <meta name="twitter:description" content={t('meta.description')} />
      <meta name="viewport" content="width=device-width" />
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
export default class Index extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    isLoggedIn: false,
    user: null,
  };
  api = null;

  handleLoginClick = async () => {
    const accessToken = await OAuthManager.obtainToken({
      scopes: [
        /*
            the permission for reading public playlists is granted
            automatically when obtaining an access token through
            the user login form
            */
        'playlist-read-private',
        'playlist-read-collaborative',
        'playlist-modify-public',
        'playlist-modify-private',
        'user-library-read',
        'user-library-modify',
      ],
    }).catch(function (error) {
      console.error('There was an error obtaining the token', error);
    });

    if (global['ga']) {
      global['ga']('send', 'event', 'spotify-dedup', 'user-logged-in');
    }

    Index.api = new SpotifyWebApi();
    Index.api.setAccessToken(accessToken);

    const user = await Index.api.getMe();
    this.setState({ isLoggedIn: true, user, accessToken });
  };

  render() {
    return (
      <div className="container">
        <MetaHead />
        <Header />

        {this.state.isLoggedIn ? (
          <Main
            api={Index.api}
            user={this.state.user}
            accessToken={this.state.accessToken}
          />
        ) : (
          <Intro onLoginClick={this.handleLoginClick} />
        )}
        {this.state.isLoggedIn
          ? null
          : [<Features key={0} />, <Reviews key={1} />]}
        <Footer />
        <LanguageSelector />
      </div>
    );
  }
}
