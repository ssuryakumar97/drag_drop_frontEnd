import { useEffect, useState } from "react";
import { publicRequest } from "../../requestMethods";
import NodeComp from "../components/Node";
import Edge from "../components/Edge";

function Home() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [createEdge, setCreateEdge] = useState(false);
  const [createSource, setCreateSource] = useState();
  const [sourceId, setSourceId] = useState();
  const [createTarget, setCreateTarget] = useState();
  const [isResizing, setIsResizing] = useState(false);
  const [label, setLabel] = useState("");
  const [xdata, setXdata] = useState(0);
  const [ydata, setYdata] = useState(0);

  useEffect(() => {
    // Fetch nodes and edges from the backend
    fetchNodes();
    fetchEdges();
  }, []);

  const fetchNodes = async () => {
    const res = await publicRequest.get("/getAllNode");
    setNodes(res.data);
  };

  const fetchEdges = async () => {
    const res = await publicRequest.get("/getAllEdge");
    setEdges(res.data);
  };

  const handleDragStart = (e, node) => {
    setXdata(e.clientX - node.position.x);
    setYdata(e.clientY - node.position.y);
  };

  const handleDrag = (e, node) => {
    e.preventDefault();
    if (!isResizing) {
      const updatedNodes = nodes.map((n) =>
        n._id === node._id
          ? // ? { ...n, position: { x: e.clientX, y: e.clientY } }
            { ...n, position: { x: e.clientX - xdata, y: e.clientY - ydata } }
          : n
      );
      setNodes(updatedNodes);
    }
  };

  const handleDragover = (e, node) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e, node) => {
    e.preventDefault();
    e.stopPropagation();
    const updatedNodes = nodes.map((n) =>
      n._id === node._id
        ? { ...n, position: { x: e.clientX - xdata, y: e.clientY - ydata } }
        : n
    );
    setNodes(updatedNodes);
    async function updateNode() {
      const updateNode = await publicRequest.put("/updateNode", {
        nodeId: node._id,
        label: node.label,
        position: { x: e.clientX - xdata, y: e.clientY - ydata },
      });
      console.log(updateNode.data);
    }

    updateNode();
  };

  const handleNodeClick = async (e, nodeId) => {
    if (nodeId && createEdge && !createSource) {
      setSourceId(nodeId);
      const sourcePos = nodes.find((n) => n._id === nodeId)?.position;
      setCreateSource(sourcePos);
    }
    if (nodeId && createEdge && createSource && !createTarget) {
      const targetPos = nodes.find((n) => n._id === nodeId)?.position;
      setCreateTarget(targetPos);
      const newEdge = { source: sourceId, target: nodeId };
      setEdges([...edges, newEdge]);
      setCreateSource(null);
      setCreateTarget(null);
      const res = await publicRequest.post("/createEdge", newEdge);
      console.log(res.data);
    }
  };

  const handleResize = (nodeId, newSize) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node._id === nodeId ? { ...node, size: newSize } : node
      )
    );
  };

  const addNode = async () => {
    const newNode = {
      label: `Node ${nodes.length + 1}`,
      position: { x: Math.random() * 300, y: Math.random() * 300 },
    };
    const res = await publicRequest.post("/createNode", newNode);
    console.log(res.data);
    setNodes((prevNodes) => [...prevNodes, res.data.data]);
  };

  const addEdge = async () => {
    setCreateEdge((prev) => !prev);
    setCreateSource(null);
    setCreateTarget(null);
  };

  const handleUpdateLabel = (e, node, label) => {
    if (label) {
      const updatedNodes = nodes.map((ele) => {
        return ele._id === node._id ? { ...ele, label } : ele;
      });
      setNodes(updatedNodes);

      async function updateNode() {
        const updateNode = await publicRequest.put("/updateNode", {
          nodeId: node._id,
          label: label,
          position: { x: e.clientX, y: e.clientY },
        });
        console.log(updateNode.data);
      }

      updateNode();
      setLabel("");
    }
  };

  const handleDelete = async (e, node) => {
    const deletedNode = nodes.filter((ele) => ele._id !== node._id);
    const deletedEdges = edges.filter((ele) => {
      return ele.source !== node._id && ele.target !== node._id;
    });
    setNodes(deletedNode);
    setEdges(deletedEdges);
    const deleteNode = await publicRequest.post("/deleteNode", {
      nodeId: node._id,
    });
    console.log(deleteNode.data);
  };

  const handleEdgeDelete = async (e, edge) => {
    const deleteEdge = edges.filter((ele) => ele._id !== edge._id);
    setEdges(deleteEdge);
    async function deletedEdge() {
      const res = await publicRequest.post("/deleteEdge", { edgeId: edge._id });
      console.log(res.data);
    }
    deletedEdge();
  };

  return (
    <div
      className="canvas"
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#f0f0f0",
        backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }}
    >
      <div>Create Node and Edges</div>
      <span>
        <button onClick={addNode}>Add Node</button>
      </span>{" "}
      &nbsp; &nbsp;{" "}
      <span>
        {createEdge ? (
          <button
            onClick={addEdge}
            style={{ backgroundColor: "black", color: "white" }}
          >
            Create edge
          </button>
        ) : (
          <button onClick={addEdge}>Create edge</button>
        )}
      </span>
      <div>
        {nodes.map((node) => (
          <NodeComp
            key={node._id}
            node={node}
            onDrag={(e) => handleDrag(e, node)}
            onDragStart={(e) => handleDragStart(e, node)}
            onDragOver={(e) => handleDragover(e, node)}
            onDrop={(e) => handleDrop(e, node)}
            onClick={(e) => handleNodeClick(e, node._id)}
            onResize={handleResize}
            setIsResizing={setIsResizing}
            isResizing={isResizing}
            onDelete={(e) => handleDelete(e, node)}
            onUpdate={(e) => handleUpdateLabel(e, node, label)}
            setLabel={setLabel}
            label={label}
          />
        ))}
        {edges.map((edge, ind) => {
          const sourcePos = nodes.find((n) => n._id === edge.source)?.position;
          const targetPos = nodes.find((n) => n._id === edge.target)?.position;
          return (
            <Edge
              key={ind}
              sourcePos={sourcePos}
              targetPos={targetPos}
              onDelete={(e) => handleEdgeDelete(e, edge)}
            />
          );
        })}
        
      </div>
    </div>
  );
}

export default Home;
