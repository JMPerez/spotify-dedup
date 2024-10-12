import '../styles/globals.css';

import { Analytics } from '@vercel/analytics/react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: any) {
  const router = useRouter();
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>);
}
