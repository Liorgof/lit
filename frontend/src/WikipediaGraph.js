import React, { useEffect, useState, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";

export default function WikipediaGraph() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [isLoading, setIsLoading] = useState(true);
  const fgRef = useRef();
  const hasFetched = useRef(false); // 👈 this prevents double-fetch

  useEffect(() => {
    if (hasFetched.current) return;

    hasFetched.current = true;
    setIsLoading(true);

    fetch("http://localhost:5000/wikipedia/graph")
      .then((res) => res.json())
      .then((data) => setGraphData(data))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div
      className="border border-2"
      style={{ width: "100%", maxWidth: "720px", margin: "0 auto" }}
    >
      {isLoading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "600px" }}
        >
          <div
            className="spinner-border text-primary"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <ForceGraph2D
          ref={fgRef}
          width={700}
          height={600}
          graphData={graphData}
          nodeLabel={(node) => node.id}
          nodeAutoColorBy="id"
          linkDirectionalArrowLength={4}
          linkDirectionalArrowRelPos={1}
          maxZoom={3}
          minZoom={0.5}
        />
      )}
    </div>
  );
}
