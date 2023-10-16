import type { PlanName } from 'tier';

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    github: string;
  };
};

export type TierPlanConstant = {
  planId: PlanName;
  promoted: boolean;
};

export type PricingTableData = {
  planId: string;
  currency: string; // usd
  interval: string; // monthly
  promoted: boolean;
  name: string;
  base: number;
  features: string[];
  extraUsageRate?: number | undefined;
  baseQuantity: string;
  extraQuantity: string;
  extraPrice: string;
};

export type CurrentPlan = {
  planId: PlanName;
  currency: string; // usd
  interval: string; // monthly
  name: string;
  base: number;
  extraUsageRate?: number | undefined;
};
