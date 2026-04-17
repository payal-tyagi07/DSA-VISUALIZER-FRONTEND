import React, { useState, useEffect } from 'react';
import DPTableVisualizer from './DPTableVisualizer';

const LongestCommonSubsequence = () => {
  const pseudocodeLines = [
    "procedure LCS(s1, s2):",
    "  m = len(s1), n = len(s2)",
    "  dp = 2D array of size (m+1) x (n+1)",
    "  for i = 0 to m: dp[i][0] = 0",
    "  for j = 0 to n: dp[0][j] = 0",
    "  for i = 1 to m:",
    "    for j = 1 to n:",
    "      if s1[i-1] == s2[j-1]:",
    "        dp[i][j] = dp[i-1][j-1] + 1",
    "      else:",
    "        dp[i][j] = max(dp[i-1][j], dp[i][j-1])",
    "  return dp[m][n]"
  ];
  const [s1, setS1] = useState('ABCBDAB');
  const [s2, setS2] = useState('BDCAB');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const generateSteps = (str1, str2) => {
    const steps = [];
    const m = str1.length, n = str2.length;
    const dp = Array(m+1).fill().map(() => Array(n+1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = 0;
    for (let j = 0; j <= n; j++) dp[0][j] = 0;
    steps.push({ dp: dp.map(row => [...row]), m, n, s1: str1, s2: str2, description: "Initialize DP table", pseudocodeLine: 2 });
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i-1] === str2[j-1]) {
          dp[i][j] = dp[i-1][j-1] + 1;
          steps.push({ dp: dp.map(row => [...row]), m, n, s1: str1, s2: str2, current: [i,j], description: `Match: ${str1[i-1]} == ${str2[j-1]} → dp[${i}][${j}] = dp[${i-1}][${j-1}] + 1 = ${dp[i][j]}`, pseudocodeLine: 5 });
        } else {
          dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
          steps.push({ dp: dp.map(row => [...row]), m, n, s1: str1, s2: str2, current: [i,j], description: `No match: dp[${i}][${j}] = max(dp[${i-1}][${j}], dp[${i}][${j-1}]) = ${dp[i][j]}`, pseudocodeLine: 7 });
        }
      }
    }
    steps.push({ dp: dp.map(row => [...row]), m, n, s1: str1, s2: str2, result: dp[m][n], description: `LCS length = ${dp[m][n]}` });
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(s1, s2));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [s1, s2]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(currentStep + 1), speed);
    } else if (currentStep === steps.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  const step = steps[currentStep] || {};
  const rowLabels = [''] + step.s1?.split('');
  const colLabels = [''] + step.s2?.split('');

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      <div className="text-center mb-6"><h2 className="text-3xl font-bold text-[#569cd6] mb-2">Longest Common Subsequence</h2><div className="flex justify-center gap-4 mb-4"><span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">⏱️ Time: O(m*n)</span><span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">💾 Space: O(m*n)</span></div></div>
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <input type="text" value={s1} onChange={(e) => setS1(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1" placeholder="String 1" />
        <input type="text" value={s2} onChange={(e) => setS2(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1" placeholder="String 2" />
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <DPTableVisualizer table={step.dp} rows={step.m+1} cols={step.n+1} rowLabels={rowLabels} colLabels={colLabels} highlight={{ current: step.current }} />
          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]"><p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {step.description}</p>{step.result !== undefined && <p className="text-[#4ec9b0] mt-2">LCS length = {step.result}</p>}</div>
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

export default LongestCommonSubsequence;