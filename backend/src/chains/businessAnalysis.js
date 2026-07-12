import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { getLLM } from "../utils/llm.js";
import { cleanJson } from "../utils/cleanJson.js";

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
Return ONLY raw JSON with no markdown, no code blocks, no extra text.

Company Overview Context:
{overview}

{format_instructions}

Analyze the business fundamentals of: {company}
`);

export async function runBusinessAnalysisChain(company, overview) {
  const llm = getLLM();
  const result = await prompt.pipe(llm).invoke({
    company,
    overview: JSON.stringify(overview),
    format_instructions: parser.getFormatInstructions(),
  });
  return parser.parse(cleanJson(result.content));
}
