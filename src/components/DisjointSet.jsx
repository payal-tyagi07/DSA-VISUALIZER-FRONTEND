import React, { useState, useEffect } from 'react';
import { GraphRenderer } from './GraphRenderer';

const DisjointSet = () => {
  const pseudocodeLines = [
    "class DisjointSet:",
    "  parent = []",
    "  rank = []",
    "  find(x):",
    "    if parent[x] != x: parent[x] = find(parent[x])",
    "    return parent[x]",
    "  union(x, y):",
    "    rootX = find(x), rootY = find(y)",
    "    if rootX == rootY: return false",
    "    if rank[rootX] < rank[rootY]: parent[rootX] = rootY",
    "    else if rank[rootX] > rank[rootY]: parent[rootY] = rootX",
    "    else: parent[rootY] = rootX; rank[rootX]++",
    "    return true"
  ];
  const elements = ['A','B','C','D','E','F'];
  const operations = [
    { type: 'union', a: 'A', b: 'B' },
    { type: 'union', a: 'C', b: 'D' },
    { type: 'union', a: 'A', b: 'C' },
    { type: 'find', a: 'B', b: 'D' },
    { type: 'union', a: 'E', b: 'F' },
    { type: 'find', a: 'A', b: 'E' }
  ];
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const generateSteps = () => {
    const steps = [];
    const parent = new Map(elements.map(el => [el, el]));
    const rank = new Map(elements.map(el => [el, 0]));
    steps.push({ elements, parent: new Map(parent), rank: new Map(rank), description: "Initialize: each element is its own parent", pseudocodeLine: 0 });
    const find = (x, stepIdx) => {
      if (parent.get(x) !== x) {
        const orig = parent.get(x);
        parent.set(x, find(parent.get(x), stepIdx));
        steps.push({ elements, parent: new Map(parent), rank: new Map(rank), highlight: x, description: `Path compression: ${x} now points to ${parent.get(x)}`, pseudocodeLine: 1 });
      }
      return parent.get(x);
    };
    const union = (x, y) => {
      const rootX = find(x);
      const rootY = find(y);
      steps.push({ elements, parent: new Map(parent), rank: new Map(rank), highlight: [rootX, rootY], description: `Find roots of ${x} and ${y}: ${rootX}, ${rootY}`, pseudocodeLine: 2 });
      if (rootX === rootY) return false;
      if (rank.get(rootX) < rank.get(rootY)) {
        parent.set(rootX, rootY);
        steps.push({ elements, parent: new Map(parent), rank: new Map(rank), highlight: [rootX, rootY], description: `Union by rank: attach ${rootX} under ${rootY}`, pseudocodeLine: 3 });
      } else if (rank.get(rootX) > rank.get(rootY)) {
        parent.set(rootY, rootX);
        steps.push({ elements, parent: new Map(parent), rank: new Map(rank), highlight: [rootX, rootY], description: `Union by rank: attach ${rootY} under ${rootX}`, pseudocodeLine: 3 });
      } else {
        parent.set(rootY, rootX);
        rank.set(rootX, rank.get(rootX) + 1);
        steps.push({ elements, parent: new Map(parent), rank: new Map(rank), highlight: [rootX, rootY], description: `Union by rank: attach ${rootY} under ${rootX}, increase rank of ${rootX}`, pseudocodeLine: 4 });
      }
      return true;
    };
    for (const op of operations) {
      if (op.type === 'union') {
        const success = union(op.a, op.b);
        steps.push({ elements, parent: new Map(parent), rank: new Map(rank), description: `Union(${op.a}, ${op.b}) ${success ? 'successful' : 'already in same set'}`, pseudocodeLine: 2 });
      } else if (op.type === 'find') {
        const rootA = find(op.a);
        const rootB = find(op.b);
        steps.push({ elements, parent: new Map(parent), rank: new Map(rank), result: rootA === rootB, description: `Find(${op.a}) = ${rootA}, Find(${op.b}) = ${rootB} → same set? ${rootA === rootB}`, pseudocodeLine: 1 });
      }
    }
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

  const getParentTree = () => {
    // Build a simple tree representation for display (optional)
    const tree = {};
    if (step.parent) {
      for (const [el, p] of step.parent.entries()) {
        if (el !== p) tree[p] = tree[p] || [];
        tree[p].push(el);
      }
    }
    return tree;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      <div className="text-center mb-6"><h2 className="text-3xl font-bold text-[#569cd6] mb-2">Disjoint Set (Union-Find)</h2><div className="flex justify-center gap-4 mb-4"><span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">⏱️ Near O(1)</span><span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">💾 Space: O(n)</span></div></div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <div className="bg-[#1e1e1e] p-4 rounded">
            <p className="text-[#9cdcfe]">Parent pointers</p>
            <div className="flex flex-wrap gap-4">
              {step.parent && Array.from(step.parent.entries()).map(([el, p]) => (
                <div key={el} className={`p-2 rounded ${step.highlight === el ? 'bg-yellow-800' : ''}`}>{el} → {p}</div>
              ))}
            </div>
          </div>
          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]"><p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {step.description}</p>{step.result !== undefined && <p className="text-[#4ec9b0] mt-2">Result: {step.result ? 'Same set' : 'Different sets'}</p>}</div>
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

export default DisjointSet;