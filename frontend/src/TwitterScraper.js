import React, { useState } from "react";

function TwitterScraper({ onScrapeComplete }) {
  const [isScraping, setIsScraping] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const handleScrape = async () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError("Please enter a search query.");
      return;
    }

    try {
      setIsScraping(true);
      setError("");
      setMessage("Scraping started...");
      setShowAlert(true);

      const response = await fetch(`http://127.0.0.1:5000/scrape`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: trimmedQuery }),
      });

      const data = await response.json();
      setMessage(data.message || "Scraping completed!");
      if (onScrapeComplete) onScrapeComplete();
    } catch (error) {
      console.error("Error scraping:", error);
      setMessage("Scraping failed!");
    } finally {
      setIsScraping(false);
      setTimeout(() => setShowAlert(false), 3000);
      setQuery("");
      setShowModal(false);
    }
  };

  return (
    <div className="text-center">
      {showAlert && (
        <div
          className="alert alert-info alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3"
          style={{ zIndex: 9999 }}
        >
          {message}
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowAlert(false)}
          ></button>
        </div>
      )}

      <button
        className="btn btn-primary btn-lg px-4 d-flex align-items-center mx-2"
        onClick={() => setShowModal(true)}
        disabled={isScraping}
      >
        {isScraping && (
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
        )}
        {isScraping ? "Scraping..." : "Scrape Tweets"}
      </button>

      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Enter Search Query</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setError("");
                    setQuery("");
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your query..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {error && <div className="text-danger mt-2 small">{error}</div>}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setError("");
                    setQuery("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleScrape}
                  disabled={isScraping}
                >
                  Scrape
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TwitterScraper;
