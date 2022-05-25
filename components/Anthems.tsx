import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import logo from '../public/static/anthems/logo.png';
import record from '../public/static/anthems/record.png';
import storeAndroid from '../public/static/anthems/store-android.png';
import storeApple from '../public/static/anthems/store-apple.png';
import useIntersectionObserver from '@/lib/useIntersect';
import useMedia from '../lib/useMedia';

// import { trackGoal } from 'fathom-client';

const logImpression = true;
const logClick = true;
const campaignId = 9;
const Anthems = () => {
  const ref = useRef<HTMLDivElement | null>(null)
  const entry = useIntersectionObserver(ref, {
    threshold: 0.5
  })
  const [hasBeenSeen, setHasBeenSeen] = useState<boolean>(false);
  const isDesktop = useMedia('(min-width: 540px)');

  useEffect(() => {
    if (hasBeenSeen && logImpression) {
      (async () => {
        await fetch(`https://spotify-top.com/api/campaigns/logImpression_sd?id=${campaignId}`,
          { method: 'POST' });
      })();
    }
  }, [hasBeenSeen]);

  if (!!entry?.isIntersecting && !hasBeenSeen) {
    setHasBeenSeen(true);
  }

  const handleClick = async () => {
    if (logClick) {
      await fetch(`https://spotify-top.com/api/campaigns/logClick_sd?id=${campaignId}`,
        { method: 'POST' });
    }
  }


  return <div ref={ref}><a
    target="_blank"
    rel="noopener noreferrer"
    href={'https://anthems7h9jk.app.link/OuaUY9i9bqb'}
    onClick={handleClick}
  >{isDesktop ?
    <div className="mb-8">
      <div className="rounded-lg flex items-center p-4 border border-gray-200 justify-between" style={{ background: '#D5F3D6' }}>
        <div className="h-full flex-none w-36">
          <div>
            <Image
              src={record}
              layout="responsive"
              width="436"
              height="349"
            />
          </div>
        </div>
        <div className="mx-4 flex flex-col self-stretch">
          <div className="flex-none text-center -mt-3 mb-3">
            <span className="text-red-600 dark:text-red-600 rounded-full text-xs py-1 px-1.5" style={{ background: 'linear-gradient(94.16deg, rgba(253, 18, 0, 0.1) 0%, rgba(242, 0, 106, 0.1) 95.81%)' }}>Announcing</span>
          </div>
          <div className="flex-auto ">
            <h2 className="text-base font-extrabold tracking-tight text-gray-900 dark:text-gray-900 mb-2 -mt-2">
              <span className="block">New ways to flex your music taste</span>
            </h2>
            <p className="text-sm pb-2 text-gray-900 dark:text-gray-900">
              Unlock unique designs for your Spotify listening stats
            </p>
          </div>

          <div className="w-32 flex-none">
            <Image
              src={logo}
              layout="responsive"
              width="512"
              height="115"
            />
          </div>
        </div>
        <div
          className="block"
          style={{ width: '148px' }}
        >
          <div className="flex flex-col gap-1">
            <div>
              <Image src={storeApple} width="147" height="42" layout="responsive" />
            </div>
            <div>
              <Image src={storeAndroid} width="147" height="42" layout="responsive" />
            </div>
          </div>
        </div>
      </div>
    </div> :

    <div className="mb-8">
      <div className="rounded-lg flex flex-col items-center p-4 border border-gray-200" style={{ background: '#D5F3D6' }}>
        <div className="text-center -mt-3 mb-4">
          <span className="text-red-600 dark:text-red-600 border rounded-full text-xs py-1 px-1.5" style={{ background: 'linear-gradient(94.16deg, rgba(253, 18, 0, 0.1) 0%, rgba(242, 0, 106, 0.1) 95.81%)' }}>Announcing</span>
        </div>

        <div className="flex flex-row items-center">
          <div className="basis-auto mr-6">
            <h2 className="text-base font-extrabold tracking-tight text-gray-900 dark:text-gray-900 mb-2 -mt-2">
              <span className="block">New ways to flex your music taste</span>
            </h2>
            <p className="text-sm pb-2 text-gray-900 dark:text-gray-900">
              Unlock unique designs for your Spotify listening stats
            </p>
          </div>
          <div className="w-32 flex-none">
            <div className="flex flex-col items-center">
              <div className="w-28 mb-2">
                <Image
                  src={logo}
                  layout="responsive"
                  width="512"
                  height="115"
                />
              </div>
              <div className="w-32">
                <Image
                  src={record}
                  layout="responsive"
                  width="436"
                  height="349"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="block w-72 mt-2">
          <div className="flex flex-row space-x-2">
            <div className="basis-1/2">
              <Image src={storeApple} width="147" height="42" layout="responsive" />
            </div>
            <div className="basis-1/2">
              <Image src={storeAndroid} width="147" height="42" layout="responsive" />
            </div>
          </div>
        </div>
      </div>
    </div>}
  </a>
  </div>;
}

export default Anthems;
