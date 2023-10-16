import { Metadata } from 'next';

import { pullPricingTableData } from '@/lib/services/pricingTableData';

import ProductPricing from '@/components/ProductPricing';

export const metadata: Metadata = {
  title: 'Pricing',
};

const pricing = await pullPricingTableData();

export default async function PricingPage() {
  return (
    <>
      {/* Pricing */}
      <div className="border-slate-6 mt-16 flex flex-col gap-12 border-b pb-24 ">
        <ProductPricing pricing={pricing} />
      </div>
    </>
  );
}
