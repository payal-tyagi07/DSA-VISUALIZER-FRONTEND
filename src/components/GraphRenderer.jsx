import React from 'react';

// Fixed positions for nodes (you can extend for more nodes)
const defaultPositions = {
  'A': { x: 100, y: 100 },
  'B': { x: 200, y: 50 },
  'C': { x: 200, y: 150 },
  'D': { x: 300, y: 100 },
  'E': { x: 400, y: 100 },
  'F': { x: 300, y: 200 },
  'G': { x: 500, y: 100 },
  'H': { x: 600, y: 100 },
  'S': { x: 100, y: 200 },
  'T': { x: 600, y: 200 }
};

export const GraphRenderer = ({ nodes, edges, highlightNodes = new Set(), highlightEdges = new Set(), visitedNodes = new Set(), currentNode = null, positions = defaultPositions }) => {
  if (!nodes || nodes.length === 0) return <div className="text-gray-400">No graph data</div>;
  return (
    <svg width="700" height="350" viewBox="0 0 700 350" className="mx-auto">
      {/* Draw edges first */}
      {edges.map((edge, i) => {
        const from = positions[edge.from];
        const to = positions[edge.to];
        if (!from || !to) return null;
        let strokeColor = '#555';
        if (highlightEdges.has(edge) || (edge.id && highlightEdges.has(edge.id))) strokeColor = '#eab308';
        else if (edge.inMST) strokeColor = '#22c55e';
        const label = edge.weight !== undefined ? edge.weight : '';
        return (
          <g key={i}>
            <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={strokeColor} strokeWidth="2" />
            {label && <text x={(from.x+to.x)/2} y={(from.y+to.y)/2-5} fill="#9cdcfe" fontSize="12">{label}</text>}
          </g>
        );
      })}
      {/* Draw nodes */}
      {nodes.map((node) => {
        const pos = positions[node];
        if (!pos) return null;
        let fillColor = '#3b82f6';
        if (highlightNodes.has(node)) fillColor = '#eab308';
        else if (visitedNodes.has(node)) fillColor = '#22c55e';
        else if (currentNode === node) fillColor = '#f97316';
        return (
          <g key={node}>
            <circle cx={pos.x} cy={pos.y} r="24" fill={fillColor} stroke="#222" strokeWidth="2" />
            <text x={pos.x} y={pos.y+5} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{node}</text>
          </g>
        );
      })}
    </svg>
  );
};