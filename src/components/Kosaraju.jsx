import React, { useState, useEffect } from 'react';

const Kosaraju = () => {
  const pseudocodeLines = [
    "procedure kosaraju(graph):",
    "  visited = set()",
    "  stack = []",
    "  function dfs1(node):",
    "    visited.add(node)",
    "    for neighbor in graph[node]:",
    "      if neighbor not in visited: dfs1(neighbor)",
    "    stack.push(node)",
    "  for node in graph: if node not in visited: dfs1(node)",
    "  transpose = reverse all edges",
    "  visited.clear()",
    "  sccs = []",
    "  while stack not empty:",
    "    node = stack.pop()",
    "    if node not in visited:",
    "      scc = []",
    "      dfs2(node, scc)",
    "      sccs.append(scc)",
    "  return sccs",
    "function dfs2(node, scc):",
    "  visited.add(node)",
    "  scc.push(node)",
    "  for neighbor in transpose[node]:",
    "    if neighbor not in visited: dfs2(neighbor, scc)"
  ];

  const graph = {
    nodes: ['A','B','C','D','E'],
    edges: [
      { from: 'A', to: 'B' }, { from: 'B', to: 'C' },
      { from: 'C', to: 'A' }, { from: 'B', to: 'D' },
      { from: 'D', to: 'E' }, { from: 'E', to: 'D' }
    ]
  };
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const buildAdj = (edges, nodes) => {
    const adj = new Map();
    nodes.forEach(n => adj.set(n, []));
    edges.forEach(e => adj.get(e.from).push(e.to));
    return adj;
  };

  const buildTranspose = (edges, nodes) => {
    const adj = new Map();
    nodes.forEach(n => adj.set(n, []));
    edges.forEach(e => adj.get(e.to).push(e.from));
    return adj;
  };

  const generateSteps = () => {
    const steps = [];
    const nodes = graph.nodes;
    const adj = buildAdj(graph.edges, nodes);
    const transpose = buildTranspose(graph.edges, nodes);
    let visited = new Set();
    let stack = [];
    let sccs = [];

    const dfs1 = (node) => {
      visited.add(node);
      steps.push({ nodes: graph.nodes, edges: graph.edges, visited: new Set(visited), currentNode: node, description: `DFS1 visit ${node}`, phase: 1, pseudocodeLine: 4 });
      for (const neighbor of adj.get(node)) {
        if (!visited.has(neighbor)) {
          steps.push({ nodes: graph.nodes, edges: graph.edges, visited: new Set(visited), highlightNodes: new Set([neighbor]), description: `DFS1 go to neighbor ${neighbor}`, phase: 1, pseudocodeLine: 5 });
          dfs1(neighbor);
        } else {
          steps.push({ nodes: graph.nodes, edges: graph.edges, visited: new Set(visited), highlightNodes: new Set([neighbor]), description: `Neighbor ${neighbor} already visited`, phase: 1, pseudocodeLine: 5 });
        }
      }
      stack.push(node);
      steps.push({ nodes: graph.nodes, edges: graph.edges, visited: new Set(visited), stack: [...stack], description: `DFS1 finish ${node}, push to stack`, phase: 1, pseudocodeLine: 6 });
    };

    for (const node of nodes) {
      if (!visited.has(node)) {
        steps.push({ nodes: graph.nodes, edges: graph.edges, visited: new Set(visited), description: `Start DFS1 from ${node}`, phase: 1, pseudocodeLine: 2 });
        dfs1(node);
      }
    }

    steps.push({ nodes: graph.nodes, edges: graph.edges, stack: [...stack], description: "Step 1 complete: stack order", phase: 1, pseudocodeLine: 7 });

    visited.clear();
    steps.push({ nodes: graph.nodes, edges: transpose, description: "Step 2: build transpose graph", phase: 2, pseudocodeLine: 8 });

    const dfs2 = (node, scc) => {
      visited.add(node);
      scc.push(node);
      steps.push({ nodes: graph.nodes, edges: transpose, visited: new Set(visited), currentNode: node, description: `DFS2 visit ${node} (part of SCC)`, phase: 2, pseudocodeLine: 12 });
      for (const neighbor of transpose.get(node)) {
        if (!visited.has(neighbor)) {
          steps.push({ nodes: graph.nodes, edges: transpose, visited: new Set(visited), highlightNodes: new Set([neighbor]), description: `DFS2 go to neighbor ${neighbor}`, phase: 2, pseudocodeLine: 13 });
          dfs2(neighbor, scc);
        }
      }
    };

    while (stack.length) {
      const node = stack.pop();
      if (!visited.has(node)) {
        const scc = [];
        steps.push({ nodes: graph.nodes, edges: transpose, stack: [...stack], description: `Pop ${node}, start new SCC`, phase: 2, pseudocodeLine: 10 });
        dfs2(node, scc);
        sccs.push(scc);
        steps.push({ nodes: graph.nodes, edges: transpose, sccs: [...sccs.map(s => [...s])], description: `Found SCC: ${scc.join(', ')}`, phase: 2, pseudocodeLine: 11 });
      } else {
        steps.push({ nodes: graph.nodes, edges: transpose, stack: [...stack], description: `Pop ${node} already visited`, phase: 2, pseudocodeLine: 10 });
      }
    }

    steps.push({ nodes: graph.nodes, edges: graph.edges, sccs: sccs.map(s => [...s]), description: `Strongly Connected Components: ${sccs.map(s => `[${s.join(',')}]`).join(' ')}`, pseudocodeLine: 14 });
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps());
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(currentStep + 1), speed);
    } else if (currentStep === steps.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  const step = steps[currentStep] || {};

  const getSCCColors = () => {
    if (!step.sccs) return {};
    const colors = ['#22c55e', '#eab308', '#f97316', '#06b6d4', '#8b5cf6'];
    const nodeColor = {};
    step.sccs.forEach((scc, idx) => {
      scc.forEach(node => { nodeColor[node] = colors[idx % colors.length]; });
    });
    return nodeColor;
  };

  const renderGraph = () => {
    const nodes = step.nodes || graph.nodes;
    const edges = step.edges || [];
    const sccColors = getSCCColors();
    const visited = step.visited || new Set();
    const currentNode = step.currentNode;
    const highlightNodes = step.highlightNodes || new Set();
    const positions = {
      'A': { x: 100, y: 100 }, 'B': { x: 200, y: 50 }, 'C': { x: 200, y: 150 },
      'D': { x: 300, y: 100 }, 'E': { x: 400, y: 100 }, 'F': { x: 300, y: 200 }
    };
    return (
      <svg width="700" height="350" viewBox="0 0 700 350" className="mx-auto">
        {edges.map((edge, i) => {
          const from = positions[edge.from];
          const to = positions[edge.to];
          if (!from || !to) return null;
          let strokeColor = '#555';
          if (step.highlightEdges?.has(edge)) strokeColor = '#eab308';
          return <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={strokeColor} strokeWidth="2" />;
        })}
        {nodes.map(node => {
          const pos = positions[node];
          if (!pos) return null;
          let fillColor = sccColors[node] || '#3b82f6';
          if (highlightNodes.has(node)) fillColor = '#eab308';
          else if (visited.has(node)) fillColor = '#22c55e';
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

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Kosaraju's Algorithm (SCC)</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">⏱️ Time: O(V+E)</span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">💾 Space: O(V+E)</span>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          {renderGraph()}
          {step.stack && <div className="text-sm text-gray-400">Stack: [{step.stack.join(', ')}]</div>}
          {step.sccs && <div className="text-sm text-[#4ec9b0]">SCCs: {step.sccs.map(s => `[${s.join(',')}]`).join(' ')}</div>}
          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]">
            <p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {step.description}</p>
          </div>
          <div>
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Progress</span><span>{Math.round(((currentStep+1)/steps.length)*100)}%</span>
            </div>
            <div className="w-full bg-[#1a1a1a] rounded-full h-3 overflow-hidden">
              <div className="bg-[#4ec9b0] h-3 rounded-full transition-all" style={{ width: `${((currentStep+1)/steps.length)*100}%` }}></div>
            </div>
            <div className="text-center text-xs text-gray-500 mt-1">Step {currentStep+1} of {steps.length}</div>
          </div>
          <div className="flex items-center justify-center gap-4 bg-[#0d0d0d] p-3 rounded-lg">
            <span>⏱️ Speed:</span>
            <input type="range" min="300" max="2000" value={speed} onChange={(e) => setSpeed(e.target.value)} className="w-48 md:w-64 accent-[#4ec9b0]" />
            <span className="bg-[#1a1a1a] px-3 py-1 rounded-full">{speed}ms</span>
          </div>
          <div className="flex justify-center gap-4 flex-wrap">
            <button onClick={() => { setCurrentStep(Math.max(0, currentStep-1)); setIsPlaying(false); }} disabled={currentStep===0} className={`px-6 py-3 rounded-lg font-semibold transition-all ${currentStep===0 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : 'bg-[#0e639c] hover:bg-[#1177bb] text-white'}`}>← Prev</button>
            <button onClick={() => { setCurrentStep(0); setIsPlaying(false); }} className="px-6 py-3 bg-[#c2410c] hover:bg-[#b91c1c] text-white rounded-lg">Reset</button>
            <button onClick={() => setIsPlaying(!isPlaying)} disabled={currentStep===steps.length-1} className={`px-6 py-3 rounded-lg font-semibold ${currentStep===steps.length-1 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : isPlaying ? 'bg-[#ca5100] hover:bg-[#b74700] text-white' : 'bg-[#2e7d32] hover:bg-[#1e5f20] text-white'}`}>{isPlaying ? '⏸️ Pause' : '▶️ Play'}</button>
            <button onClick={() => { setCurrentStep(Math.min(steps.length-1, currentStep+1)); setIsPlaying(false); }} disabled={currentStep===steps.length-1} className={`px-6 py-3 rounded-lg font-semibold ${currentStep===steps.length-1 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : 'bg-[#0e639c] hover:bg-[#1177bb] text-white'}`}>Next →</button>
          </div>
        </div>
        <div className="lg:w-1/3 bg-[#0a0a0a] border border-[#222222] rounded-xl p-5 font-mono text-sm shadow-inner">
          <h3 className="text-lg font-bold text-[#569cd6] mb-4">📝 Pseudocode</h3>
          <div className="space-y-1">
            {pseudocodeLines.map((line, idx) => (
              <div key={idx} className={`px-3 py-1.5 rounded transition-all duration-200 ${idx === step.pseudocodeLine ? 'bg-[#1a1a1a] text-[#d4d4d4] font-semibold border-l-4 border-[#569cd6]' : 'text-[#9cdcfe] hover:bg-[#1a1a1a]'}`}>{line}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kosaraju;