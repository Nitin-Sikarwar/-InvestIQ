import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { getLLM } from "../utils/llm.js";

const schema = z.object({
  recommendation: z.enum(["INVEST", "PASS"]).describe("Final investment recommendation"),
  confidenceScore: z.number().min(0).max(100).describe("Confidence in recommendation 0-100"),
  riskLevel: z.enum(["Low", "Medium", "High"]).describe("Overall investment risk level"),
  keyBullishFactors: z.array(z.string()).describe("Top reasons to invest (3-5 items)"),
  keyBearishFactors: z.array(z.string()).describe("Top reasons to avoid (3-5 items)"),
  reasoning: z.string().describe("Comprehensive 3-4 paragraph reasoning for the decision"),
  targetInvestorProfile: z.string().describe("Type of investor this suits (e.g., growth, value, income)"),
  verdict: z.string().describe("One powerful sentence final verdict"),
});

const parser = StructuredOutputParser.fromZodSchema(schema);

const prompt = PromptTemplate.fromTemplate(`
You are a Chief Investment Officer making a final investment decision on "{company}".
Synthesize all research stages and make a definitive INVEST or PASS recommendation.
Be decisive, analytical, and justify every aspect of your decision.

Full Research Data:
{researchData}

{format_instructions}

Make the final investment decision for: {company}
`);

export async function runInvestmentDecisionChain(company, researchData) {
  const llm = getLLM();
  const chain = prompt.pipe(llm).pipe(parser);
  return chain.invoke({
    company,
    researchData: JSON.stringify(researchData),
    format_instructions: parser.getFormatInstructions(),
  });
}
