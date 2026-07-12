function Badge({ text, type }) {
  return <span className={`badge badge-${type}`}>{text}</span>;
}

function Section({ title, icon, children }) {
  return (
    <div className="report-section">
      <h3 className="section-title">
        <span className="section-icon">{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  );
}

function TagList({ items, type = "neutral" }) {
  return (
    <ul className="tag-list">
      {items.map((item, i) => (
        <li key={i} className={`tag-item tag-${type}`}>
          {item}
        </li>
      ))}
    </ul>
  );
}

function ScoreBar({ score, label, color }) {
  return (
    <div className="score-bar-wrap">
      <div className="score-bar-label">
        <span>{label}</span>
        <span className="score-val">{score}/100</span>
      </div>
      <div className="score-bar-track">
        <div
          className="score-bar-fill"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
    </div>
  );
}

export default function InvestmentReport({ report, onReset }) {
  const { company, overview, businessAnalysis, riskAnalysis, growthAnalysis, decision, generatedAt } = report;
  const isInvest = decision.recommendation === "INVEST";

  return (
    <div className="report-container">
      {/* Header */}
      <div className={`report-header ${isInvest ? "invest" : "pass"}`}>
        <div className="report-header-top">
          <div>
            <div className="report-company-label">Investment Research Report</div>
            <h1 className="report-company-name">{company}</h1>
            <div className="report-meta">
              <Badge text={overview.industry} type="industry" />
              <Badge text={overview.headquarters} type="location" />
              <span className="report-date">
                {new Date(generatedAt).toLocaleDateString("en-US", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </span>
            </div>
          </div>
          <div className="verdict-badge-wrap">
            <div className={`verdict-badge ${isInvest ? "invest" : "pass"}`}>
              {isInvest ? "✅ INVEST" : "❌ PASS"}
            </div>
            <div className="confidence-label">
              {decision.confidenceScore}% Confidence
            </div>
          </div>
        </div>

        {/* Verdict */}
        <div className="verdict-statement">
          <span className="quote-mark">"</span>
          {decision.verdict}
          <span className="quote-mark">"</span>
        </div>
      </div>

      {/* Score Cards */}
      <div className="score-cards">
        <div className="score-card">
          <div className="score-card-title">Business Quality</div>
          <ScoreBar score={businessAnalysis.businessScore} label="" color="#6366f1" />
        </div>
        <div className="score-card">
          <div className="score-card-title">Growth Potential</div>
          <ScoreBar score={growthAnalysis.growthScore} label="" color="#10b981" />
        </div>
        <div className="score-card">
          <div className="score-card-title">Risk Level</div>
          <ScoreBar
            score={riskAnalysis.riskScore}
            label=""
            color={riskAnalysis.riskScore > 65 ? "#ef4444" : riskAnalysis.riskScore > 40 ? "#f59e0b" : "#10b981"}
          />
        </div>
        <div className="score-card">
          <div className="score-card-title">Confidence Score</div>
          <ScoreBar score={decision.confidenceScore} label="" color={isInvest ? "#10b981" : "#ef4444"} />
        </div>
      </div>

      <div className="report-body">
        {/* Company Overview */}
        <Section title="Company Overview" icon="🏢">
          <p className="text-body">{overview.description}</p>
          <div className="overview-grid">
            <div className="overview-item"><span className="ov-label">Business Model</span><span>{overview.businessModel}</span></div>
            <div className="overview-item"><span className="ov-label">CEO</span><span>{overview.ceo}</span></div>
            <div className="overview-item"><span className="ov-label">Founded</span><span>{overview.founded}</span></div>
            <div className="overview-item"><span className="ov-label">Market Cap</span><span>{overview.marketCap}</span></div>
          </div>
          <div className="products-wrap">
            <div className="ov-label">Key Products & Services</div>
            <TagList items={overview.products} type="neutral" />
          </div>
        </Section>

        {/* Business Analysis */}
        <Section title="Business Analysis" icon="📊">
          <div className="two-col">
            <div>
              <div className="sub-label">Revenue Growth</div>
              <p className="text-body">{businessAnalysis.revenueGrowth}</p>
            </div>
            <div>
              <div className="sub-label">Profitability</div>
              <p className="text-body">{businessAnalysis.profitability}</p>
            </div>
          </div>
          <div className="sub-label">Market Position</div>
          <p className="text-body">{businessAnalysis.marketPosition}</p>
          <div className="sub-label">Competitive Advantages</div>
          <TagList items={businessAnalysis.competitiveAdvantages} type="positive" />
        </Section>

        {/* Strengths & Weaknesses */}
        <div className="sw-grid">
          <Section title="Strengths" icon="💪">
            <TagList items={businessAnalysis.strengths} type="positive" />
          </Section>
          <Section title="Weaknesses" icon="⚡">
            <TagList items={businessAnalysis.weaknesses} type="negative" />
          </Section>
        </div>

        {/* Risk Analysis */}
        <Section title="Risk Factors" icon="⚠️">
          <div className="risk-level-row">
            <span className="sub-label">Overall Risk:</span>
            <Badge
              text={riskAnalysis.overallRiskLevel}
              type={riskAnalysis.overallRiskLevel === "High" ? "danger" : riskAnalysis.overallRiskLevel === "Medium" ? "warning" : "success"}
            />
          </div>
          <div className="two-col">
            <div>
              <div className="sub-label">Debt Risk</div>
              <p className="text-body">{riskAnalysis.debtRisk}</p>
            </div>
            <div>
              <div className="sub-label">Competition Risk</div>
              <p className="text-body">{riskAnalysis.competitionRisk}</p>
            </div>
          </div>
          <div className="three-col">
            <div>
              <div className="sub-label">Market Risks</div>
              <TagList items={riskAnalysis.marketRisks} type="negative" />
            </div>
            <div>
              <div className="sub-label">Regulatory Risks</div>
              <TagList items={riskAnalysis.regulatoryRisks} type="negative" />
            </div>
            <div>
              <div className="sub-label">Operational Risks</div>
              <TagList items={riskAnalysis.operationalRisks} type="negative" />
            </div>
          </div>
        </Section>

        {/* Growth Analysis */}
        <Section title="Growth Opportunities" icon="🚀">
          <div className="two-col">
            <div>
              <div className="sub-label">Expansion Plans</div>
              <p className="text-body">{growthAnalysis.expansionPlans}</p>
            </div>
            <div>
              <div className="sub-label">Innovation & AI</div>
              <p className="text-body">{growthAnalysis.innovation}</p>
            </div>
          </div>
          <div className="sub-label">AI Adoption Strategy</div>
          <p className="text-body">{growthAnalysis.aiAdoption}</p>
          <div className="two-col">
            <div>
              <div className="sub-label">Future Opportunities</div>
              <TagList items={growthAnalysis.futureOpportunities} type="positive" />
            </div>
            <div>
              <div className="sub-label">Market Trends</div>
              <TagList items={growthAnalysis.marketTrends} type="neutral" />
            </div>
          </div>
          <div className="time-horizon">
            <span className="sub-label">Best Time Horizon: </span>
            <Badge text={growthAnalysis.timeHorizon} type="info" />
          </div>
        </Section>

        {/* Investment Decision */}
        <Section title="Investment Recommendation" icon="💡">
          <div className="decision-grid">
            <div className="decision-col">
              <div className="sub-label">Bullish Factors</div>
              <TagList items={decision.keyBullishFactors} type="positive" />
            </div>
            <div className="decision-col">
              <div className="sub-label">Bearish Factors</div>
              <TagList items={decision.keyBearishFactors} type="negative" />
            </div>
          </div>
          <div className="sub-label">Analyst Reasoning</div>
          <p className="text-body reasoning">{decision.reasoning}</p>
          <div className="investor-profile">
            <span className="sub-label">Target Investor Profile: </span>
            <span>{decision.targetInvestorProfile}</span>
          </div>
        </Section>

        {/* Final Verdict */}
        <div className={`final-verdict ${isInvest ? "invest" : "pass"}`}>
          <div className="final-verdict-inner">
            <div className="final-label">Final Verdict</div>
            <div className={`final-recommendation ${isInvest ? "invest" : "pass"}`}>
              {isInvest ? "✅ INVEST" : "❌ PASS"}
            </div>
            <div className="final-meta">
              <span>Risk Level: <strong>{decision.riskLevel}</strong></span>
              <span>Confidence: <strong>{decision.confidenceScore}%</strong></span>
            </div>
          </div>
        </div>

        <div className="disclaimer">
          ⚠️ This report is AI-generated for informational purposes only and does not constitute financial advice.
          Always conduct your own due diligence before making investment decisions.
        </div>

        <button className="new-research-btn" onClick={onReset}>
          ← Research Another Company
        </button>
      </div>
    </div>
  );
}
