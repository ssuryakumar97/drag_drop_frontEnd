import React, { useState } from "react";

const Edge = ({ sourcePos, targetPos, onDelete }) => {
  const handleMenu = (e, edge) => {
    e.preventDefault();
    onDelete(e, edge);
  };

  return (
    <svg
      style={{ position: "absolute", overflow: "visible", cursor: "pointer" }}
      onContextMenu={handleMenu}
    >
      <line
        x1={sourcePos?.x}
        y1={sourcePos?.y}
        x2={targetPos?.x}
        y2={targetPos?.y}
        stroke="black"
        strokeWidth="2"
      />
    </svg>
  );
};

export default Edge;
