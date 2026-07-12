import { runCompanyOverviewChain } from "../chains/companyOverview.js";
import { runBusinessAnalysisChain } from "../chains/businessAnalysis.js";
import { runRiskAnalysisChain } from "../chains/riskAnalysis.js";
import { runGrowthAnalysisChain } from "../chains/growthAnalysis.js";
import { runInvestmentDecisionChain } from "../chains/investmentDecision.js";

/**
 * Orchestrates the full 5-stage AI investment research pipeline.
 * Each stage builds on the previous, passing accumulated context forward.
 */
export async function runResearchPipeline(company, onProgress) {
  onProgress("stage1", "Researching company overview...");
  const overview = await runCompanyOverviewChain(company);

  onProgress("stage2", "Analyzing business fundamentals...");
  const businessAnalysis = await runBusinessAnalysisChain(company, overview);

  onProgress("stage3", "Evaluating risks...");
  const riskAnalysis = await runRiskAnalysisChain(company, { overview, businessAnalysis });

  onProgress("stage4", "Assessing growth potential...");
  const growthAnalysis = await runGrowthAnalysisChain(company, { overview, businessAnalysis, riskAnalysis });

  onProgress("stage5", "Making investment decision...");
  const decision = await runInvestmentDecisionChain(company, {
    overview,
    businessAnalysis,
    riskAnalysis,
    growthAnalysis,
  });

  return {
    company,
    generatedAt: new Date().toISOString(),
    overview,
    businessAnalysis,
    riskAnalysis,
    growthAnalysis,
    decision,
  };
}
