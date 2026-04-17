import React, { useState, useEffect } from 'react';
import DPArrayVisualizer from './DPArrayVisualizer';

const WordBreak = () => {
  const pseudocodeLines = [
    "procedure wordBreak(s, wordDict):",
    "  n = len(s)",
    "  dp = array of size n+1, dp[0]=true",
    "  for i = 1 to n:",
    "    for j = 0 to i-1:",
    "      if dp[j] and s[j:i] in wordDict:",
    "        dp[i] = true; break",
    "  return dp[n]"
  ];
  const [s, setS] = useState('leetcode');
  const [dict, setDict] = useState(['leet','code']);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [stringInput, setStringInput] = useState('leetcode');
  const [dictInput, setDictInput] = useState('leet,code');

  const update = () => {
    setS(stringInput);
    setDict(dictInput.split(',').map(w=>w.trim()));
  };

  const generateSteps = (str, wordSet) => {
    const steps = [];
    const n = str.length;
    const dp = new Array(n+1).fill(false);
    dp[0] = true;
    steps.push({ dp: [...dp], description: "Initialize dp[0]=true", pseudocodeLine: 1 });
    for (let i = 1; i <= n; i++) {
      for (let j = 0; j < i; j++) {
        if (dp[j] && wordSet.has(str.substring(j, i))) {
          dp[i] = true;
          steps.push({ dp: [...dp], current: i, description: `Word "${str.substring(j,i)}" found, dp[${i}] = true`, pseudocodeLine: 3 });
          break;
        }
      }
      if (!dp[i]) {
        steps.push({ dp: [...dp], current: i, description: `No word ending at position ${i}`, pseudocodeLine: 3 });
      }
    }
    steps.push({ dp: [...dp], result: dp[n], description: `Word break possible? ${dp[n]}` });
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(s, new Set(dict)));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [s, dict]);

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
      <div className="text-center mb-6"><h2 className="text-3xl font-bold text-[#569cd6] mb-2">Word Break</h2><div className="flex justify-center gap-4 mb-4"><span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">⏱️ Time: O(n²)</span><span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">💾 Space: O(n)</span></div></div>
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <input type="text" value={stringInput} onChange={(e) => setStringInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1" placeholder="String" />
        <input type="text" value={dictInput} onChange={(e) => setDictInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1" placeholder="Dictionary, comma separated" />
        <button onClick={update} className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">Update</button>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <div className="flex gap-2 flex-wrap justify-center mb-4">
            {s.split('').map((ch, i) => <div key={i} className="w-12 h-12 flex items-center justify-center text-xl font-mono rounded border bg-[#1e1e1e] text-white border-[#3c3c3c]">{ch}</div>)}
          </div>
          <DPArrayVisualizer array={step.dp} labels={Array.from({length: step.dp?.length}, (_,i)=>i)} highlight={{ current: step.current }} />
          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]"><p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {step.description}</p>{step.result !== undefined && <p className="text-[#4ec9b0] mt-2">Result = {step.result ? 'Yes' : 'No'}</p>}</div>
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

export default WordBreak;