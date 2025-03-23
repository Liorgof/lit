import React, { useState } from "react";

function WikipediaScraper() {
  const [wikiData, setWikiData] = useState([]);
  const [query, setQuery] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");

  const handleScrapeWikipedia = async () => {
    setIsScraping(true);
    setShowAlert(true);
    setMessage("Wikipedia scraping started...");

    try {
      const response = await fetch(`http://127.0.0.1:5000/wikipedia`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      setMessage(data.message || "Wikipedia scraping completed!");
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error("Wikipedia scraping error:", error);
      setMessage("Scraping Wikipedia failed!");
      setTimeout(() => setShowAlert(false), 3000);
    } finally {
      setIsScraping(false);
      setQuery("");
    }
  };

  const fetchWikipediaData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/wikipedia-data`);
      const data = await response.json();
      setWikiData(data);
      setShowTable(true);
    } catch (error) {
      console.error("Fetching Wikipedia data error:", error);
    }
  };

  return (
    <div className="w-100">
      {showAlert && (
        <div className="alert alert-info mt-3">
          {message}
          <button
            className="btn-close"
            onClick={() => setShowAlert(false)}
          ></button>
        </div>
      )}

      <div className="d-flex justify-content-center gap-3 mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Enter Wikipedia query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="btn btn-warning"
          onClick={handleScrapeWikipedia}
          disabled={isScraping}
        >
          {isScraping ? "Scraping..." : "Scrape Wikipedia"}
        </button>
        <button className="btn btn-info" onClick={fetchWikipediaData}>
          Show Wikipedia
        </button>
      </div>

      {showTable && wikiData.length > 0 && (
        <div
          className="table-responsive"
          style={{ maxWidth: "90%", margin: "auto" }}
        >
          <table className="table table-hover table-striped table-bordered shadow-sm">
            <thead className="table-info">
              <tr className="text-center">
                <th>#</th>
                <th>Query</th>
                <th>Summary</th>
                <th>Links</th>
              </tr>
            </thead>
            <tbody>
              {wikiData.map((wiki, index) => (
                <tr key={index}>
                  <td className="text-center">{index + 1}</td>
                  <td>{wiki.Query}</td>
                  <td>{wiki.Summary}</td>
                  <td>
                    <ul>
                      {wiki.Links.slice(0, 5).map((link, idx) => (
                        <li key={idx}>{link}</li>
                      ))}
                      {wiki.Links.length > 5 && <li>and more...</li>}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showTable && wikiData.length === 0 && (
        <div className="text-muted text-center fs-5 mt-4">
          No Wikipedia data found.
        </div>
      )}
    </div>
  );
}

export default WikipediaScraper;
