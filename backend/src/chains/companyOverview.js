import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { getLLM } from "../utils/llm.js";

const schema = z.object({
  description: z.string().describe("Brief company description (2-3 sentences)"),
  industry: z.string().describe("Primary industry sector"),
  businessModel: z.string().describe("How the company makes money"),
  products: z.array(z.string()).describe("Main products or services (3-5 items)"),
  headquarters: z.string().describe("City, Country"),
  ceo: z.string().describe("CEO name or 'Not available'"),
  founded: z.string().describe("Year founded or 'Unknown'"),
  marketCap: z.string().describe("Approximate market cap or 'Unknown'"),
});

const parser = StructuredOutputParser.fromZodSchema(schema);

const prompt = PromptTemplate.fromTemplate(`
You are a financial research analyst. Research the company "{company}" and provide factual information.
If you are not confident about specific data, provide your best estimate based on general knowledge.

{format_instructions}

Company to research: {company}
`);

export async function runCompanyOverviewChain(company) {
  const llm = getLLM();
  const chain = prompt.pipe(llm).pipe(parser);
  return chain.invoke({
    company,
    format_instructions: parser.getFormatInstructions(),
  });
}
