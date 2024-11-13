import React, { useState, useRef } from 'react';

const MeasurementTool = () => {
  const [shapes, setShapes] = useState([]);
  const [currentShape, setCurrentShape] = useState(null);
  const [editingShapeIndex, setEditingShapeIndex] = useState(null);
  const [shapeType, setShapeType] = useState('rectangle'); // 'circle' or 'rectangle'
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
    setCurrentShape(shapeType === 'circle' 
      ? { cx: startPos.current.x, cy: startPos.current.y, r: 0 }
      : { x: startPos.current.x, y: startPos.current.y, width: 0, height: 0 }
    );
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current || !currentShape) return;

    const svg = e.target.closest('svg');
    const { x, y } = svg.getBoundingClientRect();
    const currentX = e.clientX - x;
    const currentY = e.clientY - y;

    if (shapeType === 'circle') {
      const radius = Math.sqrt(
        Math.pow(currentX - startPos.current.x, 2) + Math.pow(currentY - startPos.current.y, 2)
      );
      setCurrentShape({ ...currentShape, r: radius });
    } else {
      setCurrentShape({
        x: Math.min(startPos.current.x, currentX),
        y: Math.min(startPos.current.y, currentY),
        width: Math.abs(startPos.current.x - currentX),
        height: Math.abs(startPos.current.y - currentY),
      });
    }
  };

  const handleMouseUp = () => {
    if (isDrawing.current && currentShape) {
      setShapes((prev) => [...prev, currentShape]);
      setCurrentShape(null);
      isDrawing.current = false;
    }
  };

  const handleEditShape = (index) => {
    setEditingShapeIndex(index);
    setCurrentShape(shapes[index]);
  };

  const handleModifyShape = (e) => {
    if (editingShapeIndex !== null) {
      const modifiedShapes = [...shapes];
      const svg = e.target.closest('svg');
      const { x, y } = svg.getBoundingClientRect();
      const mouseX = e.clientX - x;
      const mouseY = e.clientY - y;

      if (shapeType === 'circle') {
        const radius = Math.sqrt(
          Math.pow(mouseX - modifiedShapes[editingShapeIndex].cx, 2) +
          Math.pow(mouseY - modifiedShapes[editingShapeIndex].cy, 2)
        );
        modifiedShapes[editingShapeIndex] = { ...modifiedShapes[editingShapeIndex], r: radius };
      } else {
        const width = Math.abs(mouseX - modifiedShapes[editingShapeIndex].x);
        const height = Math.abs(mouseY - modifiedShapes[editingShapeIndex].y);
        modifiedShapes[editingShapeIndex] = { 
          ...modifiedShapes[editingShapeIndex], 
          width: width, 
          height: height 
        };
      }
      setShapes(modifiedShapes);
    }
  };

  const renderShape = (shape, index) => {
    if ('r' in shape) {
      // Render circle with radius measurement
      return (
        <g key={index} onClick={() => handleEditShape(index)}>
          <circle cx={shape.cx} cy={shape.cy} r={shape.r} fill="rgba(0, 0, 255, 0.3)" stroke="blue" />
          <text x={shape.cx} y={shape.cy + shape.r + 15} fontSize="12" fill="black">
            Radius: {Math.round(shape.r)}
          </text>
        </g>
      );
    } else {
      // Render rectangle with width and height measurements
      return (
        <g key={index} onClick={() => handleEditShape(index)}>
          <rect x={shape.x} y={shape.y} width={shape.width} height={shape.height} fill="rgba(0, 255, 0, 0.3)" stroke="green" />
          <text x={shape.x} y={shape.y - 5} fontSize="12" fill="black">
            Width: {Math.round(shape.width)}, Height: {Math.round(shape.height)}
          </text>
        </g>
      );
    }
  };

  return (
    <div>
      <div>
        <label>
          Shape Type: 
          <select value={shapeType} onChange={(e) => setShapeType(e.target.value)}>
            <option value="rectangle">Rectangle</option>
            <option value="circle">Circle</option>
          </select>
        </label>
      </div>
      <svg
        width="100%"
        height="100vh"
        style={{ border: '1px solid #ddd' }}
        onMouseDown={handleMouseDown}
        onMouseMove={editingShapeIndex !== null ? handleModifyShape : handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {shapes.map((shape, index) => renderShape(shape, index))}
        {currentShape && renderShape(currentShape, shapes.length)}
      </svg>
    </div>
  );
};

export default MeasurementTool;
