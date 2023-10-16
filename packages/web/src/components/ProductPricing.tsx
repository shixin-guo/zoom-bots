import clsx from 'clsx';

import { Button } from '@/components/ui/button';

import { CheckoutButton } from '@/components/CheckoutButton';
import { CheckBoxIcon } from '@/components/ui/icons/CheckBoxIcon';
import { AuthModal } from './AuthModal';

type PropsType = {
  pricing: any;
  currentPlan?: any;
};
export default function ProductPricing({ pricing, currentPlan }: PropsType) {
  return (
    <div className="mx-auto flex flex-col items-start gap-6 md:flex-row">
      {pricing.map((plan, planIndex) => (
        <div
          key={planIndex}
          className={clsx(
            ' flex h-[353px] flex-col gap-8 rounded-lg px-6 py-12 shadow',
            plan.planId === currentPlan?.planId ? 'border-[3px]' : 'border',
          )}
        >
          <div className="flex flex-col gap-2">
            <h6 className="body-semibold text-xl">{plan.name}</h6>
            <div className="flex items-center gap-3">
              <h5 className="text-[32px] font-bold leading-9">
                ${plan.base / 100}
              </h5>
              <div className="text-muted-foreground flex flex-col items-start">
                <span className="caption">{plan.currency.toUpperCase()}</span>
                <span className="caption-s">Billed {plan.interval}</span>
              </div>
            </div>
          </div>
          {currentPlan ? (
            plan.planId === currentPlan?.planId ? (
              <Button
                disabled={true}
                className="w-[256px] ring-1 ring-slate-900/10 hover:ring-slate-900/20"
              >
                Current plan
              </Button>
            ) : (
              <CheckoutButton plan={plan} currentPlan={currentPlan} />
            )
          ) : plan.promoted ? (
            <AuthModal
              slot={<Button variant="default">Buy this plan</Button>}
            ></AuthModal>
          ) : (
            <AuthModal
              slot={<Button variant="outline">Buy this plan</Button>}
            ></AuthModal>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <CheckBoxIcon className={clsx('stroke-slate-11 h-6 w-6')} />
              <p className="">
                {new Intl.NumberFormat().format(Number(plan.baseQuantity))}{' '}
                tokens / month
              </p>
            </div>
            <div className="flex gap-3">
              <CheckBoxIcon className={clsx('stroke-slate-11 h-6 w-6')} />
              <p className="flex flex-col">
                {`Overages: $${new Intl.NumberFormat().format(
                  Number(plan.extraPrice) * 1000,
                )} / 1K tokens`}
                <span className="text-sm text-slate-600">{`${plan.extraQuantity}+ limit`}</span>
              </p>
              <br />
              <p></p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
