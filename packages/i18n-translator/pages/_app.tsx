import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { FC } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const Noop: FC = ({ children }: any) => <>{children}</>;
function App({ Component, pageProps }: AppProps): JSX.Element {
  const Layout = (Component as any).Layout || Noop;
  return (
    <>
      <main className={inter.className}>
        <Layout pageProps={pageProps}>
          <Component {...pageProps} />
        </Layout>
      </main>
    </>
  );
}

export default App;
