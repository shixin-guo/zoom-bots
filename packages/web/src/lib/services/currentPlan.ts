import type { CurrentPhase } from 'tier';

import type { CurrentPlan, PricingTableData } from '@/types';
import { TIER_FREE_PLAN_ID } from '@/config/tierConstants';

export const pullCurrentPlan = async (
  currentPhase: CurrentPhase,
  pricingTableData: PricingTableData[],
): Promise<CurrentPlan> => {
  const currentPlanId = currentPhase.plans
    ? currentPhase.plans[0]
    : TIER_FREE_PLAN_ID;

  const pricingTablePlan = pricingTableData.find(
    (_plan) => _plan.planId === currentPlanId,
  );

  return {
    planId: currentPlanId,
    name: pricingTablePlan?.name ?? 'Free',
    base: pricingTablePlan?.base ?? 0,
    currency: pricingTablePlan?.currency ?? 'usd',
    interval: pricingTablePlan?.interval ?? 'monthly',
    extraUsageRate: pricingTablePlan?.extraUsageRate,
  };
};
