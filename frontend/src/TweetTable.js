import React from "react";

function TweetTable({ tweets, page, hasNext, fetchTweets }) {
  return (
    <div
      className="table-responsive"
      style={{
        maxWidth: "90%",
        overflow: "hidden", // Prevent scrollbars
      }}
    >
      {tweets && tweets.length > 0 ? (
        <>
          <table
            className="table table-hover table-striped table-bordered shadow-sm mb-0"
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <thead className="table-primary">
              <tr className="text-center">
                <th style={{ width: "5%" }}>#</th>
                <th style={{ width: "20%" }}>Username</th>
                <th style={{ width: "45%" }}>Text</th>
                <th style={{ width: "20%" }}>Created At</th>
                <th style={{ width: "5%" }}>Retweets</th>
                <th style={{ width: "5%" }}>Likes</th>
              </tr>
            </thead>
            <tbody>
              {tweets.map((tweet, index) => (
                <tr key={index}>
                  <td className="text-center align-middle">
                    {tweet.Tweet_count}
                  </td>
                  <td
                    className="align-middle text-truncate"
                    style={{
                      maxWidth: "0",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={tweet.Username}
                  >
                    {tweet.Username}
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
                    {tweet.Text}
                  </td>
                  <td
                    className="text-center align-middle"
                    style={{
                      maxWidth: "0",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {tweet.Created_At}
                  </td>
                  <td className="text-center align-middle">{tweet.Retweets}</td>
                  <td className="text-center align-middle">{tweet.Likes}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Buttons */}
          <div className="d-flex justify-content-center mt-4">
            {page > 1 && (
              <button
                className="btn btn-outline-secondary me-2"
                onClick={() => fetchTweets(page - 1)}
              >
                Previous
              </button>
            )}

            {hasNext && (
              <button
                className="btn btn-outline-secondary"
                onClick={() => fetchTweets(page + 1)}
              >
                Next
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="text-muted fs-5 mt-4 text-center">No tweets found.</div>
      )}
    </div>
  );
}

export default TweetTable;
