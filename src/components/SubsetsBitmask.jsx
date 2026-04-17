import React, { useState, useEffect } from 'react';

const SubsetsBitmask = () => {
  const [nums, setNums] = useState([1, 2, 3]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [input, setInput] = useState('1,2,3');

  const updateNums = () => {
    const newArr = input.split(',').map(Number).filter(n => !isNaN(n));
    if (newArr.length) setNums(newArr);
  };

  // Generate a step for each mask
  const generateSteps = (arr) => {
    const steps = [];
    const n = arr.length;
    const totalMasks = 1 << n;
    steps.push({
      nums: arr,
      totalMasks,
      description: `Generate all subsets of [${arr.join(', ')}]. There are 2^${n} = ${totalMasks} subsets.`,
    });
    for (let mask = 0; mask < totalMasks; mask++) {
      const subset = [];
      const bits = [];
      for (let i = 0; i < n; i++) {
        bits.push((mask >> i) & 1);
        if ((mask >> i) & 1) {
          subset.push(arr[i]);
        }
      }
      steps.push({
        mask,
        bits,
        subset,
        description: `Mask ${mask} (binary ${mask.toString(2).padStart(n, '0')}) → subset [${subset.join(', ')}]`,
      });
    }
    steps.push({
      final: true,
      description: `All subsets generated. Total: ${totalMasks}`,
    });
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(nums));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [nums]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(currentStep + 1), speed);
    } else if (currentStep === steps.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  const step = steps[currentStep] || {};

  // Render bits as a row of squares
  const renderBits = (bits) => (
    <div className="flex gap-1">
      {bits?.map((bit, idx) => (
        <div
          key={idx}
          className={`w-10 h-10 flex items-center justify-center text-lg font-mono rounded border ${
            bit === 1 ? 'bg-green-500 text-white' : 'bg-[#1e1e1e] text-white'
          } border-[#3c3c3c]`}
        >
          {bit}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Subsets using Bitmask</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">⏱️ Time: O(n * 2^n)</span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">💾 Space: O(2^n)</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1"
          placeholder="Comma‑separated numbers"
        />
        <button onClick={updateNums} className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">
          Update
        </button>
      </div>

      <div className="mb-4">
        <div className="text-sm text-[#9cdcfe] mb-1">Set: [{step.nums?.join(', ')}]</div>
        {step.bits && (
          <>
            <div className="text-sm text-[#9cdcfe] mt-2 mb-1">Bitmask (LSB = index 0)</div>
            {renderBits(step.bits)}
            <div className="text-sm text-[#9cdcfe] mt-2 mb-1">Subset</div>
            <div className="flex gap-1">
              {step.subset?.map((val, idx) => (
                <div
                  key={idx}
                  className="w-10 h-10 flex items-center justify-center text-lg font-mono rounded border bg-blue-500 text-white border-[#3c3c3c]"
                >
                  {val}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="bg-[#0d0d0d] p-3 rounded-lg border-l-4 border-[#569cd6] mb-4">
        <p className="text-gray-300">{step.description}</p>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>Progress</span>
          <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
        </div>
        <div className="w-full bg-[#1a1a1a] rounded-full h-3 overflow-hidden">
          <div className="bg-[#4ec9b0] h-3 rounded-full transition-all" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}></div>
        </div>
        <div className="text-center text-xs text-gray-500 mt-1">Step {currentStep + 1} of {steps.length}</div>
      </div>

      <div className="flex items-center justify-center gap-4 bg-[#0d0d0d] p-3 rounded-lg mb-4">
        <span>⏱️ Speed:</span>
        <input type="range" min="300" max="2000" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-48 md:w-64 accent-[#4ec9b0]" />
        <span className="bg-[#1a1a1a] px-3 py-1 rounded-full">{speed}ms</span>
      </div>

      <div className="flex justify-center gap-4 flex-wrap">
        <button onClick={() => { setCurrentStep(Math.max(0, currentStep - 1)); setIsPlaying(false); }} disabled={currentStep === 0} className={`px-6 py-3 rounded-lg font-semibold transition-all ${currentStep === 0 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : 'bg-[#0e639c] hover:bg-[#1177bb] text-white'}`}>← Prev</button>
        <button onClick={() => { setCurrentStep(0); setIsPlaying(false); }} className="px-6 py-3 bg-[#c2410c] hover:bg-[#b91c1c] text-white rounded-lg">Reset</button>
        <button onClick={() => setIsPlaying(!isPlaying)} disabled={currentStep === steps.length - 1} className={`px-6 py-3 rounded-lg font-semibold ${currentStep === steps.length - 1 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : isPlaying ? 'bg-[#ca5100] hover:bg-[#b74700] text-white' : 'bg-[#2e7d32] hover:bg-[#1e5f20] text-white'}`}>{isPlaying ? '⏸️ Pause' : '▶️ Play'}</button>
        <button onClick={() => { setCurrentStep(Math.min(steps.length - 1, currentStep + 1)); setIsPlaying(false); }} disabled={currentStep === steps.length - 1} className={`px-6 py-3 rounded-lg font-semibold ${currentStep === steps.length - 1 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : 'bg-[#0e639c] hover:bg-[#1177bb] text-white'}`}>Next →</button>
      </div>
    </div>
  );
};

export default SubsetsBitmask;