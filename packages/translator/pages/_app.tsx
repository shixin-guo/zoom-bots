import type { AppProps } from "next/app";

import { SessionProvider as AuthProvider } from "next-auth/react";
import "@/styles/globals.css";

import { FC } from "react";
import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });
const Noop: FC = ({ children }: any) => <>{children}</>;
function App({ Component, pageProps }: AppProps): JSX.Element {
  const Layout = (Component as any).Layout || Noop;
  return (
    <AuthProvider session={pageProps.session}>
      <Head>
        <title>Translator</title>
        <meta
          name="description"
          content="Use AI to translate I18N from one language to another."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={inter.className}>
        <Layout pageProps={pageProps}>
          <Component {...pageProps} />
        </Layout>
      </main>
    </AuthProvider>

  );
}

export default App;
