import React, { useState, useEffect } from 'react';

const BitwiseOperations = () => {
  // State for inputs and animation
  const [bitWidth, setBitWidth] = useState(4);
  const [a, setA] = useState(5);   // 0101
  const [b, setB] = useState(3);   // 0011
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  // Validate that numbers fit within the chosen bit width
  const maxVal = (1 << bitWidth) - 1;
  const validA = Math.min(Math.max(0, a), maxVal);
  const validB = Math.min(Math.max(0, b), maxVal);

  // Helper to get binary string padded to bitWidth
  const toBinary = (num) => {
    return num.toString(2).padStart(bitWidth, '0');
  };

  // Generate steps for each bit position (from MSB to LSB)
  const generateSteps = (numA, numB, width) => {
    const steps = [];
    for (let i = width - 1; i >= 0; i--) {
      const bitA = (numA >> i) & 1;
      const bitB = (numB >> i) & 1;
      const andBit = bitA & bitB;
      const orBit = bitA | bitB;
      const xorBit = bitA ^ bitB;
      steps.push({ i, bitA, bitB, andBit, orBit, xorBit });
    }
    // Final step shows full results
    const andResult = numA & numB;
    const orResult = numA | numB;
    const xorResult = numA ^ numB;
    steps.push({ final: true, andResult, orResult, xorResult });
    return steps;
  };

  // Regenerate steps when numbers or bit width change
  useEffect(() => {
    setSteps(generateSteps(validA, validB, bitWidth));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [validA, validB, bitWidth]);

  // Auto‑play effect
  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(currentStep + 1), speed);
    } else if (currentStep === steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  const step = steps[currentStep] || {};

  // Get binary strings for full numbers (for the results panel)
  const binaryA = toBinary(validA);
  const binaryB = toBinary(validB);
  const binaryAnd = toBinary(validA & validB);
  const binaryOr = toBinary(validA | validB);
  const binaryXor = toBinary(validA ^ validB);

  // For the animated bits, we show the bits with the current step highlighted
  const renderBitRow = (label, bits, highlightIdx) => (
    <div className="flex items-center gap-2 mb-2">
      <span className="w-12 text-right text-[#9cdcfe]">{label}</span>
      <div className="flex gap-1">
        {bits.split('').map((ch, idx) => (
          <div
            key={idx}
            className={`w-10 h-10 flex items-center justify-center text-lg font-mono rounded border ${
              idx === highlightIdx ? 'bg-yellow-500 text-black' : 'bg-[#1e1e1e] text-white'
            } border-[#3c3c3c]`}
          >
            {ch}
          </div>
        ))}
      </div>
    </div>
  );

  // Results row (shows the final values, not animated)
  const renderResultRow = (label, value, binary) => (
    <div className="flex items-center gap-2 mb-2">
      <span className="w-12 text-right text-[#9cdcfe]">{label}</span>
      <div className="flex gap-1">
        {binary.split('').map((ch, idx) => (
          <div
            key={idx}
            className="w-10 h-10 flex items-center justify-center text-lg font-mono rounded border bg-[#2d2d2d] text-white border-[#3c3c3c]"
          >
            {ch}
          </div>
        ))}
      </div>
      <span className="text-gray-400 ml-2">= {value}</span>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Bitwise Operations</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">⏱️ Time: O(1)</span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">💾 Space: O(1)</span>
        </div>
      </div>

      {/* Controls for bit width and numbers */}
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
        <div className="flex items-center gap-2">
          <label className="text-[#9cdcfe]">A:</label>
          <input
            type="number"
            min="0"
            max={maxVal}
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
            className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 w-24 text-center"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[#9cdcfe]">B:</label>
          <input
            type="number"
            min="0"
            max={maxVal}
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 w-24 text-center"
          />
        </div>
      </div>

      {/* Animated bit rows */}
      <div className="mb-4">
        {renderBitRow('A', binaryA, step.i !== undefined ? bitWidth - 1 - step.i : -1)}
        {renderBitRow('B', binaryB, step.i !== undefined ? bitWidth - 1 - step.i : -1)}
      </div>

      {/* Operation results (updated live) */}
      <div className="border-t border-[#3c3c3c] pt-4 mb-4">
        <h3 className="text-lg font-bold text-[#9cdcfe] mb-2">Results</h3>
        {renderResultRow('AND', validA & validB, binaryAnd)}
        {renderResultRow('OR', validA | validB, binaryOr)}
        {renderResultRow('XOR', validA ^ validB, binaryXor)}
      </div>

      {/* Step description */}
      <div className="bg-[#0d0d0d] p-3 rounded-lg border-l-4 border-[#569cd6] mb-4">
        <p className="text-gray-300">
          {step.final
            ? `Final results: AND = ${step.andResult}, OR = ${step.orResult}, XOR = ${step.xorResult}`
            : `Bit ${step.i}: ${step.bitA} & ${step.bitB} = ${step.andBit}  |  ${step.bitA} | ${step.bitB} = ${step.orBit}  |  ${step.bitA} ^ ${step.bitB} = ${step.xorBit}`}
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>Progress</span>
          <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
        </div>
        <div className="w-full bg-[#1a1a1a] rounded-full h-3 overflow-hidden">
          <div
            className="bg-[#4ec9b0] h-3 rounded-full transition-all"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
        <div className="text-center text-xs text-gray-500 mt-1">Step {currentStep + 1} of {steps.length}</div>
      </div>

      {/* Speed control */}
      <div className="flex items-center justify-center gap-4 bg-[#0d0d0d] p-3 rounded-lg mb-4">
        <span>⏱️ Speed:</span>
        <input
          type="range"
          min="300"
          max="2000"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="w-48 md:w-64 accent-[#4ec9b0]"
        />
        <span className="bg-[#1a1a1a] px-3 py-1 rounded-full">{speed}ms</span>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4 flex-wrap">
        <button
          onClick={() => { setCurrentStep(Math.max(0, currentStep - 1)); setIsPlaying(false); }}
          disabled={currentStep === 0}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${currentStep === 0 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : 'bg-[#0e639c] hover:bg-[#1177bb] text-white'}`}
        >← Prev</button>
        <button
          onClick={() => { setCurrentStep(0); setIsPlaying(false); }}
          className="px-6 py-3 bg-[#c2410c] hover:bg-[#b91c1c] text-white rounded-lg"
        >Reset</button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          disabled={currentStep === steps.length - 1}
          className={`px-6 py-3 rounded-lg font-semibold ${currentStep === steps.length - 1 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : isPlaying ? 'bg-[#ca5100] hover:bg-[#b74700] text-white' : 'bg-[#2e7d32] hover:bg-[#1e5f20] text-white'}`}
        >{isPlaying ? '⏸️ Pause' : '▶️ Play'}</button>
        <button
          onClick={() => { setCurrentStep(Math.min(steps.length - 1, currentStep + 1)); setIsPlaying(false); }}
          disabled={currentStep === steps.length - 1}
          className={`px-6 py-3 rounded-lg font-semibold ${currentStep === steps.length - 1 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : 'bg-[#0e639c] hover:bg-[#1177bb] text-white'}`}
        >Next →</button>
      </div>
    </div>
  );
};

export default BitwiseOperations;