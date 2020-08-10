import NextError from 'next/error';

export default class MyError extends NextError {
  static getInitialProps({ res, err }) {
    if (!(err instanceof Error)) {
      err = new Error(err && err.message);
    }
    global.window && window.Sentry && Sentry.captureException(err);
    return NextError.getInitialProps({ res, err });
  }
}
