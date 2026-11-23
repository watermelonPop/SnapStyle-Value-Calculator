export function MethodologySection() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="border-t border-slate-200/80 bg-[#F7F8FA] py-14 lg:py-16"
    >
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        {/* How SnapStyle Creates Credible Savings */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <h2
              id="how-it-works-heading"
              className="font-serif text-2xl font-semibold tracking-tight text-[#141A24] sm:text-3xl"
              style={{ textWrap: 'balance' }}
            >
              Why These Savings Are Credible
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#475569]">
              Online clothing spend varies widely by shopper, and the savings outcome is
              quantifiable: shifting the average monthly spend from $105 to $85 (Olya,
              2024). SnapStyle delivers that reduction through three practical steps.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:col-span-8">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="text-sm font-semibold text-[#141A24]">
                01. Match the look across retailers
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                Instead of paying full price at a single boutique, SnapStyle surfaces the
                same silhouette, fabric style, and color palette across multiple stores.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="text-sm font-semibold text-[#141A24]">
                02. Stay within your price range
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                Results are filtered to your budget from the start so you find affordable
                lookalikes before anchoring on full-price retail markups.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="text-sm font-semibold text-[#141A24]">
                03. Buy fewer items that miss
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                Better visual and budget matching upfront cuts down on impulse purchases
                and poorly matched orders that waste monthly clothing spend.
              </p>
            </div>
          </div>
        </div>

        {/* Calculation Assumptions & Value Tool Selection */}
        <div
          id="assumptions"
          className="mt-14 border-t border-slate-200/90 pt-12"
        >
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <h2 className="font-serif text-2xl font-semibold tracking-tight text-[#141A24]">
                Calculation Assumptions
              </h2>
              <ul className="mt-4 space-y-3.5 text-sm leading-relaxed text-[#475569]">
                <li>
                  <strong className="font-semibold text-[#141A24]">
                    Visible, adjustable benchmark:
                  </strong>{' '}
                  The default 19.05% rate (stored as the exact fraction{' '}
                  <span className="font-mono text-[#141A24]">20/105</span>, from $20 saved
                  on $105 average monthly spend per Olya, 2024) is an estimate rather than
                  a measured result, so you can adjust it at any time.
                </li>
                <li>
                  <strong className="font-semibold text-[#141A24]">
                    Uniform rate across spend levels:
                  </strong>{' '}
                  For clarity, the calculator applies the same savings rate at every spend
                  level. Because Plus ($4.99/mo) and Pro ($9.99/mo) have fixed prices,
                  lower spenders see a lower savings-to-price ratio.
                </li>
                <li>
                  <strong className="font-semibold text-[#141A24]">
                    Conservative price-savings model:
                  </strong>{' '}
                  Only direct clothing price savings are modeled. Pro users may gain extra
                  time savings and deals that push total benefit above $40/month, which
                  keeps Pro&apos;s displayed ratio intentionally conservative.
                </li>
                <li>
                  <strong className="font-semibold text-[#141A24]">
                    Separate handling for Basic:
                  </strong>{' '}
                  Because Basic is $0/month, a savings-to-cost ratio does not apply, so the
                  summary displays &ldquo;Free, no cost to compare.&rdquo;
                </li>
              </ul>
            </div>

            <div className="lg:col-span-6">
              <h2 className="font-serif text-2xl font-semibold tracking-tight text-[#141A24]">
                Why a Value Calculator
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#475569]">
                Choosing between a Value Calculator, ROI Calculator, Value Scorecard, or
                Value Score depends on whether the outcome can be quantified credibly and
                whether it varies by customer:
              </p>
              <dl className="mt-4 space-y-3 text-sm leading-relaxed text-[#475569]">
                <div className="rounded-md border border-slate-200 bg-white px-4 py-3">
                  <dt className="font-semibold text-[#141A24]">
                    Value Calculator (Chosen)
                  </dt>
                  <dd className="mt-0.5">
                    Quantifiable ($105 → $85/month), varies directly by each shopper&apos;s
                    monthly spend, and credible via multi-retailer lookalike matching.
                  </dd>
                </div>
                <div className="rounded-md border border-slate-200 bg-white px-4 py-3">
                  <dt className="font-semibold text-[#141A24]">
                    Why not a full ROI percentage
                  </dt>
                  <dd className="mt-0.5">
                    SnapStyle&apos;s subscription is $0–$9.99/month rather than a large
                    capital setup cost, so a simple benefit-cost ratio (e.g., 4.0:1 on
                    Plus) is clearer than an annualized ROI percentage.
                  </dd>
                </div>
                <div className="rounded-md border border-slate-200 bg-white px-4 py-3">
                  <dt className="font-semibold text-[#141A24]">
                    When Scorecards or Value Scores apply
                  </dt>
                  <dd className="mt-0.5">
                    Scorecards track behaviors when savings cannot be quantified credibly;
                    Value Scores combine signals into one index when outcomes are hard to
                    measure directly.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
