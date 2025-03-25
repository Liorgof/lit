import React from "react";

function WikipediaTable({ entries, page, hasNext, fetchEntries }) {
  return (
    <div
      className="table-responsive"
      style={{
        maxWidth: "90%",
        overflow: "hidden",
      }}
    >
      {entries && entries.length > 0 ? (
        <>
          <table
            className="table table-hover table-striped table-bordered shadow-sm mb-0"
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <thead className="table-primary">
              <tr className="text-center">
                <th style={{ width: "5%" }}>#</th>
                <th style={{ width: "20%" }}>Query</th>
                <th style={{ width: "55%" }}>Summary</th>
                <th style={{ width: "20%" }}>Links</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={index}>
                  <td className="text-center align-middle">
                    {index + 1 + (page - 1) * 10}
                  </td>

                  <td
                    className="align-middle text-truncate"
                    title={entry.Query}
                    style={{
                      maxWidth: "0",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {entry.Query}
                  </td>

                  <td
                    className="align-middle text-truncate"
                    title={entry.Summary}
                    style={{
                      maxWidth: "0",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {entry.Summary}
                  </td>

                  <td
                    className="align-middle text-truncate"
                    style={{
                      maxWidth: "0",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {entry.Links && entry.Links.length > 0 ? (
                      <small>
                        {entry.Links.map((link, i) => (
                          <span key={i}>
                            <a
                              href={`https://en.wikipedia.org/wiki/${encodeURIComponent(
                                link
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {link}
                            </a>
                            {i < entry.Links.length - 1 && ", "}
                          </span>
                        ))}
                      </small>
                    ) : (
                      <span className="text-muted small">No links</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Buttons */}
          <div className="d-flex justify-content-center mt-4">
            {page > 1 && (
              <button
                className="btn btn-outline-secondary me-2"
                onClick={() => fetchEntries(page - 1)}
              >
                Previous
              </button>
            )}

            {hasNext && (
              <button
                className="btn btn-outline-secondary"
                onClick={() => fetchEntries(page + 1)}
              >
                Next
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="text-muted fs-5 mt-4 text-center">
          No Wikipedia results found.
        </div>
      )}
    </div>
  );
}

export default WikipediaTable;
