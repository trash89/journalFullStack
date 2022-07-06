import React from "react";
import { useIsMounted } from "../hooks";

const PaginationTable = ({ pagination, data }) => {
  const isMounted = useIsMounted();
  if (!isMounted) return <></>;

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span>Total Pages: {pagination.state.getTotalPages(data.nodes)}</span>
      <span>
        Page:{" "}
        {pagination.state.getPages(data.nodes).map((_, index) => (
          <button
            key={index}
            type="button"
            style={{
              fontWeight: pagination.state.page === index ? "bold" : "normal",
            }}
            onClick={() => pagination.fns.onSetPage(index)}
          >
            {index + 1}
          </button>
        ))}
      </span>
    </div>
  );
};

export default PaginationTable;
