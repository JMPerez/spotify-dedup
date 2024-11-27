// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

// ./pages/_document.js
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document<{ language: string }> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const language = ctx.pathname.split('/')[1] || 'en';
    return { ...initialProps, language };
  }

  render() {
    return (
      <Html lang={this.props.language}>
        <Head />
        <body className="antialiased text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 pt-0 flex h-full flex-col">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
