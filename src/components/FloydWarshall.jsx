import React, { useState, useEffect } from 'react';
import { GraphRenderer } from './GraphRenderer';

const FloydWarshall = () => {
  const pseudocodeLines = [
    "procedure floydWarshall(graph):",
    "  dist = matrix of size n x n, initialize with ∞",
    "  for each node i: dist[i][i] = 0",
    "  for each edge i->j with weight w: dist[i][j] = w",
    "  for k in 0..n-1:",
    "    for i in 0..n-1:",
    "      for j in 0..n-1:",
    "        if dist[i][k] + dist[k][j] < dist[i][j]:",
    "          dist[i][j] = dist[i][k] + dist[k][j]",
    "  return dist"
  ];
  const graph = {
    nodes: ['A','B','C','D'],
    edges: [
      { from: 'A', to: 'B', weight: 3 },
      { from: 'A', to: 'C', weight: 8 },
      { from: 'B', to: 'C', weight: 2 },
      { from: 'B', to: 'D', weight: 1 },
      { from: 'C', to: 'D', weight: 5 }
    ]
  };
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const generateSteps = () => {
    const steps = [];
    const n = graph.nodes.length;
    const nodeIndex = new Map(graph.nodes.map((node, i) => [node, i]));
    const dist = Array(n).fill().map(() => Array(n).fill(Infinity));
    for (let i = 0; i < n; i++) dist[i][i] = 0;
    for (const edge of graph.edges) {
      const i = nodeIndex.get(edge.from);
      const j = nodeIndex.get(edge.to);
      dist[i][j] = edge.weight;
    }
    steps.push({ nodes: graph.nodes, dist: dist.map(row => [...row]), description: "Initial distance matrix", pseudocodeLine: 1 });
    for (let k = 0; k < n; k++) {
      const kNode = graph.nodes[k];
      steps.push({ nodes: graph.nodes, dist: dist.map(row => [...row]), k: kNode, description: `Intermediate node ${kNode}`, pseudocodeLine: 3 });
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (dist[i][k] + dist[k][j] < dist[i][j]) {
            const old = dist[i][j];
            dist[i][j] = dist[i][k] + dist[k][j];
            steps.push({ nodes: graph.nodes, dist: dist.map(row => [...row]), i: graph.nodes[i], j: graph.nodes[j], k: kNode, description: `Update dist[${graph.nodes[i]}][${graph.nodes[j]}] from ${old===Infinity?'∞':old} to ${dist[i][j]}`, pseudocodeLine: 4 });
          }
        }
      }
    }
    steps.push({ nodes: graph.nodes, dist: dist.map(row => [...row]), description: "Final shortest distances", pseudocodeLine: 6 });
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

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      <div className="text-center mb-6"><h2 className="text-3xl font-bold text-[#569cd6] mb-2">Floyd-Warshall Algorithm</h2><div className="flex justify-center gap-4 mb-4"><span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">⏱️ Time: O(V³)</span><span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">💾 Space: O(V²)</span></div></div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <GraphRenderer nodes={step.nodes} edges={graph.edges} />
          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]"><p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {step.description}</p><p className="text-sm text-gray-400">Intermediate node: {step.k}</p><p className="text-sm text-gray-400">Update: {step.i} → {step.j}</p><div className="overflow-x-auto"><table className="w-full text-sm"><tbody>{step.dist?.map((row, i) => (<tr key={i}>{row.map((d,j) => (<td key={j} className="border p-1 text-center">{d===Infinity?'∞':d}</td>))}</tr>))}</tbody></table></div></div>
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

export default FloydWarshall;