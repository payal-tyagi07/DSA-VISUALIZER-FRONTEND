import React, { useState, useEffect } from 'react';

const BitwiseAndRange = () => {
  const [bitWidth, setBitWidth] = useState(8);
  const [left, setLeft] = useState(5);
  const [right, setRight] = useState(7);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  // Constrain numbers to fit within bitWidth (positive only for this problem)
  const maxVal = (1 << bitWidth) - 1;
  const validLeft = Math.min(Math.max(left, 0), maxVal);
  const validRight = Math.min(Math.max(right, 0), maxVal);

  // Helper to get binary string padded to bitWidth
  const toBinary = (num, width) => {
    return num.toString(2).padStart(width, '0');
  };

  // Generate detailed steps
  const generateSteps = (l, r, width) => {
    const steps = [];
    let a = l;
    let b = r;
    let shift = 0;

    steps.push({
      left: a,
      right: b,
      shift,
      description: `Find bitwise AND of all numbers from ${a} to ${b}`,
    });

    while (a !== b) {
      steps.push({
        left: a,
        right: b,
        shift,
        description: `Current range: [${a}, ${b}]. Since they differ, shift both right by 1.`,
      });
      a >>= 1;
      b >>= 1;
      shift++;
      steps.push({
        left: a,
        right: b,
        shift,
        description: `After shift: left = ${a} (binary ${toBinary(a, width - shift)}), right = ${b} (binary ${toBinary(b, width - shift)})`,
      });
    }

    const result = a << shift;
    steps.push({
      final: true,
      result,
      shift,
      description: `Common prefix = ${a} (binary ${toBinary(a, width - shift)}), shift back ${shift} places → result = ${result} (binary ${toBinary(result, width)})`,
    });
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(validLeft, validRight, bitWidth));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [validLeft, validRight, bitWidth]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(currentStep + 1), speed);
    } else if (currentStep === steps.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  const step = steps[currentStep] || {};

  // Render binary representation with current bit highlight (if any)
  const renderBinary = (num, width, highlightShift = -1) => {
    const binary = toBinary(num, width);
    return (
      <div className="flex gap-1">
        {binary.split('').map((bit, idx) => (
          <div
            key={idx}
            className={`w-10 h-10 flex items-center justify-center text-lg font-mono rounded border ${
              // Highlight the bits that are being shifted away? Not needed, but we can highlight the whole row.
              false ? 'bg-yellow-500 text-black' : 'bg-[#1e1e1e] text-white'
            } border-[#3c3c3c]`}
          >
            {bit}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Bitwise AND of Numbers Range</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">⏱️ Time: O(log n)</span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">💾 Space: O(1)</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-[#9cdcfe]">Bit width:</label>
          <input
            type="number"
            min="1"
            max="16"
            value={bitWidth}
            onChange={(e) => setBitWidth(Math.min(16, Math.max(1, Number(e.target.value))))}
            className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 w-20 text-center"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[#9cdcfe]">Left:</label>
          <input
            type="number"
            min="0"
            max={maxVal}
            value={left}
            onChange={(e) => setLeft(Number(e.target.value))}
            className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 w-28 text-center"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[#9cdcfe]">Right:</label>
          <input
            type="number"
            min="0"
            max={maxVal}
            value={right}
            onChange={(e) => setRight(Number(e.target.value))}
            className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 w-28 text-center"
          />
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-[#9cdcfe] mb-1">Left (binary)</div>
        {renderBinary(validLeft, bitWidth)}
        <div className="text-sm text-[#9cdcfe] mt-3 mb-1">Right (binary)</div>
        {renderBinary(validRight, bitWidth)}
      </div>

      <div className="bg-[#0d0d0d] p-3 rounded-lg border-l-4 border-[#569cd6] mb-4">
        <p className="text-gray-300">{step.description}</p>
        {step.shift !== undefined && !step.final && (
          <div className="mt-2 text-sm text-gray-400">
            <div>Current shift count: {step.shift}</div>
            <div>Current left after shifts: {step.left}</div>
            <div>Current right after shifts: {step.right}</div>
          </div>
        )}
        {step.final && (
          <div className="mt-2 text-[#4ec9b0]">
            <div>Result = {step.result} (binary: {toBinary(step.result, bitWidth)})</div>
          </div>
        )}
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

export default BitwiseAndRange;