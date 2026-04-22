import React, { useState, useEffect } from 'react';
import { buildTree, TreeRenderer } from './TreeRenderer';

const LowestCommonAncestor = () => {
  const pseudocodeLines = [
    "procedure lca(root, p, q):",
    "  if root == null or root == p or root == q: return root",
    "  left = lca(root.left, p, q)",
    "  right = lca(root.right, p, q)",
    "  if left and right: return root",
    "  return left ? left : right"
  ];
  const defaultTree = [3,5,1,6,2,0,8,null,null,7,4];
  const defaultP = 5, defaultQ = 1;
  const [treeArr, setTreeArr] = useState(defaultTree);
  const [pVal, setPVal] = useState(defaultP);
  const [qVal, setQVal] = useState(defaultQ);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [input, setInput] = useState('3,5,1,6,2,0,8,null,null,7,4');
  const [pInput, setPInput] = useState('5');
  const [qInput, setQInput] = useState('1');

  const updateTree = () => {
    const arr = input.split(',').map(s => s.trim()).map(s => s === 'null' ? null : Number(s));
    setTreeArr(arr);
    setPVal(Number(pInput));
    setQVal(Number(qInput));
  };

  const generateSteps = (arr, p, q) => {
    const root = buildTree(arr);
    const steps = [];
    let resultNode = null;
    const findNodes = (node) => {
      if (!node) return false;
      steps.push({ root, highlight: new Set([node]), description: `At node ${node.val}` });
      const leftContains = findNodes(node.left);
      const rightContains = findNodes(node.right);
      const currentContains = node.val === p || node.val === q;
      const total = (leftContains ? 1 : 0) + (rightContains ? 1 : 0) + (currentContains ? 1 : 0);
      if (total === 2 && !resultNode) {
        resultNode = node;
        steps.push({ root, highlight: new Set([node]), description: `Node ${node.val} is the LCA` });
      }
      return total > 0;
    };
    findNodes(root);
    steps.push({ root, result: resultNode?.val, description: `Lowest Common Ancestor = ${resultNode?.val}` });
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(treeArr, pVal, qVal));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [treeArr, pVal, qVal]);

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
      <div className="text-center mb-6"><h2 className="text-3xl font-bold text-[#569cd6] mb-2">Lowest Common Ancestor</h2><div className="flex justify-center gap-4 mb-4"><span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">⏱️ Time: O(logn)</span><span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">💾 Space: O(n)</span></div></div>
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 w-80" />
        <input type="number" value={pInput} onChange={(e) => setPInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 w-24" placeholder="p" />
        <input type="number" value={qInput} onChange={(e) => setQInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 w-24" placeholder="q" />
        <button onClick={updateTree} className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">Update</button>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          {step.root && <TreeRenderer root={step.root} highlightNodes={step.highlight} />}
          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]"><p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {step.description}</p>{step.result !== undefined && <p className="text-[#4ec9b0] mt-2">LCA = {step.result}</p>}</div>
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

export default LowestCommonAncestor;