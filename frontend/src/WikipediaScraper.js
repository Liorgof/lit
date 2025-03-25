import React, { useState, useEffect } from "react";

function WikipediaScraper() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [isScraping, setIsScraping] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("info");

  useEffect(() => {
    if (showAlert) {
      const timeout = setTimeout(() => setShowAlert(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [showAlert]);

  const handleScrape = async () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError("Please enter a search query.");
      return;
    }

    setIsScraping(true);
    setError("");
    setResult(null);
    setAlertType("info");
    setMessage("Scraping started...");
    setShowAlert(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/wikipedia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: trimmedQuery }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setAlertType("danger");
        setMessage(data.error || "An error occurred while scraping.");
        setShowAlert(true);
        return;
      }

      setResult(data.summary);
      setAlertType("success");
      setMessage("Wikipedia scraping completed!");
      setShowAlert(true);
      setShowModal(false);
      setQuery("");
    } catch (err) {
      console.error("Wikipedia scrape error:", err);
      setAlertType("danger");
      setMessage("Failed to fetch Wikipedia data.");
      setShowAlert(true);
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <div className="text-center">
      {/* Alert */}
      {showAlert && (
        <div
          className={`alert alert-${alertType} alert-dismissible fade show position-fixed top-0 end-0 mt-3 me-3`}
          style={{ zIndex: 9999, minWidth: "250px" }}
        >
          <span className="fw-semibold">{message}</span>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowAlert(false)}
          ></button>
        </div>
      )}

      {/* Trigger Button */}
      <button
        className="btn btn-primary btn-lg px-4"
        onClick={() => {
          setShowModal(true);
          setError("");
          setQuery("");
        }}
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
                  placeholder="Enter your query..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {error && <div className="text-danger mt-2 small">{error}</div>}
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
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
    </div>
  );
}

export default WikipediaScraper;
