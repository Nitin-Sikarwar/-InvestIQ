import { runCompanyOverviewChain } from "../chains/companyOverview.js";
import { runBusinessAnalysisChain } from "../chains/businessAnalysis.js";
import { runRiskAnalysisChain } from "../chains/riskAnalysis.js";
import { runGrowthAnalysisChain } from "../chains/growthAnalysis.js";
import { runInvestmentDecisionChain } from "../chains/investmentDecision.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function withRetry(fn, retries = 5, delay = 20000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      const is429 = err?.status === 429 || err?.message?.includes("429") || err?.message?.includes("rate");
      if (i < retries - 1 && is429) {
        await sleep(delay);
      } else {
        throw err;
      }
    }
  }
}

export async function runResearchPipeline(company, onProgress) {
  onProgress("stage1", "Researching company overview...");
  const overview = await withRetry(() => runCompanyOverviewChain(company));

  await sleep(8000);
  onProgress("stage2", "Analyzing business fundamentals...");
  const businessAnalysis = await withRetry(() => runBusinessAnalysisChain(company, overview));

  await sleep(8000);
  onProgress("stage3", "Evaluating risks...");
  const riskAnalysis = await withRetry(() => runRiskAnalysisChain(company, { overview, businessAnalysis }));

  await sleep(8000);
  onProgress("stage4", "Assessing growth potential...");
  const growthAnalysis = await withRetry(() => runGrowthAnalysisChain(company, { overview, businessAnalysis, riskAnalysis }));

  await sleep(8000);
  onProgress("stage5", "Making investment decision...");
  const decision = await withRetry(() => runInvestmentDecisionChain(company, {
    overview,
    businessAnalysis,
    riskAnalysis,
    growthAnalysis,
  }));

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
