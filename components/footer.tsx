import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <div className="footer">
      <p>
        <span
          dangerouslySetInnerHTML={{
            __html: t('footer.author', {
              linkOpen:
                '<a target="_blank" rel="noreferrer" href="https://jmperezperez.com">',
              linkClose: '</a>',
            }),
          }}
        />{' '}
        ·{' '}
        <span
          dangerouslySetInnerHTML={{
            __html: t('footer.github', {
              linkOpen:
                '<a target="_blank" rel="noreferrer" href="https://github.com/JMPerez/spotify-dedup/">',
              linkClose: '</a>',
            }),
          }}
        />
        ·{' '}
        <span
          dangerouslySetInnerHTML={{
            __html: t('footer.bmc', {
              linkOpen:
                '<a target="_blank" rel="noreferrer" href="https://www.buymeacoffee.com/jmp">',
              linkClose: '</a>',
            }),
          }}
        />
        · Check{' '}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://spotify-top.com"
          style={{ whiteSpace: 'nowrap' }}
        >
          Spotify Top
        </a>
      </p>
      <style jsx>
        {`
          .footer {
            padding-top: 15px;
            padding-left: 15px;
            padding-right: 15px;
            color: var(--secondary-text-color);
            text-align: center;
          }
          span {
            white-space: nowrap;
          }
        `}
      </style>
    </div>
  );
};

export default Footer;
