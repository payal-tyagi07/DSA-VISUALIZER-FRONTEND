import React, { useState, useEffect } from 'react';

const FordFulkerson = () => {
  const pseudocodeLines = [
    "procedure fordFulkerson(graph, s, t):",
    "  residual = copy of graph",
    "  maxFlow = 0",
    "  while (path = bfs(residual, s, t)):",
    "    flow = min(residual[u][v] for edge in path)",
    "    for each edge in path:",
    "      residual[u][v] -= flow",
    "      residual[v][u] += flow",
    "    maxFlow += flow",
    "  return maxFlow"
  ];
  const [graph, setGraph] = useState({
    nodes: ['S','A','B','C','D','T'],
    edges: [
      { from: 'S', to: 'A', capacity: 10 },
      { from: 'S', to: 'B', capacity: 5 },
      { from: 'A', to: 'C', capacity: 4 },
      { from: 'A', to: 'D', capacity: 8 },
      { from: 'B', to: 'D', capacity: 6 },
      { from: 'C', to: 'T', capacity: 10 },
      { from: 'D', to: 'C', capacity: 3 },
      { from: 'D', to: 'T', capacity: 7 }
    ]
  });
  const source = 'S';
  const sink = 'T';
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const generateSteps = (graph, s, t) => {
    const steps = [];
    let residual = graph.edges.map(e => ({ from: e.from, to: e.to, capacity: e.capacity }));
    let maxFlow = 0;
    steps.push({ nodes: graph.nodes, edges: residual.map(e=>({...e})), maxFlow, description: "Initialize residual graph", pseudocodeLine: 1 });
    let pathFound = true;
    while (pathFound) {
      // BFS to find augmenting path
      const adj = new Map();
      graph.nodes.forEach(node => adj.set(node, []));
      residual.forEach(edge => { adj.get(edge.from).push({ to: edge.to, cap: edge.capacity }); });
      const parent = new Map();
      const queue = [s];
      parent.set(s, null);
      let found = false;
      while (queue.length && !found) {
        const u = queue.shift();
        for (const { to: v, cap } of adj.get(u)) {
          if (cap > 0 && !parent.has(v)) {
            parent.set(v, { from: u, cap });
            if (v === t) { found = true; break; }
            queue.push(v);
          }
        }
      }
      if (!parent.has(t)) break;
      // Compute bottleneck
      let flow = Infinity;
      let v = t;
      while (v !== s) {
        const { from: u, cap } = parent.get(v);
        flow = Math.min(flow, cap);
        v = u;
      }
      // Update residual graph
      v = t;
      while (v !== s) {
        const { from: u, cap } = parent.get(v);
        const forward = residual.find(e => e.from === u && e.to === v);
        const backward = residual.find(e => e.from === v && e.to === u);
        forward.capacity -= flow;
        if (backward) backward.capacity += flow;
        else residual.push({ from: v, to: u, capacity: flow });
        v = u;
      }
      maxFlow += flow;
      steps.push({ nodes: graph.nodes, edges: residual.map(e=>({...e})), maxFlow, path: Array.from(parent.keys()), description: `Augmenting path found, flow = ${flow}, total flow = ${maxFlow}`, pseudocodeLine: 3 });
    }
    steps.push({ maxFlow, description: `Maximum flow = ${maxFlow}`, pseudocodeLine: 6 });
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(graph, source, sink));
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
  const positions = { S:{x:50,y:150}, A:{x:150,y:80}, B:{x:150,y:220}, C:{x:250,y:80}, D:{x:250,y:220}, T:{x:350,y:150} };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      <div className="text-center mb-6"><h2 className="text-3xl font-bold text-[#569cd6] mb-2">Ford-Fulkerson Algorithm</h2><div className="flex justify-center gap-4 mb-4"><span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">⏱️ Time: O(E * maxFlow)</span><span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">💾 Space: O(V+E)</span></div></div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <svg width="400" height="300" viewBox="0 0 400 300" className="mx-auto">
            {step.edges?.map((edge,i) => {
              const from = positions[edge.from], to = positions[edge.to];
              let strokeColor = '#555', label = `${edge.capacity}`;
              if (step.path && step.path.includes(edge.from) && step.path.includes(edge.to)) strokeColor = '#eab308';
              return (
                <g key={i}>
                  <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={strokeColor} strokeWidth="2" />
                  <text x={(from.x+to.x)/2} y={(from.y+to.y)/2-5} fill="#9cdcfe" fontSize="12">{label}</text>
                </g>
              );
            })}
            {step.nodes?.map(node => <circle key={node} cx={positions[node].x} cy={positions[node].y} r="20" fill="#3b82f6" stroke="#222" strokeWidth="2" />)}
            {step.nodes?.map(node => <text key={`t-${node}`} x={positions[node].x} y={positions[node].y+5} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{node}</text>)}
          </svg>
          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]"><p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {step.description}</p><p className="text-[#4ec9b0] mt-2">Current max flow = {step.maxFlow}</p></div>
          {/* progress, speed, buttons (same) */}
          <div><div className="flex justify-between text-sm text-gray-400 mb-1"><span>Progress</span><span>{Math.round(((currentStep+1)/steps.length)*100)}%</span></div><div className="w-full bg-[#1a1a1a] rounded-full h-3 overflow-hidden"><div className="bg-[#4ec9b0] h-3 rounded-full transition-all" style={{ width: `${((currentStep+1)/steps.length)*100}%` }}></div></div><div className="text-center text-xs text-gray-500 mt-1">Step {currentStep+1} of {steps.length}</div></div>
          <div className="flex items-center justify-center gap-4 bg-[#0d0d0d] p-3 rounded-lg"><span>⏱️ Speed:</span><input type="range" min="300" max="2000" value={speed} onChange={(e) => setSpeed(e.target.value)} className="w-48 md:w-64 accent-[#4ec9b0]" /><span className="bg-[#1a1a1a] px-3 py-1 rounded-full">{speed}ms</span></div>
          <div className="flex justify-center gap-4 flex-wrap">
            <button onClick={() => { setCurrentStep(Math.max(0, currentStep-1)); setIsPlaying(false); }} disabled={currentStep===0} className={`px-6 py-3 rounded-lg font-semibold transition-all ${currentStep===0 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : 'bg-[#0e639c] hover:bg-[#1177bb] text-white'}`}>← Prev</button>
            <button onClick={() => { setCurrentStep(0); setIsPlaying(false); }} className="px-6 py-3 bg-[#c2410c] hover:bg-[#b91c1c] text-white rounded-lg">Reset</button>
            <button onClick={() => setIsPlaying(!isPlaying)} disabled={currentStep===steps.length-1} className={`px-6 py-3 rounded-lg font-semibold ${currentStep===steps.length-1 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : isPlaying ? 'bg-[#ca5100] hover:bg-[#b74700] text-white' : 'bg-[#2e7d32] hover:bg-[#1e5f20] text-white'}`}>{isPlaying ? '⏸️ Pause' : '▶️ Play'}</button>
            <button onClick={() => { setCurrentStep(Math.min(steps.length-1, currentStep+1)); setIsPlaying(false); }} disabled={currentStep===steps.length-1} className={`px-6 py-3 rounded-lg font-semibold ${currentStep===steps.length-1 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : 'bg-[#0e639c] hover:bg-[#1177bb] text-white'}`}>Next →</button>
          </div>
        </div>
        <div className="lg:w-1/3 bg-[#0a0a0a] border border-[#222222] rounded-xl p-5 font-mono text-sm shadow-inner"><h3 className="text-lg font-bold text-[#569cd6] mb-4">📝 Pseudocode</h3><div className="space-y-1">{pseudocodeLines.map((line, idx) => (<div key={idx} className={`px-3 py-1.5 rounded transition-all duration-200 ${idx === step.pseudocodeLine ? 'bg-[#1a1a1a] text-[#d4d4d4] font-semibold border-l-4 border-[#569cd6]' : 'text-[#9cdcfe] hover:bg-[#1a1a1a]'}`}>{line}</div>))}</div></div>
      </div>
    </div>
  );
};

export default FordFulkerson;