import { Trans, useTranslation } from 'react-i18next';

import Badge from './badge';
import { DuplicateReason } from '@/dedup/types';

const reasonToString = (reason: DuplicateReason) => {
  switch (reason) {
    case 'same-id': return 'result.duplicate.reason-same-id';
    case 'same-name-artist': return 'result.duplicate.reason-same-data';
  }
}

const DuplicateTrackListItem = ({
  reason,
  trackName,
  trackArtistName,
}: {
  reason: DuplicateReason,
  trackName: string,
  trackArtistName: string
}) => {
  const { t, i18n } = useTranslation();
  return (
    <li>
      <Badge>{t(reasonToString(reason))}</Badge>
      <Trans i18nKey="result.duplicate.track" shouldUnescape={true}>
        <span>{{ trackName } as any}</span> <span className="text-gray-500">by</span>{' '}
        <span>{{ trackArtistName } as any}</span>
      </Trans>
    </li>
  );
};

export default DuplicateTrackListItem;