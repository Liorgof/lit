// WikipediaScraper.jsx
import React, { useState } from "react";

function WikipediaScraper() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [isScraping, setIsScraping] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const handleScrape = async () => {
    if (!query.trim()) return;

    setIsScraping(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/wikipedia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.summary);
      }
    } catch (err) {
      console.error("Wikipedia scrape error:", err);
      setError("Failed to fetch Wikipedia data.");
    } finally {
      setIsScraping(false);
      setShowModal(false);
      setQuery("");
    }
  };

  return (
    <div className="text-center">
      <button
        className="btn btn-primary btn-lg px-4"
        onClick={() => setShowModal(true)}
      >
        Scrape Wikipedia
      </button>

      {/* Modal */}
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
                <h5 className="modal-title">Wikipedia Search</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter topic..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-warning"
                  onClick={handleScrape}
                  disabled={isScraping}
                >
                  {isScraping ? (
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : null}
                  {isScraping ? "Scraping..." : "Scrape"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div
          className="mt-4 p-4 bg-white shadow rounded text-start mx-auto"
          style={{ maxWidth: "800px" }}
        >
          <h5 className="text-dark">Summary:</h5>
          <p>{result}</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger mt-4" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}

export default WikipediaScraper;
