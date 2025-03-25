import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import WikipediaScraper from "./WikipediaScraper";
import TweetTable from "./TweetTable";
import TwitterScraper from "./TwitterScraper";

function App() {
  const [tweets, setTweets] = useState([]);
  const [page, setPage] = useState(1);
  const [showTable, setShowTable] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const perPage = 10;

  const loadAndShowTweets = async (pageNumber = 1) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://127.0.0.1:5000/tweets?page=${pageNumber}`
      );
      const data = await response.json();

      setTweets(data);
      setPage(pageNumber);
      setHasNext(data.length === perPage);
      setShowTable(true);
    } catch (error) {
      console.error("Error fetching tweets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column justify-content-start align-items-center bg-light py-5">
      <h1 className="mb-4 text-center display-4 fw-bold text-primary">
        Scraper Dashboard
      </h1>

      {/* Buttons */}
      <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
        <TwitterScraper/>

        <button
          className="btn btn-success btn-lg px-4 d-flex align-items-center"
          onClick={() => loadAndShowTweets(1)}
          disabled={isLoading}
        >
          {isLoading && (
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
          )}
          {isLoading ? "Loading..." : "Load Tweets"}
        </button>
      </div>

      <div className="mb-4">
        <WikipediaScraper />
      </div>

      {showTable && (
        <TweetTable
          tweets={tweets}
          page={page}
          hasNext={hasNext}
          fetchTweets={loadAndShowTweets}
        />
      )}
    </div>
  );
}

export default App;
