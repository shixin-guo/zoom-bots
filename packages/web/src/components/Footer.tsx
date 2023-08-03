import { NextJSLogo } from '@/components/ui/icons/NextJSLogo';
import { OpenAILogo } from '@/components/ui/icons/OpenAILogo';
import { StripeLogo } from '@/components/ui/icons/StripeLogo';
import { TierLogo } from '@/components/ui/icons/TierLogo';
import { VercelLogo } from '@/components/ui/icons/VercelLogo';

export function Footer() {
  return (
    <footer className="flex flex-col items-center gap-6 pb-24">
      <span className="h6 text-slate-11">Powered By</span>
      {/* Logos */}
      <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <OpenAILogo />
        <NextJSLogo />
        <VercelLogo />
        <StripeLogo />
        <TierLogo />
      </div>
    </footer>
  );
}
