import React, { useState, useEffect } from 'react';

const DijkstraAlgorithm = () => {
  const pseudocodeLines = [
    "procedure dijkstra(graph, source):",
    "  dist = [∞] * n",
    "  dist[source] = 0",
    "  pq = min-heap of (dist, node)",
    "  while pq not empty:",
    "    u = pq.pop()",
    "    for each neighbor v of u:",
    "      if dist[u] + weight(u,v) < dist[v]:",
    "        dist[v] = dist[u] + weight(u,v)",
    "        pq.push((dist[v], v))",
    "  return dist"
  ];

  const graph = {
    nodes: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    edges: [
      { from: 'A', to: 'B', weight: 10 },
      { from: 'A', to: 'C', weight: 17 },
      { from: 'B', to: 'D', weight: 7 },
      { from: 'C', to: 'D', weight: 8 },
      { from: 'C', to: 'E', weight: 15 },
      { from: 'D', to: 'E', weight: 5 },
      { from: 'D', to: 'F', weight: 12 },
      { from: 'E', to: 'G', weight: 9 },
      { from: 'F', to: 'G', weight: 11 },
      { from: 'G', to: 'H', weight: 6 }
    ]
  };
  const source = 'A';
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const generateSteps = (graph, src) => {
    const steps = [];
    const nodes = graph.nodes;
    const n = nodes.length;
    const nodeIndex = Object.fromEntries(nodes.map((node, i) => [node, i]));
    const dist = new Array(n).fill(Infinity);
    dist[nodeIndex[src]] = 0;
    const visited = new Array(n).fill(false);
    const pq = [{ node: src, dist: 0 }];
    steps.push({ nodes, edges: graph.edges, dist: [...dist], current: src, visited: [...visited], description: `Initialize distances: dist[${src}] = 0, others ∞`, pseudocodeLine: 1 });
    while (pq.length) {
      pq.sort((a,b) => a.dist - b.dist);
      const { node: u, dist: du } = pq.shift();
      const uIdx = nodeIndex[u];
      if (visited[uIdx]) continue;
      visited[uIdx] = true;
      steps.push({ nodes, edges: graph.edges, dist: [...dist], current: u, visited: [...visited], description: `Visit ${u} (distance ${du})`, pseudocodeLine: 4 });
      for (const edge of graph.edges) {
        let v = null;
        let weight = null;
        if (edge.from === u) { v = edge.to; weight = edge.weight; }
        else if (edge.to === u) { v = edge.from; weight = edge.weight; }
        if (v) {
          const vIdx = nodeIndex[v];
          const newDist = du + weight;
          if (newDist < dist[vIdx]) {
            dist[vIdx] = newDist;
            pq.push({ node: v, dist: newDist });
            steps.push({ nodes, edges: graph.edges, dist: [...dist], current: u, highlightEdge: edge, description: `Update distance to ${v}: ${newDist}`, pseudocodeLine: 5 });
          }
        }
      }
    }
    steps.push({ nodes, edges: graph.edges, dist, description: `Final distances: ${nodes.map((node,i)=>`${node}=${dist[i]}`).join(', ')}`, pseudocodeLine: 7 });
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(graph, source));
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

  // Fixed positions for nodes (for visualization)
  const positions = {
    'A': { x: 100, y: 100 },
    'B': { x: 200, y: 50 },
    'C': { x: 200, y: 150 },
    'D': { x: 300, y: 100 },
    'E': { x: 400, y: 100 },
    'F': { x: 300, y: 200 },
    'G': { x: 500, y: 100 },
    'H': { x: 600, y: 100 }
  };

  const getNodeColor = (node) => {
    const idx = step.nodes?.indexOf(node);
    if (step.current === node) return '#eab308';
    if (step.visited && step.visited[idx]) return '#22c55e';
    return '#3b82f6';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Dijkstra's Algorithm</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">⏱️ Time: O((V+E) log V)</span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">💾 Space: O(V)</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          {/* Graph visualization */}
          <svg width="700" height="300" viewBox="0 0 700 300" className="mx-auto">
            {step.edges?.map((edge, i) => {
              const from = positions[edge.from];
              const to = positions[edge.to];
              let strokeColor = '#555';
              if (step.highlightEdge && ((step.highlightEdge.from === edge.from && step.highlightEdge.to === edge.to) || (step.highlightEdge.from === edge.to && step.highlightEdge.to === edge.from))) {
                strokeColor = '#eab308';
              }
              return <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={strokeColor} strokeWidth="2" />;
            })}
            {step.nodes?.map((node) => (
              <g key={node}>
                <circle cx={positions[node].x} cy={positions[node].y} r="24" fill={getNodeColor(node)} stroke="#222" strokeWidth="2" />
                <text x={positions[node].x} y={positions[node].y+5} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{node}</text>
              </g>
            ))}
          </svg>

          {/* Distance table */}
          <div className="overflow-x-auto">
            <table className="mx-auto border-collapse">
              <thead>
                <tr>
                  <th className="border border-[#3c3c3c] p-2">Node</th>
                  {step.nodes?.map(node => <th key={node} className="border border-[#3c3c3c] p-2">{node}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-[#3c3c3c] p-2 font-bold">Distance</td>
                  {step.dist?.map((d, idx) => <td key={idx} className="border border-[#3c3c3c] p-2 text-center">{d === Infinity ? '∞' : d}</td>)}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]">
            <p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {step.description}</p>
          </div>

          {/* Progress, speed, buttons (same) */}
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

export default DijkstraAlgorithm;