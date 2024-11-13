import React, { useRef, useState } from "react";

const LineDrawer = () => {
  // Define the starting and ending coordinates of the line
  const [line, setLine] = useState();
  const [lines, setLines] = useState([]);
  const [rectangle, setRectangle] = useState();
  const [rectangles, setRectangles] = useState([]);
  const [circle, setCircle] = useState();
  const [circles, setCircles] = useState([]);
  const [paths, setPaths] = useState([]); // Stores all completed paths
  const [currentPath, setCurrentPath] = useState([]); // Stores points of the current path

  const [drawingParameters, setDrawingParameters] = useState("normal");

  const startPos = useRef({ x: 0, y: 0 });
  const sketchIsDrawing = useRef(false);

  const handleMouseMove = (e) => {
    const svg = e.target.closest("svg");
    const { x, y } = svg.getBoundingClientRect();
    const endX = e.clientX - x;
    const endY = e.clientY - y;
    if (line?.isDrawing && drawingParameters === "line") {
      setLine((prevLine) => ({
        ...prevLine,
        x2: e.clientX - x,
        y2: e.clientY - y,
      }));
      lines[lines.length - 1] = {
        ...line,
        x2: e.clientX - x,
        y2: e.clientY - y,
      };
      setLines(lines);
    }
    if (drawingParameters === "rectangle" && rectangle?.isDrawing) {
      setRectangle((prev) => ({
        ...prev,
        x: Math.min(startPos.current.x, endX),
        y: Math.min(startPos.current.y, endY),
        width: Math.abs(startPos.current.x - endX),
        height: Math.abs(startPos.current.y - endY),
      }));
      let obj = {
        x: Math.min(startPos.current.x, endX),
        y: Math.min(startPos.current.y, endY),
        width: Math.abs(startPos.current.x - endX),
        height: Math.abs(startPos.current.y - endY),
        isDrawing: true,
      };
      rectangles[rectangles.length - 1] = { ...obj };
      setRectangles(rectangles);
    }
    if (drawingParameters === "circle" && circle?.isDrawing) {
      const radius = Math.sqrt(
        Math.pow(endX - startPos.current.x, 2) +
          Math.pow(endY - startPos.current.y, 2)
      );
      setCircle((prev) => ({
        ...prev,
        cx: startPos.current.x,
        cy: startPos.current.y,
        r: radius,
      }));
      let obj = {
        cx: startPos.current.x,
        cy: startPos.current.y,
        r: radius,
        isDrawing: true,
      };
      circles[circles.length - 1] = { ...obj };
      setCircles(circles);
    }
    if (drawingParameters === "sketch" && sketchIsDrawing.current) {
      setCurrentPath((prevPath) => [...prevPath, [endX, endY]]);
    }
  };

  // Start drawing the line when the user clicks on the canvas
  const startDrawing = (e) => {
    const svg = e.target.closest("svg");

    const { x, y } = svg.getBoundingClientRect();
    startPos.current = {
      x: e.clientX - x,
      y: e.clientY - y,
    };
    if (drawingParameters === "line") {
      setLine({
        x1: e.clientX - x,
        y1: e.clientY - y,
        x2: e.clientX - x,
        y2: e.clientY - y,
        isDrawing: true,
      });
      setLines((prev) => [
        ...prev,
        {
          x1: e.clientX - x,
          y1: e.clientY - y,
          x2: e.clientX - x,
          y2: e.clientY - y,
          isDrawing: true,
        },
      ]);
    }
    if (drawingParameters === "rectangle") {
      setRectangle({
        x: startPos.current.x,
        y: startPos.current.y,
        width: 0,
        height: 0,
        isDrawing: true,
      });
      setRectangles((prev) => [
        ...prev,
        {
          x: startPos.current.x,
          y: startPos.current.y,
          width: 0,
          height: 0,
          isDrawing: true,
        },
      ]);
    }
    if (drawingParameters === "circle") {
      setCircle({
        cx: startPos.current.x,
        cy: startPos.current.y,
        r: 0,
        isDrawing: true,
      });
      setCircles((prev) => [
        ...prev,
        {
          cx: startPos.current.x,
          cy: startPos.current.y,
          r: 0,
          isDrawing: true,
        },
      ]);
    }
    if (drawingParameters === "sketch") {
      sketchIsDrawing.current = true;
      setCurrentPath([[startPos.current.x, startPos.current.y]]);
    }
  };

  // Stop drawing the line when the mouse is released
  const stopDrawing = () => {
    if (drawingParameters === "line") {
      setLine((prevLine) => ({
        ...prevLine,
        isDrawing: false,
      }));
      // setLines((prev) => [...prev, {...line, isDrawing: false}] )
      lines[lines.length - 1] = { ...line, isDrawing: false };
      // setLines((prev) => [...prev,prev[prev.length-1] = {...line, isDrawing: false}])
      setLines(lines);
    }
    if (drawingParameters === "rectangle") {
      rectangles[rectangles.length - 1] = {
        ...rectangles[rectangles.length - 1],
        isDrawing: false,
      };
      setRectangles(rectangles);
      setRectangle(null);
    }
    if (drawingParameters === "circle") {
      circles[circles.length - 1] = {
        ...circles[circles.length - 1],
        isDrawing: false,
      };
      setCircles(circles);
      setCircle(null);
    }
    if (drawingParameters === "sketch") {
      setPaths((prevPaths) => [...prevPaths, currentPath]);
      setCurrentPath([]);
      sketchIsDrawing.current = false;
    }
  };

  const handleClear = () => {
    setPaths([]);
    setCurrentPath([]);
    setCircles([]);
    setRectangles([]);
    setLines([]);
  };

  return (
    <div>
      <button
        onClick={() => setDrawingParameters("line")}
        style={
          drawingParameters === "line"
            ? { backgroundColor: "black", color: "white" }
            : {}
        }
      >
        Line
      </button>
      <button
        onClick={() => setDrawingParameters("circle")}
        style={
          drawingParameters === "circle"
            ? { backgroundColor: "black", color: "white" }
            : {}
        }
      >
        Circle
      </button>
      <button
        onClick={() => setDrawingParameters("rectangle")}
        style={
          drawingParameters === "rectangle"
            ? { backgroundColor: "black", color: "white" }
            : {}
        }
      >
        Rectangle
      </button>
      <button
        onClick={() => setDrawingParameters("normal")}
        style={
          drawingParameters === "normal"
            ? { backgroundColor: "black", color: "white" }
            : {}
        }
      >
        Normal
      </button>
      <button
        onClick={() => setDrawingParameters("sketch")}
        style={
          drawingParameters === "sketch"
            ? { backgroundColor: "black", color: "white" }
            : {}
        }
      >
        Sketch
      </button>
      <button onClick={handleClear}>clear</button>
      <div
        onMouseDown={startDrawing}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrawing}
        style={{
          width: "100vw",
          height: "100vh",
          position: "relative",
          backgroundColor: "#f0f0f0",
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      >
        <svg
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
          }}
        >
          {lines.map((ele, ind) => {
            return (
              <line
                x1={ele.x1}
                y1={ele.y1}
                x2={ele.x2}
                y2={ele.y2}
                stroke="black"
                strokeWidth="2"
                key={ind}
              />
            );
          })}

          {rectangles.map((ele, ind) => {
            return (
              <rect
                x={ele.x}
                y={ele.y}
                width={ele.width}
                height={ele.height}
                style={{ fill: "transparent", strokeWidth: 2, stroke: "black" }}
                key={ind}
              />
            );
          })}
          {rectangle && (
            <rect
              x={rectangle.x}
              y={rectangle.y}
              width={rectangle.width}
              height={rectangle.height}
              style={{ fill: "transparent", strokeWidth: 2, stroke: "black" }}
            />
          )}
          {circles.map((circle, index) => (
            <circle
              key={index}
              cx={circle.cx}
              cy={circle.cy}
              r={circle.r}
              fill="transparent"
              stroke="black"
            />
          ))}
          {circle && (
            <circle
              cx={circle.cx}
              cy={circle.cy}
              r={circle.r}
              fill="transparent"
              stroke="black"
            />
          )}
          {/* //Sketch  */}
          {paths.map((path, index) => (
            <polyline
              key={index}
              points={path.map((point) => point.join(",")).join(" ")}
              fill="none"
              stroke="black"
              strokeWidth="2"
            />
          ))}
          {currentPath.length > 0 && (
            <polyline
              points={currentPath.map((point) => point.join(",")).join(" ")}
              fill="none"
              stroke="black"
              strokeWidth="2"
            />
          )}
        </svg>
      </div>
    </div>
  );
};

export default LineDrawer;
