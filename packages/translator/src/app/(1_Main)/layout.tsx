import { getServerSession } from 'next-auth';

import { Header } from '@/app/(1_Main)/_components/Header';
import { Footer } from '@/components/Footer';
import { SettingsMenu } from '@/app/(1_Main)/_components/SettingsDropdown';
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
      <main>
        <div>{children}</div>
      </main>
      <Footer />
    </>
  );
}
