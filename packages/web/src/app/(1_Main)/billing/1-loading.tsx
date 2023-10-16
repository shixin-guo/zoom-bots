import clsx from 'clsx';

import { Skeleton } from '@/components/ui/skeleton';
import { CreditCardIcon } from '@/components/ui/icons/CreditCardIcon';
// todo
export default async function BillingLoading() {
  return (
    <>
      {/* Greetings */}
      <div className="mt-16 flex items-center justify-between">
        <h1 className="h4">Hello</h1>
      </div>
      {/* Usage Display */}
      <div className="border-slate-6 mt-16 flex flex-col items-center border-b pb-16">
        <div className="flex items-start gap-12">
          {/* Your subscription */}
          <div className="border-slate-6 flex flex-col gap-4 border-r pr-12">
            <p className="body">Your subscription</p>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
          {/* Usage details */}
          <div
            className={clsx(
              'flex flex-col gap-9 ',
              'border-slate-6 border-r pr-12',
            )}
          >
            <p className=" ">Copies generated</p>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row-reverse items-end justify-between">
                <Skeleton className="h-5 w-1/3" />
              </div>
              {/* Progress */}
              <div className="bg-slate-4 relative h-2 w-[442px]">
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
          </div>
          {/* Overages */}
          <div className="flex flex-col gap-5">
            <p className=" ">Overages</p>
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-full" />
            </div>
            <Skeleton className="h-5 w-[200px]" />
          </div>
        </div>
      </div>
      {/* Manage subscription */}
      {/* Pricing */}
      <div className="border-slate-6 mt-16 flex flex-col gap-12 border-b pb-24 ">
        <p className=" ">Manage subscription</p>
        <div className="mx-auto flex w-full flex-col items-start gap-6 md:flex-row">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
      {/* Billing details */}
      <div className="mb-40 mt-16">
        <div className="flex w-full items-start gap-16">
          {/* Billing information */}
          <div
            className={clsx(
              'flex items-start gap-16 ',
              'border-slate-6 border-r pr-16',
            )}
          >
            <p className=" ">Billing information</p>
            <div className="flex flex-col gap-8">
              <div className="flex w-full flex-col gap-2">
                <Skeleton className="h-5 w-[200px]" />
                <Skeleton className="h-5 w-[200px]" />
              </div>
            </div>
          </div>
          {/* Payment method */}
          <div className="flex items-start gap-16">
            <p className=" ">Payment method</p>
            <div className="flex gap-4">
              <CreditCardIcon />
              <div className="flex w-full flex-col gap-2">
                <Skeleton className="h-5 w-[200px]" />
                <Skeleton className="h-5 w-[200px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
