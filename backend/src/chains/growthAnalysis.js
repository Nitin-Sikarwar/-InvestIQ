import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { getLLM } from "../utils/llm.js";

const schema = z.object({
  expansionPlans: z.string().describe("Geographic or product expansion plans"),
  futureOpportunities: z.array(z.string()).describe("Key growth opportunities (3-5 items)"),
  innovation: z.string().describe("R&D and innovation pipeline assessment"),
  aiAdoption: z.string().describe("AI and technology adoption strategy"),
  marketTrends: z.array(z.string()).describe("Favorable market trends (2-4 items)"),
  growthScore: z.number().min(0).max(100).describe("Growth potential score 0-100"),
  timeHorizon: z.enum(["Short-term (1-2 years)", "Medium-term (3-5 years)", "Long-term (5+ years)"]).describe("Best investment time horizon"),
});

const parser = StructuredOutputParser.fromZodSchema(schema);

const prompt = PromptTemplate.fromTemplate(`
You are a growth equity analyst. Evaluate the growth potential and future opportunities for "{company}".
Focus on catalysts, innovation, and market expansion.

Company Context:
{context}

{format_instructions}

Analyze growth potential for: {company}
`);

export async function runGrowthAnalysisChain(company, context) {
  const llm = getLLM();
  const chain = prompt.pipe(llm).pipe(parser);
  return chain.invoke({
    company,
    context: JSON.stringify(context),
    format_instructions: parser.getFormatInstructions(),
  });
}
