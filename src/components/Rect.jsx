import React, { useState, useRef } from 'react';

const CircleDrawer = () => {
  const [circles, setCircles] = useState([]);
  const [currentCircle, setCurrentCircle] = useState(null);
  const isDrawing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    const svg = e.target.closest('svg');
    const { x, y } = svg.getBoundingClientRect();
    startPos.current = {
      x: e.clientX - x,
      y: e.clientY - y,
    };
    isDrawing.current = true;
    setCurrentCircle({ cx: startPos.current.x, cy: startPos.current.y, r: 0 });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;

    const svg = e.target.closest('svg');
    const { x, y } = svg.getBoundingClientRect();
    const currentX = e.clientX - x;
    const currentY = e.clientY - y;

    // Calculate the radius as the distance from the start position to the current mouse position
    const radius = Math.sqrt(
      Math.pow(currentX - startPos.current.x, 2) + Math.pow(currentY - startPos.current.y, 2)
    );

    setCurrentCircle({
      cx: startPos.current.x,
      cy: startPos.current.y,
      r: radius,
    });
  };

  const handleMouseUp = () => {
    if (isDrawing.current && currentCircle) {
      setCircles((prev) => [...prev, currentCircle]);
      setCurrentCircle(null);
      isDrawing.current = false;
    }
  };

  return (
    <svg
      width="100%"
      height="100vh"
      style={{ border: '1px solid #ddd' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {circles.map((circle, index) => (
        <circle
          key={index}
          cx={circle.cx}
          cy={circle.cy}
          r={circle.r}
          fill="rgba(255, 0, 0, 0.3)"
          stroke="red"
        />
      ))}
      {currentCircle && (
        <circle
          cx={currentCircle.cx}
          cy={currentCircle.cy}
          r={currentCircle.r}
          fill="rgba(255, 0, 0, 0.3)"
          stroke="red"
        />
      )}
    </svg>
  );
};

export default CircleDrawer;
