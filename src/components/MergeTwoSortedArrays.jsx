import React, { useState, useEffect } from 'react';

const MergeTwoSortedArrays = () => {
  const pseudocodeLines = [
    "procedure merge(arr1, arr2, m, n):",
    "  i = m-1, j = n-1, k = m+n-1",
    "  while i >= 0 and j >= 0:",
    "    if arr1[i] > arr2[j]: arr1[k--] = arr1[i--]",
    "    else: arr1[k--] = arr2[j--]",
    "  while j >= 0: arr1[k--] = arr2[j--]"
  ];

  const defaultArr1 = [1,3,5,7];
  const defaultArr2 = [2,4,6,8];
  const [arr1, setArr1] = useState(defaultArr1);
  const [arr2, setArr2] = useState(defaultArr2);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [input1, setInput1] = useState('1,3,5,7');
  const [input2, setInput2] = useState('2,4,6,8');

  const updateArrays = () => {
    const newArr1 = input1.split(',').map(Number).filter(n => !isNaN(n));
    const newArr2 = input2.split(',').map(Number).filter(n => !isNaN(n));
    setArr1(newArr1);
    setArr2(newArr2);
  };

  const generateSteps = (a1, a2) => {
    const steps = [];
    let m = a1.length, n = a2.length;
    let i = m-1, j = n-1, k = m+n-1;
    let merged = [...a1, ...a2];
    steps.push({ merged: [...merged], i, j, k, description: `Start: i=${i}, j=${j}, k=${k}`, pseudocodeLine: 1 });

    while (i >= 0 && j >= 0) {
      if (a1[i] > a2[j]) {
        merged[k] = a1[i];
        steps.push({ merged: [...merged], i, j, k, highlight: [k], description: `arr1[${i}] = ${a1[i]} > arr2[${j}] → place at ${k}`, pseudocodeLine: 3 });
        i--; k--;
      } else {
        merged[k] = a2[j];
        steps.push({ merged: [...merged], i, j, k, highlight: [k], description: `arr2[${j}] = ${a2[j]} ≥ arr1[${i}] → place at ${k}`, pseudocodeLine: 4 });
        j--; k--;
      }
      if (i >=0 && j >=0) steps.push({ merged: [...merged], i, j, k, description: `Now i=${i}, j=${j}, k=${k}`, pseudocodeLine: 2 });
    }
    while (j >= 0) {
      merged[k] = a2[j];
      steps.push({ merged: [...merged], i, j, k, highlight: [k], description: `Place remaining arr2[${j}] = ${a2[j]} at ${k}`, pseudocodeLine: 5 });
      j--; k--;
    }
    steps.push({ merged, description: `Merged array: [${merged.join(',')}]` });
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(arr1, arr2));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [arr1, arr2]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(currentStep + 1), speed);
    } else if (currentStep === steps.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  const step = steps[currentStep] || {};

  const getBgColor = (idx) => {
    if (step.highlight && step.highlight.includes(idx)) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Merge Two Sorted Arrays (in‑place)</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">⏱️ Time: O(m+n)</span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">💾 Space: O(1)</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <input type="text" value={input1} onChange={(e) => setInput1(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1" placeholder="Array1" />
        <input type="text" value={input2} onChange={(e) => setInput2(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1" placeholder="Array2" />
        <button onClick={updateArrays} className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">Update</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <div className="flex justify-center gap-2 flex-wrap">
            {step.merged?.map((val, idx) => (
              <div key={idx} className={`w-16 h-16 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-2xl ${getBgColor(idx)} border-2 border-[#222222]`}>
                {val}
              </div>
            ))}
          </div>
          <div className="text-sm text-gray-400 text-center">
            {step.i !== undefined && <span>i = {step.i} </span>}
            {step.j !== undefined && <span>j = {step.j} </span>}
            {step.k !== undefined && <span>k = {step.k}</span>}
          </div>

          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]">
            <p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {step.description}</p>
          </div>

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

export default MergeTwoSortedArrays;