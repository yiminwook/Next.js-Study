import type { AppProps } from 'next/app'
import "semantic-ui-css/semantic.min.css";
import '@/styles/globals.css';

import Footer from '@/component/Footer';
import Top from '@/component/Top';

/* App은 Global css, Layout를 잡는다. */
export default function App({ Component, pageProps }: AppProps) {
  return (
    <div style={{ width: 700, margin: "0 auto" }}>
      <Top />
      <Component {...pageProps} />
      <Footer />
    </div>
  );
}
