// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

// ./pages/_document.js
import Document, { Head, Html, Main, NextScript } from 'next/document';

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
        </body>
      </Html>
    );
  }
}

export default MyDocument;
