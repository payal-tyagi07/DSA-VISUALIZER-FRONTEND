import React, { useState, useEffect } from 'react';

const KruskalsAlgorithm = () => {
  const pseudocodeLines = [
    "procedure kruskal(graph):",
    "  sort edges by weight",
    "  parent = [0..n-1]",
    "  mst = []",
    "  for edge in edges:",
    "    if find(edge.u) != find(edge.v):",
    "      union(edge.u, edge.v)",
    "      mst.append(edge)",
    "  return mst"
  ];
  const graph = {
    nodes: ['A','B','C','D','E','F','G','H'],
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
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const generateSteps = (graph) => {
    const steps = [];
    const nodes = graph.nodes;
    const n = nodes.length;
    const nodeIndex = Object.fromEntries(nodes.map((node,i)=>[node,i]));
    let edges = graph.edges.map(e => ({ from: e.from, to: e.to, weight: e.weight }));
    edges.sort((a,b) => a.weight - b.weight);
    steps.push({ nodes, edges: [...edges], description: "Sort edges by weight", pseudocodeLine: 1 });
    
    let parent = nodes.map((_,i) => i);
    const find = (x) => {
      while (parent[x] !== x) {
        parent[x] = parent[parent[x]];
        x = parent[x];
      }
      return x;
    };
    const union = (x,y) => {
      const rootX = find(x);
      const rootY = find(y);
      if (rootX !== rootY) parent[rootX] = rootY;
    };
    const mst = [];
    for (let i = 0; i < edges.length; i++) {
      const edge = edges[i];
      const u = nodeIndex[edge.from];
      const v = nodeIndex[edge.to];
      if (find(u) !== find(v)) {
        union(u, v);
        mst.push(edge);
        steps.push({ nodes, edges: edges.map(e=>({...e})), mst: [...mst], highlight: i, description: `Add edge ${edge.from}-${edge.to} (${edge.weight}) to MST`, pseudocodeLine: 4 });
      } else {
        steps.push({ nodes, edges: edges.map(e=>({...e})), mst: [...mst], highlight: i, description: `Skip edge ${edge.from}-${edge.to} (${edge.weight}) (would create cycle)`, pseudocodeLine: 3 });
      }
    }
    steps.push({ mst, description: `MST edges: ${mst.map(e=>`${e.from}-${e.to}(${e.weight})`).join(', ')}`, pseudocodeLine: 5 });
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(graph));
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
  const positions = { A:{x:100,y:100}, B:{x:200,y:50}, C:{x:200,y:150}, D:{x:300,y:100}, E:{x:400,y:100}, F:{x:300,y:200}, G:{x:500,y:100}, H:{x:600,y:100} };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      <div className="text-center mb-6"><h2 className="text-3xl font-bold text-[#569cd6] mb-2">Kruskal's Algorithm</h2><div className="flex justify-center gap-4 mb-4"><span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">⏱️ Time: O(E log E)</span><span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">💾 Space: O(V)</span></div></div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <svg width="700" height="300" viewBox="0 0 700 300" className="mx-auto">
            {step.edges?.map((edge,i) => {
              const from = positions[edge.from], to = positions[edge.to];
              let strokeColor = '#555';
              if (i === step.highlight) strokeColor = '#eab308';
              else if (step.mst?.some(e=> (e.from===edge.from && e.to===edge.to) || (e.from===edge.to && e.to===edge.from))) strokeColor = '#22c55e';
              return <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={strokeColor} strokeWidth="2" />;
            })}
            {step.nodes?.map(node => <circle key={node} cx={positions[node].x} cy={positions[node].y} r="24" fill="#3b82f6" stroke="#222" strokeWidth="2" />)}
            {step.nodes?.map(node => <text key={`t-${node}`} x={positions[node].x} y={positions[node].y+5} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{node}</text>)}
          </svg>
          <div className="overflow-x-auto"><table className="mx-auto border-collapse"><thead><tr><th>Edge</th><th>Weight</th><th>Action</th></tr></thead><tbody>{step.edges?.map((edge,i) => (<tr key={i} className={i === step.highlight ? 'bg-yellow-800' : ''}><td className="border p-2">{edge.from}-{edge.to}</td><td className="border p-2">{edge.weight}</td><td className="border p-2">{step.mst?.some(e=>(e.from===edge.from && e.to===edge.to))?'Added':(i < step.highlight?'Skipped':'')}</td></tr>))}</tbody></table></div>
          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]"><p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {step.description}</p></div>
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

export default KruskalsAlgorithm;