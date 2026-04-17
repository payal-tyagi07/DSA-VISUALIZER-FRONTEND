import React from 'react';

// Converts a level‑order array (with nulls for missing nodes) into a tree object
export const buildTree = (arr) => {
  if (!arr.length || arr[0] === null) return null;
  const nodes = arr.map(val => val !== null ? { val, left: null, right: null } : null);
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i] !== null) {
      const leftIdx = 2 * i + 1;
      const rightIdx = 2 * i + 2;
      if (leftIdx < nodes.length) nodes[i].left = nodes[leftIdx];
      if (rightIdx < nodes.length) nodes[i].right = nodes[rightIdx];
    }
  }
  return nodes[0];
};

// Recursively compute positions for tree drawing (returns a Map of node -> {x, y})
const computePositions = (root, startX = 0, y = 40, levelHeight = 60, positions = new Map()) => {
  if (!root) return 0;
  const leftWidth = root.left ? computePositions(root.left, startX, y + levelHeight, levelHeight, positions) : 0;
  const rightWidth = root.right ? computePositions(root.right, startX + leftWidth + 40, y + levelHeight, levelHeight, positions) : 0;
  const nodeX = startX + leftWidth;
  positions.set(root, { x: nodeX, y });
  return leftWidth + 40 + rightWidth;
};

export const TreeRenderer = ({ root, highlightNodes = new Set(), visitedNodes = new Set(), currentNode = null }) => {
  if (!root) return <div className="text-gray-400">Empty tree</div>;
  const positions = new Map();
  const totalWidth = computePositions(root, 40, 40, 70, positions);
  const height = Math.max(...Array.from(positions.values()).map(p => p.y)) + 60;
  return (
    <svg width={totalWidth + 80} height={height} viewBox={`0 0 ${totalWidth + 80} ${height}`} className="mx-auto">
      {Array.from(positions.entries()).map(([node, pos]) => {
        const lines = [];
        if (node.left && positions.has(node.left)) {
          const leftPos = positions.get(node.left);
          lines.push(<line key={`line-${node.val}-l`} x1={pos.x} y1={pos.y} x2={leftPos.x} y2={leftPos.y} stroke="#555" strokeWidth="2" />);
        }
        if (node.right && positions.has(node.right)) {
          const rightPos = positions.get(node.right);
          lines.push(<line key={`line-${node.val}-r`} x1={pos.x} y1={pos.y} x2={rightPos.x} y2={rightPos.y} stroke="#555" strokeWidth="2" />);
        }
        let fillColor = '#3b82f6';
        if (highlightNodes.has(node)) fillColor = '#eab308';
        else if (visitedNodes.has(node)) fillColor = '#22c55e';
        else if (currentNode === node) fillColor = '#f97316';
        lines.push(
          <circle key={`circle-${node.val}`} cx={pos.x} cy={pos.y} r="20" fill={fillColor} stroke="#222" strokeWidth="2" />,
          <text key={`text-${node.val}`} x={pos.x} y={pos.y + 5} textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">{node.val}</text>
        );
        return lines;
      })}
    </svg>
  );
};