import '../styles/globals.css';

import { useRouter } from 'next/router';
import Script from 'next/script';
import { useAnalytics } from '../lib/analytics';

export default function App({ Component, pageProps }: any) {
  useAnalytics();
  const router = useRouter();
  const include3rdPartyScripts = router.asPath != '/callback';
  return (
    <>
      {include3rdPartyScripts && (
        <Script
          src="https://browser.sentry-cdn.com/5.29.2/bundle.min.js"
          integrity="sha384-ir4+BihBClNpjZk3UKgHTr0cwRhujAjy/M5VEGvcOzjhM1Db79GAg9xLxYn4uVK4"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        ></Script>
      )}
      {include3rdPartyScripts &&
        <Script id="sentry" strategy="afterInteractive">
          {`
            window.Sentry &&
            Sentry.init({ dsn: 'https://22cbac299caf4962b74de18bc87a8d74@o166353.ingest.sentry.io/1239123' });
            `}
        </Script>
      }
      <Component {...pageProps} />
    </>);
}