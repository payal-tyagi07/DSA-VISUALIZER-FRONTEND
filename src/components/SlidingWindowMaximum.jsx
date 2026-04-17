import React, { useState, useEffect } from 'react';

const SlidingWindowMaximum = () => {
  const pseudocodeLines = [
    "procedure maxSlidingWindow(nums, k):",
    "  deque = []",
    "  result = []",
    "  for i = 0 to n-1:",
    "    while deque and nums[deque[-1]] < nums[i]: deque.pop()",
    "    deque.push(i)",
    "    if deque[0] <= i - k: deque.popLeft()",
    "    if i >= k-1: result.push(nums[deque[0]])",
    "  return result"
  ];

  const [nums, setNums] = useState([1,3,-1,-3,5,3,6,7]);
  const [k, setK] = useState(3);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [input, setInput] = useState('1,3,-1,-3,5,3,6,7');
  const [kInput, setKInput] = useState('3');

  const updateNums = () => {
    const newArr = input.split(',').map(Number).filter(n => !isNaN(n));
    if (newArr.length) setNums(newArr);
    setK(Number(kInput));
  };

  const generateSteps = (arr, windowSize) => {
    const steps = [];
    const n = arr.length;
    let deque = [];
    let result = [];
    steps.push({ nums: arr, k: windowSize, deque: [...deque], result: [...result], description: "Start", pseudocodeLine: 1 });
    for (let i = 0; i < n; i++) {
      // Remove smaller elements from back
      while (deque.length > 0 && arr[deque[deque.length-1]] < arr[i]) {
        const removed = deque.pop();
        steps.push({ nums: arr, deque: [...deque], result: [...result], highlight: i, description: `Remove index ${removed} from back (${arr[removed]} < ${arr[i]})`, pseudocodeLine: 3 });
      }
      deque.push(i);
      steps.push({ nums: arr, deque: [...deque], result: [...result], highlight: i, description: `Push index ${i} to deque`, pseudocodeLine: 4 });
      // Remove out-of-window from front
      if (deque[0] <= i - windowSize) {
        const removed = deque.shift();
        steps.push({ nums: arr, deque: [...deque], result: [...result], highlight: i, description: `Remove index ${removed} from front (out of window)`, pseudocodeLine: 5 });
      }
      // Record result
      if (i >= windowSize - 1) {
        const maxVal = arr[deque[0]];
        result.push(maxVal);
        steps.push({ nums: arr, deque: [...deque], result: [...result], highlight: i, description: `Window [${i-windowSize+1}..${i}] max = ${maxVal}`, pseudocodeLine: 6 });
      }
    }
    steps.push({ result, description: `Sliding window maximum: ${result.join(', ')}`, pseudocodeLine: 7 });
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(nums, k));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [nums, k]);

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
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Sliding Window Maximum</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">⏱️ Time: O(n)</span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">💾 Space: O(k)</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1" />
        <input type="number" value={kInput} onChange={(e) => setKInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 w-20" min="1" />
        <button onClick={updateNums} className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">Update</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          {/* Array display */}
          <div>
            <div className="text-sm text-[#9cdcfe] mb-1">Input array</div>
            <div className="flex gap-1">
              {step.nums?.map((val, idx) => (
                <div key={idx} className={`w-12 h-12 flex flex-col items-center justify-center text-lg font-mono rounded border ${idx === step.highlight ? 'bg-yellow-500 text-black' : 'bg-[#1e1e1e] text-white'} border-[#3c3c3c]`}>
                  <span>{val}</span>
                  <span className="text-xs text-gray-400">{idx}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Deque display */}
          <div>
            <div className="text-sm text-[#9cdcfe] mb-1">Deque (indices, front ← → back)</div>
            <div className="flex gap-1">
              {step.deque?.map((idx, i) => (
                <div key={i} className="w-12 h-12 flex items-center justify-center text-lg font-mono rounded border bg-green-500 text-white border-[#3c3c3c]">
                  {idx}
                </div>
              ))}
              {step.deque?.length === 0 && <div className="text-gray-400">(empty)</div>}
            </div>
          </div>
          {/* Result display */}
          <div>
            <div className="text-sm text-[#9cdcfe] mb-1">Result</div>
            <div className="flex gap-1">
              {step.result?.map((val, idx) => (
                <div key={idx} className="w-12 h-12 flex items-center justify-center text-lg font-mono rounded border bg-blue-500 text-white border-[#3c3c3c]">
                  {val}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]">
            <p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {step.description}</p>
            {step.result && step.result.length > 0 && <p className="text-[#4ec9b0] mt-2">Current max window result: [{step.result.join(', ')}]</p>}
          </div>

          {/* Progress, speed, buttons (same) */}
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

export default SlidingWindowMaximum;