import { useState } from "react";

export default function SearchForm({ onSubmit, isLoading }) {
  const [company, setCompany] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (company.trim().length >= 2) onSubmit(company.trim());
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="search-input-group">
        <div className="search-icon">🔍</div>
        <input
          type="text"
          className="search-input"
          placeholder="Enter company name (e.g. Tesla, Apple, Nvidia...)"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          disabled={isLoading}
          minLength={2}
          maxLength={100}
          autoFocus
        />
        <button
          type="submit"
          className="research-btn"
          disabled={isLoading || company.trim().length < 2}
        >
          {isLoading ? (
            <span className="btn-loading">
              <span className="spinner-small" />
              Researching...
            </span>
          ) : (
            "Research →"
          )}
        </button>
      </div>
    </form>
  );
}
