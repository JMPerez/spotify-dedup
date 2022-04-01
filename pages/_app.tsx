import type { AppProps } from 'next/app';
import { useAnalytics } from '../lib/analytics';

export default function App({ Component, pageProps }: AppProps) {
  useAnalytics();

  return (
    <Component {...pageProps} />
  );
}