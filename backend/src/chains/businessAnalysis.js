import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { getLLM } from "../utils/llm.js";

const schema = z.object({
  revenueGrowth: z.string().describe("Revenue growth trend and approximate figures"),
  profitability: z.string().describe("Profitability status and margins"),
  competitiveAdvantages: z.array(z.string()).describe("Key moats and competitive advantages (3-5 items)"),
  marketPosition: z.string().describe("Market share and positioning"),
  strengths: z.array(z.string()).describe("Top business strengths (4-6 items)"),
  weaknesses: z.array(z.string()).describe("Key business weaknesses (3-5 items)"),
  businessScore: z.number().min(0).max(100).describe("Overall business quality score 0-100"),
});

const parser = StructuredOutputParser.fromZodSchema(schema);

const prompt = PromptTemplate.fromTemplate(`
You are a senior business analyst. Analyze the business fundamentals of "{company}".
Use your knowledge to provide a thorough business analysis. Be specific and data-driven where possible.

Company Overview Context:
{overview}

{format_instructions}

Analyze the business fundamentals of: {company}
`);

export async function runBusinessAnalysisChain(company, overview) {
  const llm = getLLM();
  const chain = prompt.pipe(llm).pipe(parser);
  return chain.invoke({
    company,
    overview: JSON.stringify(overview),
    format_instructions: parser.getFormatInstructions(),
  });
}
