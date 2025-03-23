import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import WikipediaScraper from "./WikipediaScraper";
import TweetTable from "./TweetTable";

function App() {
  const [tweets, setTweets] = useState([]);
  const [page, setPage] = useState(1);
  const [showTable, setShowTable] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [query, setQuery] = useState("");

  const perPage = 10;

  const fetchTweets = async (pageNumber) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/tweets?page=${pageNumber}`
      );
      const data = await response.json();

      setTweets(data);
      setPage(pageNumber);
      setShowTable(true);

      setHasNext(data.length === perPage);
    } catch (error) {
      console.error("Error fetching tweets:", error);
    }
  };

  const handleScrape = async (customQuery) => {
    try {
      setIsScraping(true);
      setMessage("Scraping started...");
      setShowAlert(true);

      const response = await fetch(`http://127.0.0.1:5000/scrape`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: customQuery }), // שליחת השאילתה
      });

      const data = await response.json();

      setMessage(data.message || "Scraping completed!");
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error("Error scraping:", error);
      setMessage("Scraping failed!");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column justify-content-start align-items-center bg-light py-5">
      {/*  הודעה */}
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

      <h1 className="mb-4 text-center display-4 fw-bold text-primary">
        Scraper Dashboard
      </h1>

      {/* כפתורים */}
      <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
        <button
          className="btn btn-primary btn-lg px-4 d-flex align-items-center"
          onClick={() => setShowModal(true)} // פותח את המודאל במקום לקרוא ישירות ל-scrape
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

        <button
          className="btn btn-success btn-lg px-4"
          onClick={() => fetchTweets(1)}
        >
          Show Tweets
        </button>
      </div>

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
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    handleScrape(query); // קורא לפונקציה עם השאילתה
                    setQuery("");
                    setShowModal(false);
                  }}
                >
                  Scrape
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-100 mt-5">
        <WikipediaScraper />
      </div>

      {/* טבלה */}
      {showTable && (
        <TweetTable
          tweets={tweets}
          page={page}
          hasNext={hasNext}
          fetchTweets={fetchTweets}
        />
      )}
    </div>
  );
}

export default App;
