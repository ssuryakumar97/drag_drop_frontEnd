import React, { useState, useRef } from 'react';

const HandSketch = () => {
  const [paths, setPaths] = useState([]); // Stores all completed paths
  const [currentPath, setCurrentPath] = useState([]); // Stores points of the current path
  const isDrawing = useRef(false); // Track drawing state

  const handleMouseDown = (e) => {
    const svg = e.target.closest('svg');
    const { x, y } = svg.getBoundingClientRect();
    const startX = e.clientX - x;
    const startY = e.clientY - y;

    isDrawing.current = true;
    setCurrentPath([[startX, startY]]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;

    const svg = e.target.closest('svg');
    const { x, y } = svg.getBoundingClientRect();
    const currentX = e.clientX - x;
    const currentY = e.clientY - y;

    setCurrentPath((prevPath) => [...prevPath, [currentX, currentY]]);
  };

  const handleMouseUp = () => {
    if (isDrawing.current) {
      setPaths((prevPaths) => [...prevPaths, currentPath]);
      setCurrentPath([]);
      isDrawing.current = false;
    }
  };

  const handleClear = () => {
    setPaths([]);
    setCurrentPath([]);
  };

  return (
    <div>
      <button onClick={handleClear}>Clear</button>
      <svg
        width="100%"
        height="80vh"
        style={{ border: '1px solid #ddd' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {paths.map((path, index) => (
          <polyline
            key={index}
            points={path.map(point => point.join(',')).join(' ')}
            fill="none"
            stroke="black"
            strokeWidth="2"
          />
        ))}
        {currentPath.length > 0 && (
          <polyline
            points={currentPath.map(point => point.join(',')).join(' ')}
            fill="none"
            stroke="black"
            strokeWidth="2"
          />
        )}
      </svg>
    </div>
  );
};

export default HandSketch;
