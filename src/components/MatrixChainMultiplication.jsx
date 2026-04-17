import React, { useState, useEffect } from 'react';
import DPTableVisualizer from './DPTableVisualizer';

const MatrixChainMultiplication = () => {
  const pseudocodeLines = [
    "procedure matrixChainOrder(dims):",
    "  n = len(dims)-1",
    "  dp = 2D array (n x n), filled with 0",
    "  for length = 2 to n:",
    "    for i = 0 to n-length:",
    "      j = i+length-1",
    "      dp[i][j] = ∞",
    "      for k = i to j-1:",
    "        cost = dp[i][k] + dp[k+1][j] + dims[i]*dims[k+1]*dims[j+1]",
    "        dp[i][j] = min(dp[i][j], cost)",
    "  return dp[0][n-1]"
  ];
  const [dims, setDims] = useState([10,20,30,40,30]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [input, setInput] = useState('10,20,30,40,30');

  const updateDims = () => {
    const arr = input.split(',').map(Number).filter(n=>!isNaN(n));
    if (arr.length) setDims(arr);
  };

  const generateSteps = (dims) => {
    const steps = [];
    const n = dims.length - 1;
    const dp = Array(n).fill().map(() => Array(n).fill(0));
    steps.push({ dp: dp.map(row=>[...row]), n, description: "Initialize dp[i][i]=0", pseudocodeLine: 1 });
    for (let len = 2; len <= n; len++) {
      for (let i = 0; i <= n - len; i++) {
        const j = i + len - 1;
        dp[i][j] = Infinity;
        for (let k = i; k < j; k++) {
          const cost = dp[i][k] + dp[k+1][j] + dims[i] * dims[k+1] * dims[j+1];
          if (cost < dp[i][j]) {
            dp[i][j] = cost;
            steps.push({ dp: dp.map(row=>[...row]), n, current: [i,j], k, cost, dims, description: `dp[${i}][${j}] = min(..., ${cost}) from k=${k}`, pseudocodeLine: 4 });
          }
        }
      }
    }
    steps.push({ dp: dp.map(row=>[...row]), n, result: dp[0][n-1], description: `Minimum multiplications = ${dp[0][n-1]}` });
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(dims));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [dims]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(currentStep + 1), speed);
    } else if (currentStep === steps.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  const step = steps[currentStep] || {};
  const rowLabels = Array.from({length: step.n}, (_,i)=>i);
  const colLabels = Array.from({length: step.n}, (_,i)=>i);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      <div className="text-center mb-6"><h2 className="text-3xl font-bold text-[#569cd6] mb-2">Matrix Chain Multiplication</h2><div className="flex justify-center gap-4 mb-4"><span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">⏱️ Time: O(n³)</span><span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">💾 Space: O(n²)</span></div></div>
      <div className="flex flex-wrap justify-center gap-4 mb-6"><input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1" placeholder="dimensions, comma separated" /><button onClick={updateDims} className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">Update</button></div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <DPTableVisualizer table={step.dp} rows={step.n} cols={step.n} rowLabels={rowLabels} colLabels={colLabels} highlight={{ current: step.current }} />
          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]"><p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {step.description}</p>{step.result !== undefined && <p className="text-[#4ec9b0] mt-2">Result = {step.result}</p>}</div>
          {/* progress, speed, buttons (standard) */}
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

export default MatrixChainMultiplication;