import { getServerSession } from 'next-auth';

import { Header } from '@/app/(1_main)/_components/Header';
import { Footer } from '@/components/Footer';
import { SettingsMenu } from '@/app/(1_main)/_components/SettingsDropdown';
import { authOptions } from '@/lib/auth';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AppLayout({ children }: AuthLayoutProps) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  const userComponent = user ? <SettingsMenu session={session} /> : '';
  return (
    <>
      <Header userComponent={userComponent} />
      <main className="mx-auto px-12">
        <div className="px-6 lg:px-8">{children}</div>
      </main>

      <Footer />
    </>
  );
}
