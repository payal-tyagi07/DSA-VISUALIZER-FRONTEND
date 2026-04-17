import React, { useState, useEffect } from 'react';

const DivideTwoIntegers = () => {
  // State for inputs and animation
  const [bitWidth, setBitWidth] = useState(8);
  const [dividend, setDividend] = useState(10);
  const [divisor, setDivisor] = useState(3);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  // Constrain numbers to signed 32‑bit range for realism, but within bitWidth
  const maxVal = (1 << (bitWidth - 1)) - 1; // positive max for signed
  const minVal = -(1 << (bitWidth - 1));
  const validDividend = Math.min(Math.max(dividend, minVal), maxVal);
  const validDivisor = Math.min(Math.max(divisor, -maxVal), maxVal);

  // Helper to get signed binary string (two's complement) for given bit width
  const toBinary = (num, width) => {
    if (num < 0) {
      // Two's complement for negative numbers
      return ((1 << width) + num).toString(2).padStart(width, '0');
    }
    return num.toString(2).padStart(width, '0');
  };

  // Generate detailed steps for division algorithm
  const generateSteps = (dividend, divisor, width) => {
    const steps = [];
    // Handle division by zero
    if (divisor === 0) {
      steps.push({ error: true, description: "Division by zero is undefined." });
      return steps;
    }

    // Determine sign
    const negative = (dividend < 0) ^ (divisor < 0);
    let a = Math.abs(dividend);
    let b = Math.abs(divisor);
    let quotient = 0;
    let remainder = a;

    // Step 0: Initial values
    steps.push({
      dividend: a,
      divisor: b,
      quotient,
      remainder,
      negative,
      description: `Compute ${dividend} ÷ ${divisor} → sign = ${negative ? '-' : '+'}`,
    });

    // Find the maximum shift: shift divisor left until it would exceed dividend
    let temp = b;
    let shift = 0;
    steps.push({
      description: `Find the highest power of 2 such that ${b} × 2^k ≤ ${a}`,
    });
    while (temp <= a) {
      temp <<= 1;
      shift++;
      steps.push({
        shiftCount: shift,
        tempValue: temp,
        description: `Shift left: ${b} << ${shift} = ${temp} (still ≤ ${a})`,
      });
    }
    shift--; // last successful shift
    if (shift >= 0) {
      steps.push({
        shift,
        maxShiftedDivisor: b << shift,
        description: `Maximum shift = ${shift}, so ${b} << ${shift} = ${b << shift}`,
      });
    } else {
      steps.push({ description: `Divisor is already larger than dividend → quotient will be 0` });
    }

    // Perform division bit by bit
    let currentRemainder = a;
    let currentQuotient = 0;
    for (let i = shift; i >= 0; i--) {
      const divisorShifted = b << i;
      // Comparison step
      steps.push({
        bitPos: i,
        divisorShifted,
        currentRemainder,
        currentQuotient,
        description: `Bit ${i}: Check if remainder (${currentRemainder}) ≥ ${divisorShifted} ?`,
      });
      if (currentRemainder >= divisorShifted) {
        // Subtraction step
        currentRemainder -= divisorShifted;
        steps.push({
          bitPos: i,
          divisorShifted,
          currentRemainder,
          description: `Yes → subtract: remainder = ${currentRemainder}`,
        });
        // Update quotient
        currentQuotient |= (1 << i);
        steps.push({
          bitPos: i,
          currentQuotient,
          description: `Set quotient bit ${i} to 1 → quotient = ${currentQuotient} (binary: ${currentQuotient.toString(2)})`,
        });
      } else {
        steps.push({
          bitPos: i,
          description: `No → quotient bit ${i} stays 0`,
        });
      }
    }
    quotient = currentQuotient;
    remainder = currentRemainder;

    // Apply sign
    const finalQuotient = negative ? -quotient : quotient;
    steps.push({
      final: true,
      quotient: finalQuotient,
      remainder,
      description: `Apply sign: quotient = ${finalQuotient}, remainder = ${remainder}`,
    });
    return steps;
  };

  // Regenerate steps when inputs change
  useEffect(() => {
    setSteps(generateSteps(validDividend, validDivisor, bitWidth));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [validDividend, validDivisor, bitWidth]);

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

  // Render binary string of a number (for display)
  const renderBinary = (num, width) => {
    const binary = toBinary(num, width);
    return (
      <div className="flex gap-1">
        {binary.split('').map((bit, idx) => (
          <div
            key={idx}
            className={`w-10 h-10 flex items-center justify-center text-lg font-mono rounded border ${
              step.bitPos === width - 1 - idx ? 'bg-yellow-500 text-black' : 'bg-[#1e1e1e] text-white'
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
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Divide Two Integers</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">⏱️ Time: O(log n)</span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">💾 Space: O(1)</span>
        </div>
      </div>

      {/* Controls */}
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
          <label className="text-[#9cdcfe]">Dividend:</label>
          <input
            type="number"
            value={dividend}
            onChange={(e) => setDividend(Number(e.target.value))}
            className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 w-28 text-center"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[#9cdcfe]">Divisor:</label>
          <input
            type="number"
            value={divisor}
            onChange={(e) => setDivisor(Number(e.target.value))}
            className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 w-28 text-center"
          />
        </div>
      </div>

      {/* Display dividend and divisor in binary */}
      <div className="mb-4">
        <div className="text-sm text-[#9cdcfe] mb-1">Dividend (binary)</div>
        {renderBinary(validDividend, bitWidth)}
        <div className="text-sm text-[#9cdcfe] mt-3 mb-1">Divisor (binary)</div>
        {renderBinary(validDivisor, bitWidth)}
      </div>

      {/* Step description and intermediate values */}
      <div className="bg-[#0d0d0d] p-3 rounded-lg border-l-4 border-[#569cd6] mb-4">
        <p className="text-gray-300">{step.description}</p>
        {step.currentQuotient !== undefined && (
          <div className="mt-2 text-sm text-gray-400">
            <div>Current quotient: {step.currentQuotient} (binary: {step.currentQuotient.toString(2)})</div>
            {step.currentRemainder !== undefined && <div>Current remainder: {step.currentRemainder}</div>}
          </div>
        )}
        {step.final && (
          <div className="mt-2 text-[#4ec9b0]">
            <div>Quotient = {step.quotient}</div>
            <div>Remainder = {step.remainder}</div>
          </div>
        )}
        {step.error && <div className="text-red-500">{step.description}</div>}
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

      {/* Speed and controls */}
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

export default DivideTwoIntegers;