import { useResearch } from "./hooks/useResearch";
import SearchForm from "./components/SearchForm";
import ProgressTracker from "./components/ProgressTracker";
import InvestmentReport from "./components/InvestmentReport";
import "./App.css";

export default function App() {
  const { status, progress, report, error, research, reset } = useResearch();

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">📈</span>
            <div>
              <div className="logo-title">InvestIQ</div>
              <div className="logo-sub">AI Investment Research Agent</div>
            </div>
          </div>
          {status !== "idle" && (
            <button className="header-reset-btn" onClick={reset}>
              New Research
            </button>
          )}
        </div>
      </header>

      <main className="app-main">
        {/* Hero + Search */}
        {status === "idle" && (
          <div className="hero">
            <div className="hero-badge">Powered by GPT-4 + LangChain</div>
            <h1 className="hero-title">
              AI-Powered Investment<br />
              <span className="hero-accent">Research Agent</span>
            </h1>
            <p className="hero-subtitle">
              Enter any company name. Our AI analyst will research it across 5 dimensions
              and deliver a professional INVEST or PASS recommendation.
            </p>
            <SearchForm onSubmit={research} isLoading={false} />
            <div className="hero-examples">
              <span className="examples-label">Try:</span>
              {["Tesla", "Apple", "Nvidia", "Palantir", "Shopify"].map((c) => (
                <button key={c} className="example-chip" onClick={() => research(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {status === "loading" && (
          <div className="loading-view">
            <ProgressTracker progress={progress} />
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="error-view">
            <div className="error-card">
              <div className="error-icon">⚠️</div>
              <h2 className="error-title">Research Failed</h2>
              <p className="error-message">{error}</p>
              <button className="retry-btn" onClick={reset}>
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Report */}
        {status === "done" && report && (
          <InvestmentReport report={report} onReset={reset} />
        )}
      </main>

      <footer className="app-footer">
        <p>InvestIQ — AI Investment Research Agent · Built with React, Node.js & LangChain.js</p>
      </footer>
    </div>
  );
}
