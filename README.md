# InvestIQ — AI Investment Research Agent

An AI-powered investment research application that analyzes any company across 5 research dimensions and delivers a professional **INVEST** or **PASS** recommendation with detailed reasoning.

---

## Overview

InvestIQ simulates a senior investment analyst by running a multi-stage AI research pipeline powered by GPT-4 and LangChain.js. Users enter a company name and receive a structured investment report covering business fundamentals, risks, growth potential, and a final verdict.

---

## Features

- **5-Stage AI Research Pipeline** — Company Overview → Business Analysis → Risk Evaluation → Growth Assessment → Investment Decision
- **Real-time Progress Streaming** — Server-Sent Events stream each research stage to the UI as it completes
- **Structured Output** — Each stage uses Zod schemas + LangChain structured output parsers for reliable, typed data
- **Professional Report UI** — Score bars, tag lists, risk badges, and a clear INVEST/PASS verdict
- **Quick Examples** — One-click research for Tesla, Apple, Nvidia, Palantir, Shopify
- **Responsive Design** — Works on desktop and mobile
- **Error Handling** — Graceful handling of invalid companies and API failures

---

## Architecture

```
User → React Frontend
         ↓ POST /api/research (SSE)
       Node.js + Express Backend
         ↓
       LangChain Pipeline
         ├── Stage 1: Company Overview Chain    (StructuredOutputParser + Zod)
         ├── Stage 2: Business Analysis Chain   (StructuredOutputParser + Zod)
         ├── Stage 3: Risk Analysis Chain       (StructuredOutputParser + Zod)
         ├── Stage 4: Growth Analysis Chain     (StructuredOutputParser + Zod)
         └── Stage 5: Investment Decision Chain (StructuredOutputParser + Zod)
         ↓
       SSE events streamed back → React renders report
```

Each chain receives the accumulated context from all previous stages, enabling the AI to make increasingly informed decisions.

---

## Project Structure

```
Inside_projec/
├── backend/
│   ├── src/
│   │   ├── chains/
│   │   │   ├── companyOverview.js      # Stage 1 — Company facts
│   │   │   ├── businessAnalysis.js     # Stage 2 — Business fundamentals
│   │   │   ├── riskAnalysis.js         # Stage 3 — Risk assessment
│   │   │   ├── growthAnalysis.js       # Stage 4 — Growth potential
│   │   │   └── investmentDecision.js   # Stage 5 — Final INVEST/PASS
│   │   ├── routes/
│   │   │   └── research.js             # POST /api/research (SSE endpoint)
│   │   ├── utils/
│   │   │   ├── llm.js                  # ChatOpenAI singleton
│   │   │   └── pipeline.js             # Pipeline orchestrator
│   │   └── index.js                    # Express app entry point
│   ├── .env                            # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchForm.js           # Company input + submit button
│   │   │   ├── ProgressTracker.js      # 5-stage progress visualization
│   │   │   └── InvestmentReport.js     # Full report renderer
│   │   ├── hooks/
│   │   │   └── useResearch.js          # Research state management hook
│   │   ├── utils/
│   │   │   └── api.js                  # SSE streaming client
│   │   ├── App.js                      # Root component + routing logic
│   │   ├── App.css                     # All styles
│   │   └── index.js                    # React entry point
│   └── package.json
│
└── README.md
```

---

## Installation

### Prerequisites
- Node.js 18+
- OpenAI API key

### Backend

```bash
cd backend
npm install --legacy-peer-deps
```

### Frontend

```bash
cd frontend
npm install
```

---

## Running the Project

### 1. Configure Environment

Edit `backend/.env`:

```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
```

### 2. Start Backend

```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### 3. Start Frontend

```bash
cd frontend
npm start
# App opens at http://localhost:3000
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | Yes | Your OpenAI API key from platform.openai.com |
| `PORT` | No | Backend port (default: 5000) |

---

## How the AI Works

### Pipeline Stages

| Stage | Chain | Output |
|---|---|---|
| 1 | Company Overview | Description, industry, business model, CEO, products |
| 2 | Business Analysis | Revenue growth, profitability, strengths, weaknesses, score |
| 3 | Risk Analysis | Debt, competition, market/regulatory/operational risks, risk level |
| 4 | Growth Analysis | Expansion plans, innovation, AI adoption, growth score |
| 5 | Investment Decision | INVEST/PASS, confidence score, reasoning, verdict |

### Context Accumulation

Each stage receives the full output of all previous stages as context. This means the Investment Decision chain has access to all 4 prior research stages, enabling holistic reasoning.

### Structured Outputs

Every chain uses `StructuredOutputParser` with Zod schemas. This ensures the LLM returns valid, typed JSON that maps directly to React component props — no post-processing needed.

### Streaming

The backend uses Server-Sent Events (SSE) over a POST request. Progress events are emitted after each stage completes, and the final `result` event carries the complete report. This gives users real-time feedback during the ~30-60 second research process.

---

## Key Design Decisions

**SSE over WebSockets** — SSE is simpler for unidirectional server→client streaming and works natively with `fetch`. No socket library needed.

**Zod schemas per stage** — Enforces structured output at the type level. If the LLM returns malformed JSON, LangChain's parser retries automatically.

**Context accumulation** — Passing all prior stage outputs as context to each subsequent chain improves coherence. The final decision chain has the richest context.

**LLM singleton** — A single `ChatOpenAI` instance is reused across all chains to avoid redundant initialization and respect connection limits.

**GPT-4o-mini** — Balances cost and quality. The structured output format reduces hallucination risk compared to free-form generation.

---

## Trade-offs

| Decision | Trade-off |
|---|---|
| GPT-4o-mini | Lower cost vs. GPT-4o, slightly less nuanced reasoning |
| No real-time data | Uses LLM training knowledge; not live market data |
| Sequential pipeline | Simpler and more coherent than parallel chains, but slower |
| SSE via POST | Non-standard (SSE is typically GET), but avoids URL length limits |

---

## Future Improvements

- **Live Data Integration** — Connect to financial APIs (Alpha Vantage, Yahoo Finance) for real-time prices and fundamentals
- **Report History** — Save past reports to a database (PostgreSQL/DynamoDB)
- **Comparison Mode** — Research and compare two companies side-by-side
- **PDF Export** — Download the investment report as a formatted PDF
- **Watchlist** — Save companies and re-research them on demand
- **Confidence Calibration** — Fine-tune prompts based on user feedback to improve recommendation accuracy
- **Multi-model Support** — Allow users to choose between GPT-4o, Claude, or Gemini
