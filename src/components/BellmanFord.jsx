import React, { useState, useEffect } from 'react';
import { GraphRenderer } from './GraphRenderer';

const BellmanFord = () => {
  const pseudocodeLines = [
    "procedure bellmanFord(graph, source):",
    "  dist = [∞]*n, dist[source]=0",
    "  for i = 1 to n-1:",
    "    for each edge u->v with weight w:",
    "      if dist[u] + w < dist[v]:",
    "        dist[v] = dist[u] + w",
    "  for each edge u->v with weight w:",
    "    if dist[u] + w < dist[v]: return false (negative cycle)",
    "  return dist"
  ];
  const graph = {
    nodes: ['A','B','C','D','E'],
    edges: [
      { from: 'A', to: 'B', weight: 4 },
      { from: 'A', to: 'C', weight: 2 },
      { from: 'B', to: 'C', weight: 5 },
      { from: 'B', to: 'D', weight: 10 },
      { from: 'C', to: 'E', weight: 3 },
      { from: 'D', to: 'E', weight: 8 },
      { from: 'E', to: 'D', weight: 7 }
    ]
  };
  const source = 'A';
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const generateSteps = () => {
    const steps = [];
    const n = graph.nodes.length;
    const dist = new Map();
    graph.nodes.forEach(node => dist.set(node, Infinity));
    dist.set(source, 0);
    steps.push({ nodes: graph.nodes, edges: graph.edges, dist: new Map(dist), description: `Initialize distances: dist[${source}]=0, others ∞`, pseudocodeLine: 1 });
    for (let i = 1; i <= n-1; i++) {
      steps.push({ nodes: graph.nodes, edges: graph.edges, dist: new Map(dist), description: `Iteration ${i} of ${n-1}`, pseudocodeLine: 2 });
      let updated = false;
      for (const edge of graph.edges) {
        const u = edge.from, v = edge.to, w = edge.weight;
        if (dist.get(u) + w < dist.get(v)) {
          dist.set(v, dist.get(u) + w);
          updated = true;
          steps.push({ nodes: graph.nodes, edges: graph.edges, dist: new Map(dist), highlightEdge: edge, description: `Relax edge ${u}→${v}: new dist[${v}] = ${dist.get(v)}`, pseudocodeLine: 3 });
        }
      }
      if (!updated) break;
    }
    let hasNegativeCycle = false;
    for (const edge of graph.edges) {
      const u = edge.from, v = edge.to, w = edge.weight;
      if (dist.get(u) + w < dist.get(v)) {
        hasNegativeCycle = true;
        steps.push({ nodes: graph.nodes, edges: graph.edges, dist: new Map(dist), highlightEdge: edge, description: `Negative cycle detected via edge ${u}→${v}`, pseudocodeLine: 5 });
        break;
      }
    }
    steps.push({ nodes: graph.nodes, edges: graph.edges, dist: new Map(dist), hasNegativeCycle, description: hasNegativeCycle ? "Graph contains negative cycle" : `Shortest distances from ${source}: ${Array.from(dist.entries()).map(([n,d])=>`${n}:${d===Infinity?'∞':d}`).join(', ')}`, pseudocodeLine: 6 });
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
      <div className="text-center mb-6"><h2 className="text-3xl font-bold text-[#569cd6] mb-2">Bellman-Ford Algorithm</h2><div className="flex justify-center gap-4 mb-4"><span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">⏱️ Time: O(VE)</span><span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">💾 Space: O(V)</span></div></div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <GraphRenderer nodes={step.nodes} edges={step.edges} highlightEdges={step.highlightEdge ? new Set([step.highlightEdge]) : new Set()} />
          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]"><p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {step.description}</p><p className="text-sm text-gray-400">Distances: {step.dist ? Array.from(step.dist.entries()).map(([n,d])=>`${n}:${d===Infinity?'∞':d}`).join(', ') : ''}</p>{step.hasNegativeCycle !== undefined && <p className="text-[#4ec9b0] mt-2">Result: {step.hasNegativeCycle ? 'Negative cycle detected' : 'No negative cycle'}</p>}</div>
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

export default BellmanFord;