import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import Badge from './badge';

export const DuplicateTrackListItem = ({
  reason,
  trackName,
  trackArtistName,
}) => {
  const { t, i18n } = useTranslation();
  return (
    <li>
      {reason === 'same-id' && (
        <Badge>{t('result.duplicate.reason-same-id')}</Badge>
      )}
      {reason === 'same-name-artist' && (
        <Badge>{t('result.duplicate.reason-same-data')}</Badge>
      )}
      <Trans i18nKey="result.duplicate.track">
        <span>{{ trackName }}</span> <span className="gray">by</span>{' '}
        <span>{{ trackArtistName }}</span>
      </Trans>
      <style jsx>
        {`
          .gray {
            color: #999;
          }
        `}
      </style>
    </li>
  );
};
