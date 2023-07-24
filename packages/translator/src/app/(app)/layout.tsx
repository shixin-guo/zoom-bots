import { User } from '@/components/User';
import { Header } from '@/components/app/Header';
import { Footer } from '@/components/Footer';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AuthLayoutProps) {
  const userComponent = <User />;
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
