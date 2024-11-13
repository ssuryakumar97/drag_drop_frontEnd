import React, { useState } from "react";
import EditIcon from "@mui/icons-material/EditOutlined";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import styled from "styled-components";

const InputDiv = styled.input`
  border: none;
  background: inherit;
  width: 90%;
  outline: none;
`;

const StyledEditIcon = styled(EditIcon)`
  font-size: 20px;
`

const Node = ({
  node,
  onDrag,
  onDragStart,
  onDragOver,
  onDrop,
  onResize,
  setIsResizing,
  isResizing,
  onClick,
  onDelete,
  onUpdate,
  setLabel,
  label,
}) => {
  // const [isResizing, setIsResizing] = useState(false);
  const [size, setSize] = useState({ width: 100, height: 50 });
  const [visible, setVisible] = useState(false);
  const [edit, setEdit] = useState(false);

  const handleMouseDown = (e) => {
    e.stopPropagation();
    setIsResizing(true);
  };

  // Handle mouse move to resize the node
  const handleMouseMove = (e) => {
    setVisible(true);
    if (!isResizing) return;
    const newWidth = e.clientX - node.position.x;
    const newHeight = e.clientY - node.position.y;
    setSize({ width: newWidth, height: newHeight });
    if (onResize) {
      onResize(node._id, { width: newWidth, height: newHeight });
    }
  };

  const handleMouseOut = (e) => {
    setVisible(false);
  };

  // Stop resizing on mouse up
  const handleMouseUp = () => {
    setIsResizing(false);
  };

  const handleUpdate = () => {
    setEdit(true);
  };

  const handleClick = (e, node, label) => {
    setEdit(false);
    onUpdate(e, node, label);
  };

  return (
    <div
      style={{
        position: "absolute",
        left: node.position.x,
        top: node.position.y,
        borderRadius: "5px",
        width: `${size.width}px`,
        height: `${size.height}px`,
        background: "lightblue",
        padding: "10px",
        cursor: isResizing ? "nwse-resize" : "pointer",
        zIndex: 2,
        display: "flex",
        alignItems: "center",
      }}
      draggable={isResizing ? "false" : "true"}
      onDrag={(e) => onDrag(e, node)}
      onDragStart={(e) => onDragStart(e, node)}
      onDragOver={(e) => onDragOver(e, node)}
      onDrop={(e) => onDrop(e, node)}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseOut={handleMouseOut}
      onClick={(e) => onClick(e, node._id)}
    >
      {/* {node.label} */}
      {/* Resize handle at the bottom-right corner */}
      {edit ? (
        <>
          <InputDiv
            type="text"
            name="label"
            onChange={(e) => setLabel(e.target.value)}
            value={label}
          />
          <button
            onClick={(e) => handleClick(e, node, label)}
            style={{ 
              width: "25px", 
              height: "25px",
              display: 'flex',
              alignItems: "center",
              justifyContent: "center", 
              cursor: "pointer" }}
          >
            <UpgradeIcon />
          </button>
        </>
      ) : (
        node.label
      )}
      {visible && (
        <>
          <div
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: "darkblue",
              position: "absolute",
              right: 0,
              bottom: 0,
              cursor: "nwse-resize",
            }}
            onMouseDown={handleMouseDown}
          ></div>
          <div
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: "black",
              color: "white",
              position: "absolute",
              right: 0,
              top: 0,
              cursor: "pointer",
              padding: "0px 0px 5px 0px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={(e) => onDelete(e, node)}
          >
            x
          </div>
          <div
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: "black",
              color: "white",
              position: "absolute",
              left: 0,
              top: 0,
              cursor: "pointer",
              padding: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={handleUpdate}
          >
            <StyledEditIcon />
          </div>
        </>
      )}
    </div>
  );
};

export default Node;
