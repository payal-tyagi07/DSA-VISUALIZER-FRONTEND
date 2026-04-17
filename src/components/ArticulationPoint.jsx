import React, { useState, useEffect } from 'react';
import { GraphRenderer } from './GraphRenderer';

const ArticulationPoint = () => {
  const pseudocodeLines = [
    "procedure findArticulationPoints(graph):",
    "  id = 0",
    "  ids = array of size n, initialized to -1",
    "  low = array of size n",
    "  articulation = set()",
    "  function dfs(at, parent, root):",
    "    visited[at] = true",
    "    ids[at] = low[at] = id++",
    "    children = 0",
    "    for to in graph[at]:",
    "      if to == parent: continue",
    "      if ids[to] == -1:",
    "        children++",
    "        dfs(to, at, false)",
    "        low[at] = min(low[at], low[to])",
    "        if (parent != -1 and ids[at] <= low[to]) or (parent == -1 and children > 1):",
    "          articulation.add(at)",
    "      else:",
    "        low[at] = min(low[at], ids[to])",
    "  for i in 0..n-1: if ids[i]==-1: dfs(i, -1, true)",
    "  return articulation"
  ];

  const graph = {
    nodes: ['A','B','C','D','E','F'],
    edges: [
      { from: 'A', to: 'B' }, { from: 'B', to: 'C' },
      { from: 'C', to: 'D' }, { from: 'D', to: 'E' },
      { from: 'E', to: 'F' }, { from: 'B', to: 'D' } // B and D are articulation points? Let's test.
    ]
  };
  // A typical graph: A-B-C-D-E, with an extra edge B-D. Then articulation points: B and D? Actually C becomes articulation? Let's use a known example.

  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const buildAdj = (edges, nodes) => {
    const adj = new Map();
    nodes.forEach(n => adj.set(n, []));
    edges.forEach(e => {
      adj.get(e.from).push(e.to);
      adj.get(e.to).push(e.from);
    });
    return adj;
  };

  const generateSteps = () => {
    const steps = [];
    const nodes = graph.nodes;
    const adj = buildAdj(graph.edges, nodes);
    const ids = new Map();
    const low = new Map();
    const visited = new Set();
    let idCounter = 0;
    const articulation = new Set();

    const dfs = (at, parent, isRoot) => {
      visited.add(at);
      ids.set(at, idCounter);
      low.set(at, idCounter);
      idCounter++;
      let children = 0;
      steps.push({ nodes: graph.nodes, edges: graph.edges, visited: new Set(visited), ids: new Map(ids), low: new Map(low), currentNode: at, description: `Visit ${at}, ids=${ids.get(at)}, low=${low.get(at)}`, pseudocodeLine: 4 });
      for (const to of adj.get(at)) {
        if (to === parent) continue;
        if (!visited.has(to)) {
          children++;
          steps.push({ nodes: graph.nodes, edges: graph.edges, visited: new Set(visited), ids: new Map(ids), low: new Map(low), currentNode: at, highlightNodes: new Set([to]), description: `DFS to child ${to}`, pseudocodeLine: 7 });
          dfs(to, at, false);
          low.set(at, Math.min(low.get(at), low.get(to)));
          steps.push({ nodes: graph.nodes, edges: graph.edges, visited: new Set(visited), ids: new Map(ids), low: new Map(low), currentNode: at, description: `After return, low[${at}] = ${low.get(at)}`, pseudocodeLine: 8 });
          if ((!isRoot && ids.get(at) <= low.get(to)) || (isRoot && children > 1)) {
            articulation.add(at);
            steps.push({ nodes: graph.nodes, edges: graph.edges, visited: new Set(visited), ids: new Map(ids), low: new Map(low), highlightNodes: new Set([at]), description: `Articulation point: ${at}`, pseudocodeLine: 9 });
          }
        } else {
          low.set(at, Math.min(low.get(at), ids.get(to)));
          steps.push({ nodes: graph.nodes, edges: graph.edges, visited: new Set(visited), ids: new Map(ids), low: new Map(low), currentNode: at, highlightNodes: new Set([to]), description: `Back edge to ${to}, update low[${at}] = ${low.get(at)}`, pseudocodeLine: 10 });
        }
      }
    };

    for (const node of nodes) {
      if (!visited.has(node)) {
        steps.push({ nodes: graph.nodes, edges: graph.edges, description: `Start DFS from ${node}`, pseudocodeLine: 2 });
        dfs(node, null, true);
      }
    }
    steps.push({ nodes: graph.nodes, edges: graph.edges, articulation: Array.from(articulation), description: `Articulation points: ${Array.from(articulation).join(', ')}`, pseudocodeLine: 11 });
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
      <div className="text-center mb-6"><h2 className="text-3xl font-bold text-[#569cd6] mb-2">Articulation Points</h2><div className="flex justify-center gap-4 mb-4"><span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">⏱️ Time: O(V+E)</span><span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">💾 Space: O(V+E)</span></div></div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <GraphRenderer nodes={step.nodes} edges={step.edges} visitedNodes={step.visited} currentNode={step.currentNode} highlightNodes={step.highlightNodes} />
          {step.ids && <div className="text-sm text-gray-400">IDs: {Array.from(step.ids.entries()).map(([n,i])=>`${n}:${i}`).join(', ')}</div>}
          {step.low && <div className="text-sm text-gray-400">Low: {Array.from(step.low.entries()).map(([n,l])=>`${n}:${l}`).join(', ')}</div>}
          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]"><p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {step.description}</p>{step.articulation && <p className="text-[#4ec9b0] mt-2">Articulation points: {step.articulation.join(', ')}</p>}</div>
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

export default ArticulationPoint;