import '@/styles/globals.css';
import { Metadata } from 'next';

import { getServerSession } from 'next-auth/next';

import { ThemeProvider } from '@/components/theme-provider';

import { siteConfig } from '@/config/site';
import { dm_sans, inter } from '@/lib/fonts';
import { Toaster } from '@/components/ui/toaster';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SettingsMenu } from '@/app/(1_Main)/_components/SettingsDropdown';
import { authOptions } from '@/lib/auth';
import { AuthModal } from '@/components/AuthModal';
// todo
export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'Tier',
    'Metered Pricing',
    'React',
    'NextJS',
    'Tailwind CSS',
    'App Router',
    'OpenAI',
    'Server Components',
  ],
  authors: [
    {
      name: 'shixin.guo',
      url: '///',
    },
  ],
  creator: 'shixin',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  // twitter: {
  //   card: 'summary_large_image',
  //   title: siteConfig.name,
  //   description: siteConfig.description,
  //   images: [`${siteConfig.url}/og.jpg`],
  //   creator: '@shixin',
  // },
  icons: {
    icon: '/favicons/favicon.ico',
    shortcut: '/favicons/panda.png',
  },
  manifest: `${siteConfig.url}/favicons/site.webmanifest`,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  const userComponent = user ? (
    <SettingsMenu session={session} />
  ) : (
    <AuthModal />
  );
  return (
    <html
      lang="en"
      className={`${inter.variable} ${dm_sans.variable}`}
      suppressHydrationWarning
    >
      <head />
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Header userComponent={userComponent} />
          {children}
          {/* todo */}
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
