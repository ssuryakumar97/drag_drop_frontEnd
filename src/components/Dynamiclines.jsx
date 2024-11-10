import React, { useState } from 'react';

const LineDrawer = () => {
  // Define the starting and ending coordinates of the line
  const [line, setLine] = useState();
  const [lines, setLines] = useState([])
// console.log(line)
// console.log(lines)
  // Update line end point dynamically
  const handleMouseMove = (e) => {
    // console.log("hello")
    if (line?.isDrawing) {
      setLine((prevLine) => ({
        ...prevLine,
        x2: e.clientX,
        y2: e.clientY,
      }));
    //   setLines((prev) => [...prev,prev[prev.length-1] = {...line,  x2: e.clientX,
    //     y2: e.clientY,}] )
    lines[lines.length-1] =  {...line,  x2: e.clientX,
        y2: e.clientY,}
      setLines(lines)
    }
  };

  // Start drawing the line when the user clicks on the canvas
  const startDrawing = (e) => {
    console.log(e.target)
    setLine({
      x1: e.clientX,
      y1: e.clientY,
      x2: e.clientX,
      y2: e.clientY,
      isDrawing: true,
    });
    setLines((prev) => [...prev, {
        x1: e.clientX,
        y1: e.clientY,
        x2: e.clientX,
        y2: e.clientY,
        isDrawing: true,
      }])
  };

  // Stop drawing the line when the mouse is released
  const stopDrawing = () => {
    setLine((prevLine) => ({
      ...prevLine,
      isDrawing: false,
    }));
    // setLines((prev) => [...prev, {...line, isDrawing: false}] )
    lines[lines.length-1] =  {...line,  isDrawing: false}
    // setLines((prev) => [...prev,prev[prev.length-1] = {...line, isDrawing: false}])
    setLines(lines)
  };

  console.log(lines)

  return (
    <div
      onMouseDown={startDrawing}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDrawing}
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        backgroundColor: "#f0f0f0",
        backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }}
    >
        {/* <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}>
        <line
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="black"
          strokeWidth="2"
        />
      </svg> */}
        {/* { line?.isDrawing ? (
            <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}>
            <line
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="black"
              strokeWidth="2"
            />
          </svg>
        ) : lines.map((ele)=>{
        return (
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}>
        <line
          x1={ele.x1}
          y1={ele.y1}
          x2={ele.x2}
          y2={ele.y2}
          stroke="black"
          strokeWidth="2"
        />
      </svg>
        )
        })} */}
        { lines.map((ele)=>{
        return (
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}>
        <line
          x1={ele.x1}
          y1={ele.y1}
          x2={ele.x2}
          y2={ele.y2}
          stroke="black"
          strokeWidth="2"
        />
      </svg>
        )
        })}
    </div>
  );
};

export default LineDrawer;
