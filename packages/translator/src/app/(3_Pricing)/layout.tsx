import React from 'react';

import { Footer } from '@/components/Footer';
import { Header } from '@/app/(3_Pricing)/_components/Header';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
