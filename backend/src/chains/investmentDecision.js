import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { getLLM } from "../utils/llm.js";
import { cleanJson } from "../utils/cleanJson.js";

const schema = z.object({
  recommendation: z.enum(["INVEST", "PASS"]).describe("Final investment recommendation"),
  confidenceScore: z.number().min(0).max(100).describe("Confidence in recommendation 0-100"),
  riskLevel: z.enum(["Low", "Medium", "High"]).describe("Overall investment risk level"),
  keyBullishFactors: z.array(z.string()).describe("Top reasons to invest (3 items)"),
  keyBearishFactors: z.array(z.string()).describe("Top reasons to avoid (3 items)"),
  reasoning: z.string().describe("2 paragraph reasoning for the decision"),
  targetInvestorProfile: z.string().describe("Type of investor this suits"),
  verdict: z.string().describe("One sentence final verdict"),
});

const parser = StructuredOutputParser.fromZodSchema(schema);

const prompt = PromptTemplate.fromTemplate(`
You are a Chief Investment Officer. Make a final INVEST or PASS decision on "{company}".
Return ONLY raw JSON with no markdown, no code blocks, no extra text.

Business Score: {businessScore}/100
Risk Level: {riskLevel} (Risk Score: {riskScore}/100)
Growth Score: {growthScore}/100
Key Strengths: {strengths}
Key Risks: {risks}
Growth Opportunities: {opportunities}

{format_instructions}
`);

export async function runInvestmentDecisionChain(company, researchData) {
  const llm = getLLM();
  const result = await prompt.pipe(llm).invoke({
    company,
    businessScore: researchData.businessAnalysis.businessScore,
    riskLevel: researchData.riskAnalysis.overallRiskLevel,
    riskScore: researchData.riskAnalysis.riskScore,
    growthScore: researchData.growthAnalysis.growthScore,
    strengths: researchData.businessAnalysis.strengths.slice(0, 3).join(", "),
    risks: researchData.riskAnalysis.marketRisks.slice(0, 3).join(", "),
    opportunities: researchData.growthAnalysis.futureOpportunities.slice(0, 3).join(", "),
    format_instructions: parser.getFormatInstructions(),
  });
  return parser.parse(cleanJson(result.content));
}
