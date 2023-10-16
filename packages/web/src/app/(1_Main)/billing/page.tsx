import { Metadata } from 'next';
import { clsx } from 'clsx';

import { TIER_AICOPY_FEATURE_ID } from '@/config/tierConstants';
import { pullCurrentPlan } from '@/lib/services/currentPlan';
import { pullPricingTableData } from '@/lib/services/pricingTableData';
import { getCurrentUser } from '@/lib/session';

import { tier } from '@/lib/tier';
import { CreditCardIcon } from '@/components/ui/icons/CreditCardIcon';

import ProductPricing from '@/components/ProductPricing';
// import { checkout } from "./action";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Billing',
  description: 'Manage your subscription and know about your usage',
};
export default async function BillingPage() {
  const pricing = await pullPricingTableData();
  const user = await getCurrentUser();

  // Fetch the feature consumption and limit of the AI copy feature for the plan currently subscribed
  const featureLimits = await tier.lookupLimit(
    `org:${user?.id}`,
    TIER_AICOPY_FEATURE_ID,
  );

  const usageLimit = featureLimits.limit;
  console.log('usageLimit', usageLimit);
  const used = featureLimits.used;

  // Fetch the phase data of the current subscription
  const phase = await tier.lookupPhase(`org:${user?.id}`);

  // Fetch the current plan from the pricing table data
  const currentPlan = await pullCurrentPlan(phase, pricing);

  // Fetch organization/user details
  const org = await tier.lookupOrg(`org:${user?.id}`);

  // Fetch the saved payment methods
  const paymentMethodResponse = await tier.lookupPaymentMethods(
    `org:${user?.id}`,
  );

  const paymentMethod = paymentMethodResponse.methods[0];

  return (
    <div className="mx-auto max-w-6xl">
      {/* Greetings */}
      <div className="mt-16 flex items-center justify-between">
        <h1 className="h4">
          <span className="text-2xl font-semibold tracking-tight">
            {`Hello, ${user?.name}`}
          </span>
        </h1>
      </div>
      {/* Usage Display */}
      <div className="border-slate-6 mt-16 flex flex-col items-center border-b pb-16">
        <div className="flex items-start gap-12">
          {/* Your subscription */}
          <div className="border-slate-6 flex flex-col gap-4 border-r pr-12">
            <p className="body  ">Your subscription</p>
            <div className="flex flex-col gap-2">
              <p className="body-xl">{currentPlan.name}</p>
              <div className="flex items-center gap-3">
                <h5 className="text-[32px] font-bold leading-9">{`$${
                  currentPlan.base / 100
                }`}</h5>
                <div className="text-muted-foreground flex flex-col items-start">
                  <span className="caption">
                    {currentPlan.currency.toUpperCase()}
                  </span>
                  <span className="caption-s">
                    {`Billed ${currentPlan.interval}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Usage details */}
          <div
            className={clsx(
              'flex flex-col gap-9 ',
              currentPlan.extraUsageRate !== undefined
                ? 'border-slate-6 border-r pr-12'
                : '',
            )}
          >
            <p className=" ">Copies generated</p>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row-reverse items-end justify-between">
                <p className="caption-s  ">
                  Free tokens allowed : {usageLimit}
                </p>
              </div>
              {/* Progress */}
              <div className="bg-slate-4 relative h-2 w-[442px]">
                <div
                  className="absolute h-2 bg-red-600"
                  style={{
                    width: `${
                      usageLimit - used > 0
                        ? (used / usageLimit) * 100
                        : (usageLimit / usageLimit) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <div className="flex items-center justify-between">
                {usageLimit - used > 0 ? (
                  <p className="caption-s  ">
                    {usageLimit - used} remaining in free quota
                  </p>
                ) : (
                  <p className="caption-s  ">0 remaining in free quota</p>
                )}
                <p className="caption-s  ">
                  {usageLimit - used > 0
                    ? `${used} / ${usageLimit}`
                    : `${usageLimit} / ${usageLimit}`}
                </p>
              </div>
            </div>
          </div>
          {/* Overages */}
          {currentPlan.extraUsageRate !== undefined ? (
            <div className="flex flex-col gap-5">
              <p className=" ">Overages</p>
              <div className="flex items-center gap-3">
                <p className="text-[32px] font-bold leading-9">
                  $
                  {usageLimit - used > 0
                    ? 0
                    : (used - usageLimit) * (currentPlan.extraUsageRate / 100)}
                </p>
                <p className="caption  ">
                  @ ${currentPlan.extraUsageRate / 100}/tokens
                </p>
              </div>
              <p className="caption  ">
                Additional copies generated:{' '}
                {usageLimit - used > 0 ? 0 : used - usageLimit}
              </p>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
      {/* Manage subscription */}
      {/* Pricing */}
      <div className="border-slate-6 mt-16 flex flex-col gap-12 border-b pb-24 ">
        <p className=" ">Manage subscription</p>
        <ProductPricing pricing={pricing} currentPlan={currentPlan} />
      </div>
      {/* Billing details */}
      <div className="mb-40 mt-16">
        <div className="flex items-start gap-16">
          {/* Billing information */}
          {org.email && (
            <div
              className={clsx(
                'flex items-start gap-16 ',
                paymentMethod ? 'border-slate-6 border-r pr-16' : '',
              )}
            >
              <p className=" ">Billing information</p>
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  {org.name ? <p className="body-semibold">{org.name}</p> : ''}
                  <p className=" ">{org.email}</p>
                </div>
              </div>
            </div>
          )}
          {/* Payment method */}
          {paymentMethod && (
            <div className="flex items-start gap-16">
              <p className=" ">Payment method</p>
              <div className="flex gap-4">
                <CreditCardIcon />
                <div className="flex flex-col gap-2">
                  <p className="body-semibold">
                    Card ending in {paymentMethod.card.last4}
                  </p>
                  <p className=" ">
                    Expires {paymentMethod.card.exp_month}/
                    {paymentMethod.card.exp_year}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
