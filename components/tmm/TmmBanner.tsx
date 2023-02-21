import { useEffect, useRef, useState } from 'react';

import Banner1 from '../../public/tmm/Transfer-playlists-with-TMM-banner-1.jpg';
import Banner2 from '../../public/tmm/Transfer-playlists-with-TMM-banner-2.jpg';
import Banner3 from '../../public/tmm/Transfer-playlists-with-TMM-banner-3.jpg';
import Image from "next/image";
import useIntersectionObserver from '@/lib/useIntersect';

const options = [
  {
    id: 12,  /* Banner 1 */
    link: `https://www.tunemymusic.com/?mode=spotify-dedup&innerpage=purple-banner-`,
  },
  {
    id: 13,  /* Banner 2 */
    link: `https://www.tunemymusic.com/?mode=spotify-dedup&innerpage=multicolor-banner-`,
  },
  {
    id: 14,  /* Banner 3 */
    link: `https://www.tunemymusic.com/?mode=spotify-dedup&innerpage=orange-banner-`,
  },
];

const TmmBanner = ({ placement }: { placement: string }) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const entry = useIntersectionObserver(ref, {
    threshold: 0.5
  })
  const [hasBeenSeen, setHasBeenSeen] = useState<boolean>(false);
  const [randomIndex, setRandomIndex] = useState(null);
  const [campaign, setCampaign] = useState(null);
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * 3);
    const campaign = options[randomIndex];
    setRandomIndex(randomIndex);
    setCampaign(campaign);
  }, []);

  useEffect(() => {
    if (hasBeenSeen) {
      (async () => {
        navigator.sendBeacon &&
          navigator.sendBeacon(
            `https://spotify-top.com/api/campaigns/logImpression_sd`,
            JSON.stringify({ id: campaign.id, placement })
          );
      })();
    }
  }, [hasBeenSeen]);

  if (!!entry?.isIntersecting && campaign && !hasBeenSeen) {
    setHasBeenSeen(true);
  }

  const handleClick = async () => {
    // todo: register only one
    // todo: use a unique id that is not the campaignId
    if (campaign?.id !== null) {
      navigator.sendBeacon &&
        navigator.sendBeacon(
          `https://spotify-top.com/api/campaigns/logClick_sd`,
          JSON.stringify({ id: campaign.id, placement })
        );
    }
  };

  const images = [Banner1, Banner2, Banner3];
  return <div ref={ref}>
    {campaign && <a
      target="_blank"
      rel="noopener noreferrer"
      href={`${campaign.link}${placement}`}
      onClick={handleClick}
    >
      <Image src={images[randomIndex]} alt="TuneMyMusic" />
    </a>}
    {!campaign && <div className="bg-slate-200 dark:bg-slate-800" style={{ maxWidth: '100%', aspectRatio: '1600 / 350' }} />
    }
  </div >
}

export default TmmBanner;