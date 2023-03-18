import type { AppProps } from "next/app";
import React from "react";
import { Analytics } from "@vercel/analytics/react";

import Layout from "../components/Layout";
import "@vercel/examples-ui/globals.css";
function App({ Component, pageProps }: AppProps): React.ReactElement {
  return (
    <Layout>
      <Component {...pageProps} />
      <Analytics />
    </Layout>
  );
}

export default App;
