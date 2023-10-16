'use client';
import Link from 'next/link';
import { Work_Sans } from 'next/font/google';
const work_Sans = Work_Sans({
  preload: false,
});

import { siteConfig } from '@/config/site';
import { Icons } from '@/components/ui/icons';
// todo
export function Header({ userComponent }: any) {
  return (
    <header className="border-slate-6 bg-background z-1000 sticky top-0 border-b px-4 backdrop-blur-lg">
      <nav
        className="mx-auto flex items-center  justify-between px-6 py-4 lg:px-8 lg:py-0"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/translator" className="-m-1.5 p-1.5">
            <span className="sr-only">{siteConfig.name}</span>
            <div className="flex gap-2">
              <Icons.myLogo />
              <span
                className={`${work_Sans.className} hidden text-base font-bold sm:inline-block`}
              >
                {siteConfig.name}
              </span>
            </div>
          </Link>
        </div>

        <div className="hidden py-2 lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-5">
          <Link href="/billing" className="-m-1.5 p-1.5">
            <span className="sr-only">{'billing'}</span>
            <div className="flex gap-2">
              <span
                className={`${work_Sans.className} hidden text-base font-bold sm:inline-block`}
              >
                billing
              </span>
            </div>
          </Link>
          <Link href="/pricing" className="-m-1.5 p-1.5">
            <span className="sr-only">{'billing'}</span>
            <div className="flex gap-2">
              <span
                className={`${work_Sans.className} hidden text-base font-bold sm:inline-block`}
              >
                pricing
              </span>
            </div>
          </Link>
          {userComponent}
        </div>
      </nav>
    </header>
  );
}
