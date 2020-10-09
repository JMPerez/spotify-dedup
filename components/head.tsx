import React, { Component } from 'react';
import { useTranslation } from 'react-i18next';

const Head = () => {
  const { t } = useTranslation();
  return (
    <div className="header">
      <ul className="nav nav-pills">
        <li>
          <a href="/">{t('menu.link-home')}</a>
        </li>
        <li>
          <a href="/stats">Stats</a>
        </li>
      </ul>
      <h3>
        <img src="data:image/svg+xml,%3Csvg viewBox='0 0 211 169' width='211' height='169' fill='none' preserveAspectRatio='xMidYMin slice' xmlns='http://www.w3.org/2000/svg'%0A%3E%3Cpath d='M207.475 79.414c3.756 2.35 3.756 7.821 0 10.172L82.284 167.952c-3.997 2.501-9.184-.371-9.184-5.086V6.134c0-4.715 5.188-7.587 9.184-5.086l125.191 78.366z' fill='%2393B2C6' /%3E%3Cpath d='M134.475 79.414c3.756 2.35 3.756 7.821 0 10.172L9.284 167.952C5.287 170.453.1 167.581.1 162.866V6.134c0-4.715 5.187-7.587 9.184-5.086l125.191 78.366z' fill='%23325972' /%3E%3C/svg%3E" />
        <span className="text">Spotify Dedup</span>
      </h3>
      <style jsx>
        {`
          .header {
            padding-left: 15px;
            padding-right: 15px;
            padding-bottom: 20px;
            display: flex;
            align-items: center;
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
            display: flex;
            flex-shrink: 0;
            flex-grow: 1;
            color: #325972;
          }
          @media (prefers-color-scheme: dark) {
            h3 {
              color: #93b2c6;
            }
          }
          @media (max-width: 600px) {
            .text {
              display: none;
            }
          }
          ul {
            float: right;
            margin: 0;
            padding: 0;
            order: 1;
          }
          img {
            width: 50px;
            height: 40px;
            margin: 0 10px;
          }
        `}
      </style>
    </div>
  );
};

export default Head;
