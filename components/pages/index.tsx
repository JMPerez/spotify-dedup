import Head from 'next/head';
import React from 'react';
import { useTranslation } from 'react-i18next';
import OAuthManager from '../../dedup/oauthManager';
import SpotifyWebApi from '../../dedup/spotifyApi';
import { AvailableLanguages } from '../../i18n';
import Faq from '../faq';
import Features from '../features';
import Footer from '../footer';
import Header from '../head';
import Intro from '../intro';
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
export default class Index extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    isLoggedIn: false,
    user: null,
    accessToken: null,
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

    this.api = new SpotifyWebApi();
    this.api.setAccessToken(accessToken);

    const user = await this.api.getMe();
    this.setState({ isLoggedIn: true, user, accessToken });
  };

  render() {
    return (
      <div style={this.state.isLoggedIn ? {} : { background: "radial-gradient(ellipse 80% 50% at 50% -20%,rgba(120,119,198,0.3),rgba(0,0,0,0))" }}>
        <MetaHead />
        <Header />
        <div className="pb-16">
          {this.state.isLoggedIn ? (
            <div className="max-w-3xl m-auto"><Main
              api={this.api}
              user={this.state.user}
              accessToken={this.state.accessToken}
            /></div>
          ) : (
            <Intro onLoginClick={this.handleLoginClick} />
          )}
        </div>
        {this.state.isLoggedIn
          ? null
          : [<div key={0}>
            <Features />
          </div>,
          <div className="bg-slate-50 py-20" key={1}>
            <Reviews />
          </div>,
          <div className="bg-slate-50" key={1}>
            <Faq />
          </div>,
          ]
        }
        <div className="bg-slate-50">
          <Footer />
        </div>
      </div>
    );
  }
}
