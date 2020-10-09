import React, { Component } from 'react';
import { useTranslation } from 'react-i18next';

const Features = () => {
  const { t, i18n } = useTranslation();
  return (
    <div className="row marketing cols-3">
      <div>
        <h4>{t('features.find-remove.header')}</h4>
        <p
          dangerouslySetInnerHTML={{
            __html: t('features.find-remove.body', {
              strongOpen: '<strong>',
              strongClose: '</strong>',
            }),
          }}
        />
      </div>
      <div>
        <h4>{t('features.safer.header')}</h4>
        <p
          dangerouslySetInnerHTML={{
            __html: t('features.safer.body', {
              strongOpen: '<strong>',
              strongClose: '</strong>',
            }),
          }}
        />
      </div>
      <div>
        <h4>{t('features.open-source.header')}</h4>
        <p
          dangerouslySetInnerHTML={{
            __html: t('features.open-source.body', {
              linkGithubOpen:
                '<strong><a href="https://github.com/JMPerez/spotify-dedup/">',
              linkGithubClose: '</a></strong>',
              linkWebApiOpen:
                '<a href="https://developer.spotify.com/web-api/">',
              linkWebApiClose: '</a>',
            }),
          }}
        />
      </div>
      <style jsx>
        {`
          .row {
            margin-right: -15px;
            margin-left: -15px;
          }
          .marketing {
            padding-left: 15px;
            padding-right: 15px;
          }
          .row:after,
          .row:before {
            display: table;
            content: ' ';
          }
          .row:after {
            clear: both;
          }
          h4 {
            font-size: 18px;
            line-height: 1.1;
            margin-top: 10px;
            margin-bottom: 10px;
          }
          .cols-3 > div {
            flex: 1;
            padding-right: 15px;
            padding-left: 15px;
            padding-bottom: 4px;
          }
          @media (min-width: 768px) {
            .cols-3 {
              display: flex;
              flex-wrap: wrap;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Features;
