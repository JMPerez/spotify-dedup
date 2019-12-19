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
        window.location.host === 'jmperezperez.com' &&
        window.location.protocol != 'https:'
      ) {
        window.location.protocol = 'https';
      }`,
            }}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
      if (location.host === 'jmperezperez.com') {
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
        ga('create', 'UA-39254352-1');
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
      }`,
            }}
          />
          <script
            src="https://cdn.ravenjs.com/3.26.2/raven.min.js"
            crossOrigin="anonymous"
            defer
          ></script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
