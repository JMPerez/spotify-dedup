/*
https://github.com/sprjr/react-localize
https://stackoverflow.com/questions/45911868/using-react-context-for-internationalization
https://github.com/leefreemanxyz/react-context-multilingual
https://itnext.io/using-reacts-context-api-to-provide-a-localization-toolbox-for-your-components-48915f04bb54
*/
import React from 'react';
import Head from 'next/head';
import Header from '../head';
import Footer from '../footer';
import Intro from '../intro';
import Main from '../main';
import Features from '../features';
import Reviews from '../reviews';
import LanguageSelector from '../language-selector';

import OAuthManager from '../../dedup/oauth-manager';
import SpotifyWebApi from '../../dedup/spotify-api';
import { useTranslation } from 'react-i18next';

import i18n, { AvailableLanguages } from '../../i18n';

const MetaHead = () => {
  const { t, i18n } = useTranslation();
  return (
    <Head>
      <title>{t('meta.title')}</title>
      <meta name="og:title" content={t('meta.title')} />
      <meta name="twitter:title" content={t('meta.title')} />
      <meta name="description" content={t('meta.description')} />
      <meta name="og:description" content={t('meta.description')} />
      <meta name="twitter:description" content={t('meta.description')} />
      <meta name="viewport" content="width=device-width" />
      <link rel="canonical" href="https://jmperezperez.com/spotify-dedup/" />
      {AvailableLanguages.filter(language => language !== i18n.language).map(
        language => (
          <link
            key={language}
            rel="alternate"
            hrefLang={language}
            href={
              language === 'en'
                ? 'https://jmperezperez.com/spotify-dedup/'
                : `https://jmperezperez.com/spotify-dedup/${language}/`
            }
          ></link>
        )
      )}
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
    }).catch(function(error) {
      console.error('There was an error obtaining the token', error);
    });

    if (global['ga']) {
      global['ga']('send', 'event', 'spotify-dedup', 'user-logged-in');
    }
    if (global['fbq']) {
      global['fbq']('track', 'dedup-user-logged-in');
    }

    Index.api = new SpotifyWebApi();
    Index.api.setAccessToken(accessToken);

    const user = await Index.api.getMe();

    this.setState({ isLoggedIn: true, user });
  };

  render() {
    return (
      <div className="container">
        <MetaHead />
        <Header />

        {this.state.isLoggedIn ? (
          <Main api={Index.api} user={this.state.user} />
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
