import { useState, useCallback } from "react";
import { streamResearch } from "../utils/api";

const STAGES = {
  stage1: { label: "Researching company overview", step: 1 },
  stage2: { label: "Analyzing business fundamentals", step: 2 },
  stage3: { label: "Evaluating risks", step: 3 },
  stage4: { label: "Assessing growth potential", step: 4 },
  stage5: { label: "Making investment decision", step: 5 },
};

export function useResearch() {
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [progress, setProgress] = useState({ stage: null, message: "", step: 0 });
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const research = useCallback((company) => {
    setStatus("loading");
    setReport(null);
    setError(null);
    setProgress({ stage: null, message: "Starting research...", step: 0 });

    streamResearch(
      company,
      (stage, message) => {
        setProgress({ stage, message, step: STAGES[stage]?.step || 0 });
      },
      (result) => {
        setReport(result);
        setStatus("done");
      },
      (err) => {
        setError(err);
        setStatus("error");
      }
    );
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setReport(null);
    setError(null);
    setProgress({ stage: null, message: "", step: 0 });
  }, []);

  return { status, progress, report, error, research, reset };
}
