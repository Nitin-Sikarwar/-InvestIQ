import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { getLLM } from "../utils/llm.js";

const schema = z.object({
  debtRisk: z.string().describe("Debt levels and financial leverage risk"),
  competitionRisk: z.string().describe("Competitive threats and market disruption risk"),
  marketRisks: z.array(z.string()).describe("Macro and market-level risks (3-4 items)"),
  regulatoryRisks: z.array(z.string()).describe("Regulatory and compliance risks (2-3 items)"),
  operationalRisks: z.array(z.string()).describe("Operational and execution risks (2-3 items)"),
  overallRiskLevel: z.enum(["Low", "Medium", "High"]).describe("Overall risk classification"),
  riskScore: z.number().min(0).max(100).describe("Risk score where 100 = maximum risk"),
});

const parser = StructuredOutputParser.fromZodSchema(schema);

const prompt = PromptTemplate.fromTemplate(`
You are a risk analyst specializing in investment due diligence. Evaluate all risks for "{company}".
Be thorough and conservative in your risk assessment.

Company Context:
{context}

{format_instructions}

Perform risk analysis for: {company}
`);

export async function runRiskAnalysisChain(company, context) {
  const llm = getLLM();
  const chain = prompt.pipe(llm).pipe(parser);
  return chain.invoke({
    company,
    context: JSON.stringify(context),
    format_instructions: parser.getFormatInstructions(),
  });
}
