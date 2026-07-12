import { Router } from "express";
import { runResearchPipeline } from "../utils/pipeline.js";

const router = Router();

router.post("/research", async (req, res) => {
  const { company } = req.body;

  if (!company || typeof company !== "string" || company.trim().length < 2) {
    return res.status(400).json({ error: "Please provide a valid company name (at least 2 characters)." });
  }

  const companyName = company.trim();

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const send = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const result = await runResearchPipeline(companyName, (stage, message) => {
      send("progress", { stage, message });
    });
    send("result", result);
    res.end();
  } catch (err) {
    console.error("Pipeline error:", err);
    send("error", { error: err.message || "Research pipeline failed. Please try again." });
    res.end();
  }
});

export default router;
