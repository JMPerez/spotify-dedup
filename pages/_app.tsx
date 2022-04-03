import type { AppProps } from 'next/app';
import Script from 'next/script';
import { useAnalytics } from '../lib/analytics';
import { useRouter } from 'next/router';
export default function App({ Component, pageProps }: AppProps) {
  useAnalytics();
  const router = useRouter();
  console.log({ router })
  const include3rdPartyScripts = true;
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
        <Script id="google-analytics" strategy="afterInteractive">
          {`
              if (location.host === 'spotify-dedup.com') {
                (function (b, o, i, l, e, r) {
                  b.GoogleAnalyticsObject = l;
                  b[l] ||
                    (b[l] = function () {
                      (b[l].q = b[l].q || []).push(arguments);
                    });
                  b[l].l = +new Date();
                  e = o.createElement(i);
                  r = o.getElementsByTagName(i)[0];
                  e.src = '//www.google-analytics.com/analytics.js';
                  e.defer = true;
                  r.parentNode.insertBefore(e, r);
                })(window, document, 'script', 'ga');
              ga('create', 'UA-39254352-6');
              ga('send', 'pageview');
              }
              `}
        </Script>
      }

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