import { Metadata } from 'next';

import { cn } from '@/lib/utils';

import { DemoCookieSettings } from '@/components/cookie-settings';
import { DemoCreateAccount } from '@/components/create-account';

export const metadata: Metadata = {
  title: 'Zoom Meeting Bot',
  description: 'Examples of creating a Zoom meeting bot',
};

function DemoContainer({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex items-center justify-center [&>div]:w-full',
        className,
      )}
      {...props}
    />
  );
}

export default function sPage() {
  return (
    <>
      <div className="items-start justify-center gap-6 rounded-lg p-8 md:grid lg:grid-cols-2 xl:grid-cols-3">
        <div className="col-span-2 grid items-start gap-6 lg:col-span-1">
          <DemoContainer>
            <DemoCreateAccount />
          </DemoContainer>
          <DemoContainer>
            <DemoCookieSettings />
          </DemoContainer>
        </div>
      </div>
    </>
  );
}
