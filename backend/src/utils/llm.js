import { ChatGroq } from "@langchain/groq";

let llmInstance = null;

export function getLLM() {
  if (!llmInstance) {
    llmInstance = new ChatGroq({
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return llmInstance;
}
