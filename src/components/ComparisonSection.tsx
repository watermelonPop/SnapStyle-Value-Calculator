import {
  calculateSnapStyleValue,
  formatCurrency,
  formatCurrencyAlwaysCents,
  formatPercent,
  formatRatio,
  PLAN_LIST,
  PlanId,
} from '../lib/calculator';

interface ComparisonSectionProps {
  monthlySpend: number;
  savingsRate: number;
  selectedPlanId: PlanId;
  onSelectPlan: (planId: PlanId) => void;
  isDefaultRate: boolean;
}

export function ComparisonSection({
  monthlySpend,
  savingsRate,
  selectedPlanId,
  onSelectPlan,
  isDefaultRate,
}: ComparisonSectionProps) {
  const tierResults = PLAN_LIST.map((plan) =>
    calculateSnapStyleValue({
      monthlySpend,
      planId: plan.id,
      savingsRate,
    })
  );

  const activeResult =
    tierResults.find((item) => item.plan.id === selectedPlanId) ?? tierResults[1];

  return (
    <section
      id="comparison"
      aria-labelledby="comparison-heading"
      className="border-t border-slate-200/80 bg-white py-14 lg:py-16"
    >
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2
              id="comparison-heading"
              className="font-serif text-2xl font-semibold tracking-tight text-[#141A24] sm:text-3xl"
            >
              Side-by-Side Plan Breakdown
            </h2>
            <p className="mt-2 max-w-[64ch] text-sm leading-relaxed text-[#475569]">
              Comparing all three SnapStyle tiers at your current{' '}
              <span className="font-mono font-medium tabular-nums text-[#141A24]">
                {formatCurrency(monthlySpend)}/month
              </span>{' '}
              spend and{' '}
              <span className="font-mono font-medium tabular-nums text-[#141A24]">
                {formatPercent(savingsRate)}
              </span>{' '}
              estimated savings rate.
            </p>
          </div>
          <p className="text-xs text-[#64748B]">
            Click any plan row to preview it in the calculator above.
          </p>
        </div>

        {/* Responsive Comparison Table */}
        <div className="mt-8 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[680px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-[#F7F8FA] text-xs font-semibold text-[#475569]">
                <th scope="col" className="px-5 py-3.5">
                  SnapStyle Plan
                </th>
                <th scope="col" className="px-5 py-3.5 text-right">
                  Plan Price
                </th>
                <th scope="col" className="px-5 py-3.5 text-right">
                  Spend with SnapStyle
                </th>
                <th scope="col" className="px-5 py-3.5 text-right">
                  Monthly Savings
                </th>
                <th scope="col" className="px-5 py-3.5 text-right">
                  Savings per $1 (BCR)
                </th>
                <th scope="col" className="px-5 py-3.5 text-right">
                  Net Benefit / Month
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {tierResults.map((row) => {
                const isSelected = row.plan.id === selectedPlanId;
                return (
                  <tr
                    key={row.plan.id}
                    onClick={() => onSelectPlan(row.plan.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#0D7A5F]/[0.06] hover:bg-[#0D7A5F]/[0.09]'
                        : 'bg-white hover:bg-slate-50'
                    }`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#141A24]">
                          {row.plan.name}
                        </span>
                        {isSelected && (
                          <span className="text-xs font-medium text-[#0D7A5F]">
                            · Selected
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-[#64748B]">
                        {row.plan.shortDescription}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-right font-mono tabular-nums text-[#334155]">
                      {row.plan.monthlyPrice === 0
                        ? 'Free ($0)'
                        : `$${row.plan.monthlyPrice.toFixed(2)}/mo`}
                    </td>
                    <td className="px-5 py-4 text-right font-mono font-semibold tabular-nums text-[#141A24]">
                      {formatCurrency(row.estimatedSpendWithSnapStyle)}/mo
                    </td>
                    <td className="px-5 py-4 text-right font-mono font-semibold tabular-nums text-[#0D7A5F]">
                      {formatCurrency(row.estimatedMonthlySavings)}/mo
                    </td>
                    <td className="px-5 py-4 text-right font-mono tabular-nums text-[#141A24]">
                      {row.benefitCostRatio !== null ? (
                        <span className="font-semibold text-[#0D7A5F]">
                          {formatRatio(row.benefitCostRatio)}
                        </span>
                      ) : (
                        <span className="font-sans text-xs font-medium text-[#64748B]">
                          Free, no cost to compare
                        </span>
                      )}
                    </td>
                    <td
                      className={`px-5 py-4 text-right font-mono font-semibold tabular-nums ${
                        row.netMonthlyBenefit >= 0 ? 'text-[#0D7A5F]' : 'text-[#B45309]'
                      }`}
                    >
                      {row.netMonthlyBenefit >= 0 ? '+' : ''}
                      {formatCurrency(row.netMonthlyBenefit)}/mo
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Live Calculation Formula Walkthrough */}
        <div className="mt-8 rounded-lg border border-slate-200 bg-[#F7F8FA] p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-sm font-semibold text-[#141A24]">
              Live Calculation Formula ({activeResult.plan.name} Plan)
            </h3>
            <span className="font-mono text-xs text-[#64748B]">
              {isDefaultRate
                ? 'Default rate r = 20 ÷ 105 ≈ 19.05% (Olya, 2024)'
                : `Custom rate r = ${formatPercent(savingsRate)}`}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-md border border-slate-200 bg-white p-4">
              <div className="text-xs font-medium text-[#64748B]">
                1. Estimated monthly savings
              </div>
              <div className="mt-1.5 font-mono text-sm tabular-nums text-[#141A24]">
                {formatCurrency(monthlySpend)} × {formatPercent(savingsRate)} ={' '}
                <strong className="text-[#0D7A5F]">
                  {formatCurrencyAlwaysCents(activeResult.estimatedMonthlySavings)}
                </strong>
              </div>
            </div>

            <div className="rounded-md border border-slate-200 bg-white p-4">
              <div className="text-xs font-medium text-[#64748B]">
                2. Monthly spend with SnapStyle
              </div>
              <div className="mt-1.5 font-mono text-sm tabular-nums text-[#141A24]">
                {formatCurrency(monthlySpend)} −{' '}
                {formatCurrencyAlwaysCents(activeResult.estimatedMonthlySavings)} ={' '}
                <strong>
                  {formatCurrencyAlwaysCents(activeResult.estimatedSpendWithSnapStyle)}
                </strong>
              </div>
            </div>

            <div className="rounded-md border border-slate-200 bg-white p-4">
              <div className="text-xs font-medium text-[#64748B]">
                3. Savings per $1 of plan cost
              </div>
              <div className="mt-1.5 font-mono text-sm tabular-nums text-[#141A24]">
                {activeResult.benefitCostRatio !== null ? (
                  <>
                    {formatCurrencyAlwaysCents(activeResult.estimatedMonthlySavings)} ÷{' '}
                    ${activeResult.plan.monthlyPrice.toFixed(2)} ={' '}
                    <strong className="text-[#0D7A5F]">
                      {formatRatio(activeResult.benefitCostRatio)}
                    </strong>
                  </>
                ) : (
                  <span className="font-sans text-xs font-medium text-[#475569]">
                    Basic is $0/month — free, no cost to compare
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
