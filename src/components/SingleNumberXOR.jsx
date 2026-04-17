import React, { useState, useEffect } from 'react';

const SingleNumberXOR = () => {
  const [bitWidth, setBitWidth] = useState(4);
  const [nums, setNums] = useState([4, 1, 2, 1, 2]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [input, setInput] = useState('4,1,2,1,2');

  const updateNums = () => {
    const newArr = input.split(',').map(Number).filter(n => !isNaN(n));
    if (newArr.length) setNums(newArr);
  };

  const toBinary = (n) => n.toString(2).padStart(bitWidth, '0');

  const generateSteps = (arr) => {
    const steps = [];
    let xor = 0;
    steps.push({ xor, description: "Start: xor = 0" });
    for (let i = 0; i < arr.length; i++) {
      xor ^= arr[i];
      steps.push({ xor, index: i, value: arr[i], description: `XOR with ${arr[i]} → new xor = ${xor}` });
    }
    steps.push({ final: true, result: xor, description: `Single number = ${xor}` });
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
  const maxVal = (1 << bitWidth) - 1;

  // For each number, show its binary representation if within range, else show '?'
  const getBinary = (n) => (n >= 0 && n <= maxVal ? toBinary(n) : '?'.repeat(bitWidth));

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Single Number (XOR)</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">⏱️ Time: O(n)</span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">💾 Space: O(1)</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-[#9cdcfe]">Bit width:</label>
          <input
            type="number"
            min="1"
            max="8"
            value={bitWidth}
            onChange={(e) => setBitWidth(Math.min(8, Math.max(1, Number(e.target.value))))}
            className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 w-20 text-center"
          />
        </div>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1" />
        <button onClick={updateNums} className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">Update</button>
      </div>

      <div className="space-y-2 mb-6">
        {nums.map((num, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="w-12 text-right text-[#9cdcfe]">Num {idx}:</span>
            <span className="text-white">{num}</span>
            <span className="text-gray-400 ml-2">({getBinary(num)})</span>
            {idx === step.index && <span className="text-yellow-500 ml-2">← processing</span>}
          </div>
        ))}
      </div>

      <div className="bg-[#0d0d0d] p-3 rounded-lg border-l-4 border-[#569cd6] mb-4">
        <p className="text-gray-300">{step.description}</p>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>Progress</span><span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
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

export default SingleNumberXOR;