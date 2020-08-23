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
              src="https://browser.sentry-cdn.com/5.21.1/bundle.min.js"
              integrity="sha384-O8HdAJg1h8RARFowXd2J/r5fIWuinSBtjhwQoPesfVILeXzGpJxvyY/77OaPPXUo"
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

        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '828495194151239');
        fbq('track', 'PageView');

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
