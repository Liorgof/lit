import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import WikipediaScraper from "./WikipediaScraper";
import TweetTable from "./TweetTable";
import TwitterScraper from "./TwitterScraper";
import WikipediaTable from "./WikipediaTable";

function App() {
  const [tweets, setTweets] = useState([]);
  const [page, setPage] = useState(1);
  const [showTable, setShowTable] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [wikiEntries, setWikiEntries] = useState([]);
  const [wikiPage, setWikiPage] = useState(1);
  const [wikiHasNext, setWikiHasNext] = useState(false);
  const [isWikiLoading, setIsWikiLoading] = useState(false);
  const [showWikiTable, setShowWikiTable] = useState(false);

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
      setShowWikiTable(false);
      setShowTable(true);
    } catch (error) {
      console.error("Error fetching tweets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAndShowWiki = async (page = 1) => {
    setIsWikiLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/wikipedia/entries?page=${page}`
      );
      const data = await response.json();
      setWikiEntries(data.entries || []);
      setWikiPage(data.page || 1);
      setWikiHasNext(data.hasNext || false);
      setShowTable(false);
      setShowWikiTable(true);
    } catch (err) {
      console.error("Failed to fetch Wikipedia entries:", err);
    } finally {
      setIsWikiLoading(false);
    }
  };

  console.log("Loaded wiki entries:", wikiEntries);

  return (
    <div className="min-vh-100 d-flex flex-column justify-content-start align-items-center bg-light py-5">
      <h1 className="mb-4 text-center display-4 fw-bold text-primary">
        Scraper Dashboard
      </h1>

      {/* Buttons */}
      <div className="d-flex flex-wrap justify-content-center mb-4">
        <TwitterScraper />

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

      <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
        <WikipediaScraper />

        <button
          className="btn btn-success btn-lg px-4 d-flex align-items-center"
          onClick={() => loadAndShowWiki(1)}
          disabled={isWikiLoading}
        >
          {isWikiLoading && (
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
          )}
          {isWikiLoading ? "Loading..." : "Load Wikipedia"}
        </button>
      </div>

      {showTable && (
        <TweetTable
          tweets={tweets}
          page={page}
          hasNext={hasNext}
          fetchTweets={loadAndShowTweets}
        />
      )}

      {showWikiTable && (
        <WikipediaTable
          entries={wikiEntries}
          page={wikiPage}
          hasNext={wikiHasNext}
          fetchEntries={loadAndShowWiki}
        />
      )}
    </div>
  );
}

export default App;
