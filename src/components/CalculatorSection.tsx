import { useState } from 'react';
import { Check, Download, RotateCcw } from 'lucide-react';
import {
  buildValueReportText,
  CalculatorResult,
  DEFAULT_MONTHLY_SPEND,
  formatCurrency,
  formatCurrencyAlwaysCents,
  formatPercent,
  formatRatio,
  PLAN_LIST,
  PlanId,
} from '../lib/calculator';
import { InfoTooltip } from './InfoTooltip';

interface CalculatorSectionProps {
  monthlySpend: number;
  onMonthlySpendChange: (value: number) => void;
  planId: PlanId;
  onPlanChange: (planId: PlanId) => void;
  savingsRate: number;
  isDefaultRate: boolean;
  onSavingsRateChange: (rate: number) => void;
  onResetRate: () => void;
  onResetAll: () => void;
  result: CalculatorResult;
}

const SPEND_BENCHMARKS = [
  { label: '$60 · Light', value: 60 },
  { label: '$105 · Average', value: 105 },
  { label: '$200 · Frequent', value: 200 },
];

export function CalculatorSection({
  monthlySpend,
  onMonthlySpendChange,
  planId,
  onPlanChange,
  savingsRate,
  isDefaultRate,
  onSavingsRateChange,
  onResetRate,
  onResetAll,
  result,
}: CalculatorSectionProps) {
  const [downloaded, setDownloaded] = useState(false);

  const handleSpendInput = (raw: string) => {
    const cleaned = raw.replace(/[^0-9.]/g, '');
    if (cleaned === '') {
      onMonthlySpendChange(0);
      return;
    }
    const parsed = Number.parseFloat(cleaned);
    if (!Number.isNaN(parsed)) {
      onMonthlySpendChange(Math.min(2000, Math.max(0, parsed)));
    }
  };

  const handleRateInput = (raw: string) => {
    const cleaned = raw.replace(/[^0-9.]/g, '');
    if (cleaned === '') {
      onSavingsRateChange(0);
      return;
    }
    const parsed = Number.parseFloat(cleaned);
    if (!Number.isNaN(parsed)) {
      onSavingsRateChange(Math.min(60, Math.max(0, parsed)) / 100);
    }
  };

  const handleDownloadReport = () => {
    const reportText = buildValueReportText(result, isDefaultRate);
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `snapstyle-value-estimate-${result.plan.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 2400);
  };

  const isPristineDefaults =
    monthlySpend === DEFAULT_MONTHLY_SPEND && planId === 'plus' && isDefaultRate;

  const ratePercentValue = Number((savingsRate * 100).toFixed(2));
  const netBenefitPositive = result.netMonthlyBenefit >= 0;

  return (
    <section
      id="calculator"
      aria-labelledby="calculator-heading"
      className="mx-auto max-w-[1200px] px-6 pb-16 pt-10 lg:px-8 lg:pt-14"
    >
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Left Column: Customer & Assumption Inputs (mirroring "Your Marketing Settings") */}
        <div className="lg:col-span-7">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h1
              id="calculator-heading"
              className="text-3xl font-bold tracking-tight text-[#141A24] sm:text-[34px]"
              style={{ textWrap: 'balance' }}
            >
              Your Shopping Settings
            </h1>
            {!isPristineDefaults && (
              <button
                type="button"
                onClick={onResetAll}
                className="inline-flex min-h-[40px] items-center gap-1.5 text-sm font-medium text-[#0D7A5F] underline decoration-[#0D7A5F]/40 underline-offset-4 transition-colors hover:text-[#095C47] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D7A5F]"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Reset to defaults
              </button>
            )}
          </div>

          <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-[#475569]">
            Add your average monthly online clothing spend to estimate how much you can save
            with SnapStyle. SnapStyle lowers spend by matching the look you want within your
            price range across multiple retailers—helping you find affordable lookalikes and
            buy fewer items that miss.
          </p>

          <div className="mt-8 space-y-8">
            {/* Input 1: Average monthly online clothing spend */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label
                  htmlFor="monthly-spend-input"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E293B]"
                >
                  <span>Average monthly online clothing spend</span>
                  <InfoTooltip
                    label="About average monthly online clothing spend"
                    content="Defaults to $105/month, the average online clothing spend benchmark (Olya, 2024). Enter your own monthly average to see how savings scale."
                  />
                </label>

                <span className="font-mono text-xs tabular-nums text-[#64748B]">
                  {formatCurrency(monthlySpend)}/month
                </span>
              </div>

              <div className="mt-2.5 grid grid-cols-1 gap-4 sm:grid-cols-12 sm:items-center">
                <div className="relative sm:col-span-5">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-medium text-[#475569]"
                  >
                    $
                  </span>
                  <input
                    id="monthly-spend-input"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={2000}
                    step={5}
                    value={monthlySpend === 0 ? '' : monthlySpend}
                    placeholder="105"
                    onChange={(e) => handleSpendInput(e.target.value)}
                    className="h-12 w-full rounded-md border-[1.5px] border-[#0D7A5F]/70 bg-white pl-8 pr-4 font-mono text-base font-medium tabular-nums text-[#141A24] shadow-xs transition-colors focus:border-[#0D7A5F] focus:outline-none focus:ring-2 focus:ring-[#0D7A5F]/20"
                  />
                </div>

                <div className="sm:col-span-7">
                  <input
                    type="range"
                    aria-label="Adjust average monthly online clothing spend"
                    min={20}
                    max={400}
                    step={5}
                    value={Math.min(400, Math.max(20, monthlySpend))}
                    onChange={(e) => onMonthlySpendChange(Number(e.target.value))}
                    className="snap-range w-full"
                  />
                  <div className="mt-1.5 flex justify-between font-mono text-[11px] tabular-nums text-[#64748B]">
                    <span>$20</span>
                    <span>$105 avg</span>
                    <span>$250</span>
                    <span>$400+</span>
                  </div>
                </div>
              </div>

              {/* Quick customer profiles showing variance */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs text-[#64748B]">Compare shopper profiles:</span>
                {SPEND_BENCHMARKS.map((preset) => {
                  const active = monthlySpend === preset.value;
                  return (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => onMonthlySpendChange(preset.value)}
                      className={`min-h-[34px] whitespace-nowrap shrink-0 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D7A5F] ${
                        active
                          ? 'border-[#0D7A5F] bg-[#0D7A5F]/8 text-[#0D7A5F]'
                          : 'border-slate-300 bg-white text-[#334155] hover:border-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input 2: SnapStyle Plan Selection */}
            <div>
              <div className="flex items-center gap-1.5">
                <span
                  id="plan-selector-label"
                  className="text-sm font-semibold text-[#1E293B]"
                >
                  SnapStyle plan
                </span>
                <InfoTooltip
                  label="About SnapStyle plans"
                  content="Select Basic (Free), Plus ($4.99/month, default), or Pro ($9.99/month) to compare estimated clothing savings against subscription cost."
                />
              </div>

              <div
                role="radiogroup"
                aria-labelledby="plan-selector-label"
                className="mt-2.5 grid grid-cols-1 gap-3 sm:grid-cols-3"
              >
                {PLAN_LIST.map((option) => {
                  const selected = option.id === planId;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => onPlanChange(option.id)}
                      className={`flex min-h-[76px] flex-col justify-between rounded-md border-[1.5px] p-3.5 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D7A5F] ${
                        selected
                          ? 'border-[#0D7A5F] bg-white shadow-xs ring-2 ring-[#0D7A5F]/15'
                          : 'border-slate-300 bg-white/80 hover:border-slate-400 hover:bg-white'
                      }`}
                    >
                      <div className="flex w-full items-baseline justify-between gap-2">
                        <span className="text-sm font-semibold text-[#141A24]">
                          {option.name}
                        </span>
                        <span
                          className={`font-mono text-xs font-medium tabular-nums ${
                            selected ? 'text-[#0D7A5F]' : 'text-[#475569]'
                          }`}
                        >
                          {option.monthlyPrice === 0
                            ? 'Free'
                            : `$${option.monthlyPrice.toFixed(2)}/mo`}
                        </span>
                      </div>
                      <span className="mt-1.5 text-xs leading-snug text-[#64748B]">
                        {option.shortDescription}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input 3: Adjustable Default Assumption — Expected savings rate */}
            <div className="border-t border-slate-200/90 pt-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label
                  htmlFor="savings-rate-input"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E293B]"
                >
                  <span>Expected savings rate</span>
                  <InfoTooltip
                    label="About expected savings rate assumption"
                    content="Stored by default as the exact fraction 20/105 (≈ 19.05%), representing $20 estimated monthly savings on the $105 average spend (Olya, 2024). Because this is an estimate rather than a measured guarantee, you can adjust it freely."
                  />
                </label>

                <div className="flex items-center gap-3">
                  {!isDefaultRate && (
                    <button
                      type="button"
                      onClick={onResetRate}
                      className="text-xs font-medium text-[#0D7A5F] underline decoration-[#0D7A5F]/40 underline-offset-4 hover:text-[#095C47]"
                    >
                      Reset to 19.05% ($20/$105)
                    </button>
                  )}
                  <span className="font-mono text-xs tabular-nums text-[#64748B]">
                    {isDefaultRate ? 'Default: 20/105 (≈ 19.05%)' : 'Custom estimate'}
                  </span>
                </div>
              </div>

              <div className="mt-2.5 grid grid-cols-1 gap-4 sm:grid-cols-12 sm:items-center">
                <div className="relative sm:col-span-5">
                  <input
                    id="savings-rate-input"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={60}
                    step={0.5}
                    value={ratePercentValue}
                    onChange={(e) => handleRateInput(e.target.value)}
                    className="h-12 w-full rounded-md border border-slate-300 bg-white pl-3.5 pr-9 font-mono text-base font-medium tabular-nums text-[#141A24] transition-colors focus:border-[#0D7A5F] focus:outline-none focus:ring-2 focus:ring-[#0D7A5F]/20"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-[#64748B]"
                  >
                    %
                  </span>
                </div>

                <div className="sm:col-span-7">
                  <input
                    type="range"
                    aria-label="Adjust expected savings rate percentage"
                    min={5}
                    max={40}
                    step={0.5}
                    value={Math.min(40, Math.max(5, ratePercentValue))}
                    onChange={(e) => onSavingsRateChange(Number(e.target.value) / 100)}
                    className="snap-range w-full"
                  />
                  <div className="mt-1.5 flex justify-between font-mono text-[11px] tabular-nums text-[#64748B]">
                    <span>5% conservative</span>
                    <span>19.05% benchmark</span>
                    <span>40%</span>
                  </div>
                </div>
              </div>

              <p className="mt-2.5 text-xs leading-relaxed text-[#64748B]">
                Adjustable assumption: $20 estimated monthly savings on $105 average spend
                (stored as <span className="font-mono text-[#334155]">20/105</span>, so $105
                yields exactly <span className="font-mono text-[#334155]">$85</span>).
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Results Summary Card (mirroring screenshot's "Results Summary") */}
        <div className="lg:col-span-5">
          <h2 className="text-center font-serif text-[32px] font-medium tracking-tight text-[#141A24] sm:text-[36px]">
            Results Summary
          </h2>

          <div className="mt-4 rounded-xl border border-slate-200/90 bg-white p-6 shadow-[0_8px_28px_rgba(15,23,42,0.06)] sm:p-8">
            {/* Hero Output 1: Estimated monthly online clothing spend with SnapStyle */}
            <div className="text-center">
              <p className="text-xs font-semibold tracking-[0.06em] text-[#475569]">
                Estimated monthly clothing spend
              </p>

              <div className="mt-2 flex items-baseline justify-center gap-1">
                <span
                  data-testid="hero-spend-output"
                  className="font-serif text-5xl font-semibold tracking-tight tabular-nums text-[#141A24]"
                >
                  {formatCurrency(result.estimatedSpendWithSnapStyle)}
                </span>
                <span className="font-serif text-lg text-[#475569]">/month</span>
              </div>

              <div className="mt-2 inline-flex items-center justify-center gap-1.5 text-sm font-medium text-[#1E293B]">
                <span className="underline decoration-slate-400 underline-offset-4">
                  with SnapStyle {result.plan.name} (
                  {result.plan.monthlyPrice === 0
                    ? 'Free'
                    : `$${result.plan.monthlyPrice.toFixed(2)}/mo`}
                  )
                </span>
                <InfoTooltip
                  label="How this spend estimate is calculated"
                  content={`Calculated as ${formatCurrency(result.monthlySpend)} × (1 − ${formatPercent(result.savingsRate)}) = ${formatCurrencyAlwaysCents(result.estimatedSpendWithSnapStyle)} per month.`}
                />
              </div>
            </div>

            <hr className="my-6 border-slate-200" />

            {/* Core Outputs & Supporting Breakdown Rows */}
            <dl className="space-y-5">
              {/* Output 2: Estimated monthly savings */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <dt className="text-sm font-medium text-[#1E293B]">
                    Estimated monthly savings
                  </dt>
                  <dd className="mt-0.5 text-xs text-[#64748B]">
                    {formatCurrency(result.monthlySpend)} current spend minus{' '}
                    {formatCurrency(result.estimatedSpendWithSnapStyle)}
                  </dd>
                </div>
                <div className="text-right">
                  <div className="font-mono text-base font-semibold tabular-nums text-[#0D7A5F]">
                    {formatCurrency(result.estimatedMonthlySavings)}/mo
                  </div>
                  <div className="mt-0.5 font-mono text-xs tabular-nums text-[#475569]">
                    -{formatPercent(result.savingsRate)} ·{' '}
                    {formatCurrency(result.estimatedAnnualSavings)}/yr
                  </div>
                </div>
              </div>

              {/* Output 3: Benefit-Cost Ratio (Savings per $1 of plan cost) */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <dt className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1E293B]">
                    <span>Savings per $1 of plan cost</span>
                    <InfoTooltip
                      label="About benefit-cost ratio"
                      content="Estimated monthly savings divided by monthly plan price. Paid plans (Plus $4.99, Pro $9.99) show a benefit-cost ratio; Basic is free, so there is no subscription cost to compare."
                    />
                  </dt>
                  <dd className="mt-0.5 text-xs text-[#64748B]">
                    Benefit-cost ratio ({result.plan.name})
                  </dd>
                </div>
                <div className="text-right">
                  {result.benefitCostRatio !== null ? (
                    <>
                      <div
                        data-testid="bcr-output"
                        className="font-mono text-base font-semibold tabular-nums text-[#0D7A5F]"
                      >
                        {formatRatio(result.benefitCostRatio)}
                      </div>
                      <div className="mt-0.5 font-mono text-xs tabular-nums text-[#475569]">
                        {formatCurrencyAlwaysCents(result.benefitCostRatio)} saved per $1
                      </div>
                    </>
                  ) : (
                    <div
                      data-testid="bcr-output"
                      className="text-sm font-semibold text-[#0D7A5F]"
                    >
                      Free, no cost to compare
                    </div>
                  )}
                </div>
              </div>

              {/* Supporting Output: Net benefit after plan subscription */}
              <div className="flex items-start justify-between gap-4 border-t border-slate-100 pt-4">
                <div>
                  <dt className="text-sm font-medium text-[#1E293B]">
                    Net savings after plan fee
                  </dt>
                  <dd className="mt-0.5 text-xs text-[#64748B]">
                    {formatCurrency(result.estimatedMonthlySavings)} saved minus{' '}
                    {result.plan.monthlyPrice === 0
                      ? '$0'
                      : `$${result.plan.monthlyPrice.toFixed(2)}`}{' '}
                    plan
                  </dd>
                </div>
                <div className="text-right">
                  <div
                    className={`font-mono text-base font-semibold tabular-nums ${
                      netBenefitPositive ? 'text-[#0D7A5F]' : 'text-[#B45309]'
                    }`}
                  >
                    {netBenefitPositive ? '+' : ''}
                    {formatCurrency(result.netMonthlyBenefit)}/mo
                  </div>
                  <div className="mt-0.5 font-mono text-xs tabular-nums text-[#475569]">
                    {netBenefitPositive ? '+' : ''}
                    {formatCurrency(result.netAnnualBenefit)}/year
                  </div>
                </div>
              </div>
            </dl>

            {/* Primary CTA & Secondary Link (mirroring screenshot button hierarchy) */}
            <div className="mt-7 flex flex-col items-center gap-3.5">
              <button
                type="button"
                onClick={handleDownloadReport}
                className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-md bg-[#E14B28] px-6 py-3 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#C83D1D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E14B28]"
              >
                {downloaded ? (
                  <>
                    <Check className="h-4 w-4" aria-hidden="true" />
                    <span>Value report downloaded</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" aria-hidden="true" />
                    <span>Download your value report</span>
                  </>
                )}
              </button>

              <a
                href="#comparison"
                className="whitespace-nowrap text-sm font-semibold text-[#141A24] underline decoration-[#E14B28] decoration-2 underline-offset-4 transition-colors hover:text-[#E14B28] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D7A5F]"
              >
                Explore your full plan breakdown
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
