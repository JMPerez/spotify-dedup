import React from 'react';
import { useTranslation } from 'react-i18next';

const Reviews = () => {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <p className="header">{t('reviews.title')}</p>
      <ul className="quotes">
        <li>
          <blockquote>
            I just discovered your @Spotify dedup web app & it is awesome!!!
            Recommend to all #Spotify users! –
            <a href="https://twitter.com/VanKenton">@VanKenton</a>
          </blockquote>
        </li>
        <li>
          <blockquote>
            @jmperezperez I've been using your spotify dedup code for years.
            Today, I finally decided to check out your other stuff. Amazing! I
            can't believe it took me this long to discover it –
            <a href="https://twitter.com/wormx">@wormx</a>
          </blockquote>
        </li>
        <li>
          <blockquote>
            Thanks for the Spotify De-Dup! Very helpful and extremely easy to
            use. – <a href="https://www.buymeacoffee.com/jmp">PTR</a>
          </blockquote>
        </li>
      </ul>
      <style jsx>
        {`
          .header {
            font-weight: bold;
            font-size: 2rem;
            margin-top: 2rem;
            line-height: 1.1;
            text-align: center;
          }
          .quotes {
            list-style: none;
          }

          ul {
            padding: 0;
          }
          blockquote {
            background: var(--card-bg-color);
            border-left: 10px solid var(--accent-color);
            margin: 1.5em 10px;
            padding: 0.5em 10px;
          }

          blockquote p {
            display: inline;
          }
        `}
      </style>
    </div>
  );
};

export default Reviews;
