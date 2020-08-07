import React, { Component } from 'react';
import { useTranslation } from 'react-i18next';

export default () => {
  const { t } = useTranslation();
  return (
    <div className="header">
      <ul className="nav nav-pills">
        <li>
          <a href="/spotify-dedup/">{t('menu.link-home')}</a>
        </li>
        <li>
          <a href="/spotify-dedup/stats">Stats</a>
        </li>
      </ul>
      <h3 className="text-muted">Spotify dedup</h3>
      <style jsx>
        {`
          .header {
            padding-left: 15px;
            padding-right: 15px;
          }
          @media (min-width: 768px) {
            .header {
              padding-left: 0px;
              padding-right: 0px;
            }
          }

          .nav {
            padding-left: 0;
            margin-bottom: 0;
            list-style: none;
          }
          .nav-pills > li {
            float: left;
          }
          .nav > li {
            position: relative;
            display: block;
          }
          .nav > li > a {
            position: relative;
            display: block;
            padding: 10px 15px;
          }
          h3 {
            font-size: 24px;
            margin-top: 0;
            margin-bottom: 0;
            line-height: 40px;
            padding-bottom: 19px;
          }
          .text-muted {
            color: #949494;
          }
          ul {
            float: right;
            margin: 0;
            padding: 0;
          }
        `}
      </style>
    </div>
  );
};
