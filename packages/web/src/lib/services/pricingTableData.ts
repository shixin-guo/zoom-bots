import {
  TIER_AICOPY_FEATURE_ID,
  TIER_BASE_FEATURE_ID,
  TIER_EXTRACOPY_FEATURE_ID,
  tierFeatureConstants,
  tierPlanConstants,
} from '@/config/tierConstants';
import { tier } from '@/lib/tier';

export const pullPricingTableData = async () => {
  // Pull the all the pricing model details from Tier Cloud
  const tierPricingData = await tier.pull();

  const pricingTableData = tierPlanConstants
    .map((_planConstant) => {
      if (
        _planConstant.planId &&
        Object.entries(tierPricingData.plans).some(
          (_plan) => _plan[0] === _planConstant.planId,
        )
      ) {
        // Get Tier Plan
        const tierPlan = Object.entries(tierPricingData.plans).find(
          (_plan) => _plan[0] === _planConstant.planId,
        );
        const secondItemTierPlan = tierPlan?.[1];
        // Extract title
        const {
          title: name,
          interval = '@monthly',
          features: tierFeaturesObject,
        } = secondItemTierPlan;
        const featureDefinitions = Object.entries(tierFeaturesObject);

        const basePlan = tierFeaturesObject[TIER_BASE_FEATURE_ID];
        const extraPlan = tierFeaturesObject[TIER_EXTRACOPY_FEATURE_ID];
        const aicopyPlan = tierFeaturesObject[TIER_AICOPY_FEATURE_ID];

        const basePrice = basePlan.base ?? 0;
        const extraUsageRate = extraPlan.tiers?.[0]?.price;

        const baseQuantity = String(aicopyPlan.tiers[0].upto ?? 'unlimited');
        const extraQuantity = String(extraPlan.tiers[0].upto ?? 'unlimited');
        const extraPrice = extraPlan.tiers[0]?.price / 100 || 'unlimited';
        // Filter features
        const features = tierFeatureConstants
          .filter((_featureId) =>
            featureDefinitions?.some((_feature) => _feature[0] === _featureId),
          )
          .map((_featureId) =>
            featureDefinitions?.find(
              (_featureDefinition) => _featureDefinition[0] === _featureId,
            ),
          )
          .map((_filteredFeature) => _filteredFeature?.[1]?.title) as string[];

        // Get promoted field from plan constant
        const promoted = _planConstant.promoted;

        return {
          planId: _planConstant.planId,
          currency: 'usd',
          interval,
          promoted,
          name,
          base: basePrice,
          features,
          baseQuantity,
          extraQuantity,
          extraPrice,
          extraUsageRate,
        };
      }
    })
    .filter((_plan) => _plan);
  return pricingTableData;
};
