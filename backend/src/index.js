import "dotenv/config";
import express from "express";
import cors from "cors";
import researchRouter from "./routes/research.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api", researchRouter);

app.get("/health", (_, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`AI Investment Research API running on http://localhost:${PORT}`);
});
