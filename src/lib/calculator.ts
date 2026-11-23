export type PlanId = 'basic' | 'plus' | 'pro';

export interface PlanOption {
  id: PlanId;
  name: string;
  monthlyPrice: number;
  priceLabel: string;
  shortDescription: string;
}

export const DEFAULT_MONTHLY_SPEND = 105; // Olya, 2024 average monthly online clothing spend
export const DEFAULT_SAVINGS_NUMERATOR = 20;
export const DEFAULT_SAVINGS_DENOMINATOR = 105;
export const DEFAULT_SAVINGS_RATE = DEFAULT_SAVINGS_NUMERATOR / DEFAULT_SAVINGS_DENOMINATOR; // Exact fraction 20/105 (~19.0476%)
export const DEFAULT_PLAN_ID: PlanId = 'plus';

export const PLANS: Record<PlanId, PlanOption> = {
  basic: {
    id: 'basic',
    name: 'Basic',
    monthlyPrice: 0,
    priceLabel: 'Free',
    shortDescription: 'Core look matching within your target price range.',
  },
  plus: {
    id: 'plus',
    name: 'Plus',
    monthlyPrice: 4.99,
    priceLabel: '$4.99/month',
    shortDescription: 'Multi-retailer lookalikes, price drops, and fit notes.',
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 9.99,
    priceLabel: '$9.99/month',
    shortDescription: 'Unlimited look matching, priority deals, and time-saving alerts.',
  },
};

export const PLAN_LIST: PlanOption[] = [PLANS.basic, PLANS.plus, PLANS.pro];

export interface CalculatorInput {
  monthlySpend: number;
  planId: PlanId;
  savingsRate: number; // Decimal fraction, e.g. 20 / 105
}

export interface CalculatorResult {
  monthlySpend: number;
  savingsRate: number;
  savingsPercent: number;
  plan: PlanOption;
  estimatedMonthlySavings: number;
  estimatedAnnualSavings: number;
  estimatedSpendWithSnapStyle: number;
  estimatedAnnualSpendWithSnapStyle: number;
  benefitCostRatio: number | null; // null for free Basic tier
  netMonthlyBenefit: number;
  netAnnualBenefit: number;
}

export function calculateSnapStyleValue(input: CalculatorInput): CalculatorResult {
  const safeSpend = Number.isFinite(input.monthlySpend) ? Math.max(0, input.monthlySpend) : 0;
  const safeRate = Number.isFinite(input.savingsRate) ? Math.min(0.9, Math.max(0, input.savingsRate)) : 0;
  const plan = PLANS[input.planId] ?? PLANS[DEFAULT_PLAN_ID];

  const estimatedMonthlySavings = safeSpend * safeRate;
  const estimatedSpendWithSnapStyle = Math.max(0, safeSpend - estimatedMonthlySavings);
  const estimatedAnnualSavings = estimatedMonthlySavings * 12;
  const estimatedAnnualSpendWithSnapStyle = estimatedSpendWithSnapStyle * 12;

  const benefitCostRatio =
    plan.monthlyPrice > 0 ? estimatedMonthlySavings / plan.monthlyPrice : null;

  const netMonthlyBenefit = estimatedMonthlySavings - plan.monthlyPrice;
  const netAnnualBenefit = netMonthlyBenefit * 12;

  return {
    monthlySpend: safeSpend,
    savingsRate: safeRate,
    savingsPercent: safeRate * 100,
    plan,
    estimatedMonthlySavings,
    estimatedAnnualSavings,
    estimatedSpendWithSnapStyle,
    estimatedAnnualSpendWithSnapStyle,
    benefitCostRatio,
    netMonthlyBenefit,
    netAnnualBenefit,
  };
}

export function formatCurrency(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  const isWhole = Math.abs(rounded - Math.round(rounded)) < 0.005;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: isWhole ? 0 : 2,
  }).format(rounded);
}

export function formatCurrencyAlwaysCents(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatRatio(ratio: number): string {
  const roundedOneDecimal = Math.round(ratio * 10) / 10;
  return `${roundedOneDecimal.toFixed(1)}:1`;
}

export function formatPercent(rateDecimal: number): string {
  const pct = rateDecimal * 100;
  return `${pct.toFixed(2).replace(/\.00$/, '')}%`;
}

export function buildValueReportText(
  result: CalculatorResult,
  isDefaultRate: boolean
): string {
  const ratioLine =
    result.benefitCostRatio !== null
      ? `${formatRatio(result.benefitCostRatio)} (${formatCurrencyAlwaysCents(result.benefitCostRatio)} saved per $1 of plan cost)`
      : 'Free — no cost to compare';

  return [
    'SnapStyle Value Calculator — Personalized Estimate',
    '==================================================',
    '',
    'Your Inputs',
    `  Average monthly online clothing spend: ${formatCurrencyAlwaysCents(result.monthlySpend)}`,
    `  Selected SnapStyle plan: ${result.plan.name} (${result.plan.priceLabel})`,
    `  Expected savings rate: ${formatPercent(result.savingsRate)}${isDefaultRate ? ' (Default benchmark: 20/105, Olya 2024)' : ' (Custom assumption)'}`,
    '',
    'Estimated Outcomes',
    `  Estimated monthly spend with SnapStyle: ${formatCurrencyAlwaysCents(result.estimatedSpendWithSnapStyle)} /month`,
    `  Estimated monthly savings:              ${formatCurrencyAlwaysCents(result.estimatedMonthlySavings)} /month (${formatCurrencyAlwaysCents(result.estimatedAnnualSavings)} /year)`,
    `  Savings per $1 of plan cost (BCR):      ${ratioLine}`,
    `  Net benefit after plan subscription:    ${formatCurrencyAlwaysCents(result.netMonthlyBenefit)} /month (${formatCurrencyAlwaysCents(result.netAnnualBenefit)} /year)`,
    '',
    'Calculation Notes & Assumptions',
    '  - Default savings rate (20/105 ≈ 19.05%) is an adjustable estimate based on',
    '    $20 estimated monthly savings on $105 average spend (Olya, 2024).',
    '  - Applies the selected savings rate uniformly across spend levels.',
    '  - Models direct clothing price savings only; excludes Pro time savings and',
    '    extra deals that may add further value.',
    '  - Basic ($0/month) has no subscription fee, so no cost ratio is computed.',
  ].join('\n');
}
