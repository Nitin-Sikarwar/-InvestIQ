const STAGES = [
  { id: "stage1", label: "Company Overview", icon: "🏢" },
  { id: "stage2", label: "Business Analysis", icon: "📊" },
  { id: "stage3", label: "Risk Evaluation", icon: "⚠️" },
  { id: "stage4", label: "Growth Assessment", icon: "🚀" },
  { id: "stage5", label: "Investment Decision", icon: "💡" },
];

export default function ProgressTracker({ progress }) {
  const currentStep = progress.step || 0;

  return (
    <div className="progress-container">
      <div className="progress-header">
        <div className="pulse-dot" />
        <span className="progress-message">{progress.message}</span>
      </div>

      <div className="stages-track">
        {STAGES.map((stage, idx) => {
          const step = idx + 1;
          const isDone = step < currentStep;
          const isActive = step === currentStep;
          return (
            <div key={stage.id} className={`stage-item ${isDone ? "done" : ""} ${isActive ? "active" : ""}`}>
              <div className="stage-icon-wrap">
                {isDone ? (
                  <span className="check">✓</span>
                ) : isActive ? (
                  <span className="spinner-stage" />
                ) : (
                  <span className="stage-num">{step}</span>
                )}
              </div>
              <div className="stage-label">
                <span className="stage-emoji">{stage.icon}</span>
                {stage.label}
              </div>
              {idx < STAGES.length - 1 && (
                <div className={`stage-connector ${isDone ? "done" : ""}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
