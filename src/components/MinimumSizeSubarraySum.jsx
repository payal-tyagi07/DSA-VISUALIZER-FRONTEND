import React, { useState, useEffect } from 'react';

const MinimumSizeSubarraySum = () => {
  const pseudocodeLines = [
    "procedure minSubArrayLen(target, nums):",
    "  left = 0, sum = 0, minLen = Infinity",
    "  for right = 0 to n-1:",
    "    sum += nums[right]",
    "    while sum >= target:",
    "      minLen = min(minLen, right-left+1)",
    "      sum -= nums[left]",
    "      left++",
    "  return minLen == Infinity ? 0 : minLen"
  ];

  const [nums, setNums] = useState([2,3,1,2,4,3]);
  const [target, setTarget] = useState(7);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [input, setInput] = useState('2,3,1,2,4,3');
  const [targetInput, setTargetInput] = useState('7');

  const update = () => {
    const newArr = input.split(',').map(Number).filter(n => !isNaN(n));
    if (newArr.length) setNums(newArr);
    setTarget(Number(targetInput));
  };

  const generateSteps = (arr, targetVal) => {
    const steps = [];
    let left = 0, sum = 0, minLen = Infinity;
    steps.push({ nums: arr, target: targetVal, left, right: -1, sum, minLen, description: "Start", pseudocodeLine: 1 });
    for (let right = 0; right < arr.length; right++) {
      sum += arr[right];
      steps.push({ nums: arr, target: targetVal, left, right, sum, minLen, description: `Add arr[${right}] = ${arr[right]}, sum = ${sum}`, pseudocodeLine: 3 });
      while (sum >= targetVal) {
        const len = right - left + 1;
        if (len < minLen) {
          minLen = len;
          steps.push({ nums: arr, target: targetVal, left, right, sum, minLen, description: `New min length = ${minLen} (window [${left}..${right}])`, pseudocodeLine: 4 });
        } else {
          steps.push({ nums: arr, target: targetVal, left, right, sum, minLen, description: `Window [${left}..${right}] sum >= target, length = ${len}`, pseudocodeLine: 4 });
        }
        sum -= arr[left];
        steps.push({ nums: arr, target: targetVal, left, right, sum, minLen, description: `Remove arr[${left}] = ${arr[left]}, sum = ${sum}`, pseudocodeLine: 5 });
        left++;
        if (left <= right) steps.push({ nums: arr, target: targetVal, left, right, sum, minLen, description: `Move left to ${left}`, pseudocodeLine: 6 });
      }
    }
    const result = minLen === Infinity ? 0 : minLen;
    steps.push({ result, description: `Minimum subarray length = ${result}`, pseudocodeLine: 7 });
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(nums, target));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [nums, target]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(currentStep + 1), speed);
    } else if (currentStep === steps.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  const step = steps[currentStep] || {};

  const getHighlight = (idx) => {
    if (step.left !== undefined && idx >= step.left && idx <= step.right) return 'bg-yellow-500 text-black';
    return 'bg-[#1e1e1e] text-white';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Minimum Size Subarray Sum</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">⏱️ Time: O(n)</span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">💾 Space: O(1)</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1" />
        <input type="number" value={targetInput} onChange={(e) => setTargetInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 w-24" />
        <button onClick={update} className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">Update</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <div>
            <div className="text-sm text-[#9cdcfe] mb-1">Array</div>
            <div className="flex gap-1">
              {step.nums?.map((val, idx) => (
                <div key={idx} className={`w-12 h-12 flex flex-col items-center justify-center text-lg font-mono rounded border ${getHighlight(idx)} border-[#3c3c3c]`}>
                  <span>{val}</span>
                  <span className="text-xs text-gray-400">{idx}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]">
            <p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {step.description}</p>
            {step.sum !== undefined && <p className="text-[#4ec9b0] mt-2">Current sum = {step.sum}</p>}
            {step.minLen !== undefined && step.minLen !== Infinity && <p className="text-[#4ec9b0] mt-2">Current min length = {step.minLen}</p>}
            {step.result !== undefined && <p className="text-[#4ec9b0] mt-2">Result = {step.result}</p>}
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

export default MinimumSizeSubarraySum;