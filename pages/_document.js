// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

// ./pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';
import i18n from '../i18n';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    const include3rdPartyScripts =
      this.props.__NEXT_DATA__.page !== '/callback';
    return (
      <Html lang={i18n.language}>
        <Head />
        <body>
          <Main />
          <NextScript />
          <script
            dangerouslySetInnerHTML={{
              __html: `
      if (
        window.location.host === 'spotify-dedup.com' &&
        window.location.protocol != 'https:'
      ) {
        window.location.protocol = 'https';
      }`,
            }}
          />
          {include3rdPartyScripts && (
            <script
              src="https://browser.sentry-cdn.com/5.29.2/bundle.min.js"
              integrity="sha384-ir4+BihBClNpjZk3UKgHTr0cwRhujAjy/M5VEGvcOzjhM1Db79GAg9xLxYn4uVK4"
              crossOrigin="anonymous"
            ></script>
          )}
          {include3rdPartyScripts && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
      if (location.host === 'spotify-dedup.com') {
        (function(b, o, i, l, e, r) {
          b.GoogleAnalyticsObject = l;
          b[l] ||
            (b[l] = function() {
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

        window.Sentry &&
        Sentry.init({ dsn: 'https://22cbac299caf4962b74de18bc87a8d74@o166353.ingest.sentry.io/1239123' });
      }`,
              }}
            />
          )}
        </body>
      </Html>
    );
  }
}

export default MyDocument;
