import { useMemo, useState } from 'react';
import { CalculatorSection } from './components/CalculatorSection';
import { ComparisonSection } from './components/ComparisonSection';
import { MethodologySection } from './components/MethodologySection';
import {
  calculateSnapStyleValue,
  DEFAULT_MONTHLY_SPEND,
  DEFAULT_PLAN_ID,
  DEFAULT_SAVINGS_RATE,
  PlanId,
} from './lib/calculator';

export default function App() {
  const [monthlySpend, setMonthlySpend] = useState<number>(DEFAULT_MONTHLY_SPEND);
  const [planId, setPlanId] = useState<PlanId>(DEFAULT_PLAN_ID);
  const [savingsRate, setSavingsRate] = useState<number>(DEFAULT_SAVINGS_RATE);
  const [isDefaultRate, setIsDefaultRate] = useState<boolean>(true);

  const handleSavingsRateChange = (newRate: number) => {
    setSavingsRate(newRate);
    setIsDefaultRate(false);
  };

  const handleResetRate = () => {
    setSavingsRate(DEFAULT_SAVINGS_RATE);
    setIsDefaultRate(true);
  };

  const handleResetAll = () => {
    setMonthlySpend(DEFAULT_MONTHLY_SPEND);
    setPlanId(DEFAULT_PLAN_ID);
    setSavingsRate(DEFAULT_SAVINGS_RATE);
    setIsDefaultRate(true);
  };

  const result = useMemo(
    () =>
      calculateSnapStyleValue({
        monthlySpend,
        planId,
        savingsRate,
      }),
    [monthlySpend, planId, savingsRate]
  );

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#141A24]">
      {/* Top Navigation Bar: 3-Zone Contract */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-8 px-6 py-4 lg:px-8">
          {/* Zone 1: Single-line Wordmark */}
          <a
            href="#calculator"
            className="whitespace-nowrap shrink-0 text-xl font-bold tracking-tight text-[#141A24] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0D7A5F]"
          >
            SnapStyle
          </a>

          {/* Zone 2: Concise single-line navigation links */}
          <nav
            aria-label="Primary"
            className="hidden items-center gap-7 text-sm font-medium text-[#475569] md:flex"
          >
            <a
              href="#calculator"
              className="whitespace-nowrap shrink-0 transition-colors hover:text-[#141A24] hover:underline hover:underline-offset-4"
            >
              Calculator
            </a>
            <a
              href="#comparison"
              className="whitespace-nowrap shrink-0 transition-colors hover:text-[#141A24] hover:underline hover:underline-offset-4"
            >
              Plan Breakdown
            </a>
            <a
              href="#how-it-works"
              className="whitespace-nowrap shrink-0 transition-colors hover:text-[#141A24] hover:underline hover:underline-offset-4"
            >
              How It Works
            </a>
            <a
              href="#assumptions"
              className="whitespace-nowrap shrink-0 transition-colors hover:text-[#141A24] hover:underline hover:underline-offset-4"
            >
              Assumptions
            </a>
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="shrink-0">
            <a
              href="#comparison"
              className="inline-flex min-h-[40px] items-center justify-center whitespace-nowrap shrink-0 rounded-md bg-[#E14B28] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#C83D1D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E14B28]"
            >
              Compare Plans
            </a>
          </div>
        </div>
      </header>

      <main>
        <CalculatorSection
          monthlySpend={monthlySpend}
          onMonthlySpendChange={setMonthlySpend}
          planId={planId}
          onPlanChange={setPlanId}
          savingsRate={savingsRate}
          isDefaultRate={isDefaultRate}
          onSavingsRateChange={handleSavingsRateChange}
          onResetRate={handleResetRate}
          onResetAll={handleResetAll}
          result={result}
        />

        <ComparisonSection
          monthlySpend={monthlySpend}
          savingsRate={savingsRate}
          selectedPlanId={planId}
          onSelectPlan={setPlanId}
          isDefaultRate={isDefaultRate}
        />

        <MethodologySection />
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-4 px-6 text-xs text-[#64748B] sm:flex-row sm:items-center lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-[#141A24]">SnapStyle Value Calculator</span>
            <span aria-hidden="true">·</span>
            <span>Static client-side estimator</span>
            <span aria-hidden="true">·</span>
            <span>Benchmark: $105 → $85/month average online clothing spend (Olya, 2024)</span>
          </div>
          <a
            href="#calculator"
            className="whitespace-nowrap font-medium text-[#141A24] hover:underline"
          >
            Back to top
          </a>
        </div>
      </footer>
    </div>
  );
}
