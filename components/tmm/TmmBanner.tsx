import { useEffect, useRef, useState } from 'react';

import useIntersectionObserver from '@/lib/useIntersect';
import useMedia from '@/lib/useMedia';
import Image from "next/image";
import Banner1 from '../../public/tmm/Transfer-playlists-with-TMM-banner-1.jpg';
import Banner2 from '../../public/tmm/Transfer-playlists-with-TMM-banner-2.jpg';
import Banner3 from '../../public/tmm/Transfer-playlists-with-TMM-banner-3.jpg';

const options = [
  {
    id: 12,  /* Banner 1 */
    link: `https://www.tunemymusic.com/?mode=spotify-dedup&source=spotify-dedup&innerpage=purple-banner-`,
  },
  {
    id: 13,  /* Banner 2 */
    link: `https://www.tunemymusic.com/?mode=spotify-dedup&source=spotify-dedup&innerpage=multicolor-banner-`,
  },
  {
    id: 14,  /* Banner 3 */
    link: `https://www.tunemymusic.com/?mode=spotify-dedup&source=spotify-dedup&innerpage=orange-banner-`,
  },
];

type Campaign = { id: number; link: string; }

const TmmBanner = ({ placement }: { placement: string }) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const entry = useIntersectionObserver(ref, {
    threshold: 0.5
  })
  const [hasBeenSeen, setHasBeenSeen] = useState<boolean>(false);
  const [randomIndex, setRandomIndex] = useState<number | null>(null);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const isMobile = useMedia('(max-width: 600px)')

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
            `https://musicalyst.com/api/campaigns/logImpression_sd`,
            JSON.stringify({ id: campaign?.id, placement })
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
          `https://musicalyst.com/api/campaigns/logClick_sd`,
          JSON.stringify({ id: campaign?.id, placement })
        );
    }
  };

  const images = [Banner1, Banner2, Banner3];
  const backgrounds = [
    "linear-gradient(155deg, rgba(115,74,204,1) 0%, rgba(85,88,205,1) 100%)",
    "linear-gradient(155deg, rgba(245,162,58,1) 0%, rgba(237,64,92,1) 50%, rgba(156,0,187,1) 100%)",
    "linear-gradient(155deg, rgba(236,128,63,1) 0%, rgba(251,175,24,1) 50%, rgba(232,91,1,1) 100%)"
  ];
  return <div ref={ref}>
    {campaign && randomIndex !== null && <a
      target="_blank"
      rel="noopener noreferrer nofollow"
      href={`${campaign.link}${placement}`}
      onClick={handleClick}
    >{isMobile ?
      <div className="p-5 bg-orange-600 relative antialiased" style={{
        background: backgrounds[randomIndex],
        fontFamily: "ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,BlinkMacSystemFont,Helvetica Neue,Arial,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji",
      }}>
        <div>
          <div className="text-lg font-semibold w-80 mb-2 text-white leading-6">
            Transfer your <strong>music</strong> & playlists
            between music services with <strong>TuneMyMusic</strong>.
          </div>
          <div className="uppercase bg-white text-black inline-block py-1 px-8 rounded-full font-semibold text-xs">
            Transfer now
          </div>
        </div>
        <div className="absolute right-5 bottom-5">
          <Image src="/tmm/tmm.svg" height={45}
            width={229} alt="TMM" className="w-24 min-[420px]:w-40" />
        </div>
      </div>
      : <Image src={images[randomIndex]} alt="Transfer your music & playlists between music services with TuneMyMusic" />}
    </a>}
    {!campaign && <div className="bg-slate-200 dark:bg-slate-800" style={{ maxWidth: '100%', aspectRatio: '1600 / 350' }} />
    }
  </div>
}

export default TmmBanner;