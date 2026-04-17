import React, { useState, useEffect } from 'react';

const Search2DMatrix = () => {
  const pseudocodeLines = [
    "procedure searchMatrix(matrix, target):",
    "  rows = length(matrix), cols = length(matrix[0])",
    "  low = 0, high = rows * cols - 1",
    "  while low <= high:",
    "    mid = floor((low + high) / 2)",
    "    r = mid // cols",
    "    c = mid % cols",
    "    if matrix[r][c] == target: return true",
    "    else if matrix[r][c] < target: low = mid + 1",
    "    else: high = mid - 1",
    "  return false"
  ];

  // Fixed 3x4 matrix (flattened input)
  const defaultArrayInput = '1,3,5,7,10,11,16,20,23,30,34,60';
  const defaultTargetInput = '3';

  const [arrayInput, setArrayInput] = useState(defaultArrayInput);
  const [targetInput, setTargetInput] = useState(defaultTargetInput);
  const [array, setArray] = useState([]);
  const [target, setTarget] = useState(null);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  // Matrix dimensions (fixed 3x4)
  const rows = 3;
  const cols = 4;

  const updateInputs = () => {
    const arrStr = arrayInput.split(',').map(s => s.trim()).filter(s => s !== '');
    const newArray = arrStr.map(Number).filter(n => !isNaN(n));
    const newTarget = Number(targetInput);
    if (newArray.length === 0 || isNaN(newTarget)) return;
    setArray(newArray);
    setTarget(newTarget);
  };

  const generateSteps = (arr, target) => {
    const steps = [];
    let low = 0;
    let high = arr.length - 1;
    let found = false;

    steps.push({
      array: [...arr],
      low,
      high,
      mid: null,
      result: null,
      description: `2D matrix: ${rows}x${cols}. Search for ${target}`,
      pseudocodeLine: 1
    });

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const r = Math.floor(mid / cols);
      const c = mid % cols;
      steps.push({
        array: [...arr],
        low,
        high,
        mid,
        result: null,
        description: `mid = ${mid} → row ${r}, col ${c} = ${arr[mid]}`,
        pseudocodeLine: 4
      });

      if (arr[mid] === target) {
        found = true;
        steps.push({
          array: [...arr],
          low,
          high,
          mid,
          result: mid,
          description: `Found ${target} at index ${mid} (row ${r}, col ${c})! 🎉`,
          pseudocodeLine: 5
        });
        break;
      } else if (arr[mid] < target) {
        low = mid + 1;
        steps.push({
          array: [...arr],
          low,
          high,
          mid,
          result: null,
          description: `${arr[mid]} < ${target} → search right half, low = ${low}`,
          pseudocodeLine: 6
        });
      } else {
        high = mid - 1;
        steps.push({
          array: [...arr],
          low,
          high,
          mid,
          result: null,
          description: `${arr[mid]} > ${target} → search left half, high = ${high}`,
          pseudocodeLine: 7
        });
      }

      if (low <= high && !found) {
        steps.push({
          array: [...arr],
          low,
          high,
          mid: null,
          result: null,
          description: `Now search in [${low}, ${high}]`,
          pseudocodeLine: 2
        });
      }
    }

    if (!found) {
      steps.push({
        array: [...arr],
        low,
        high,
        mid: null,
        result: -1,
        description: `${target} not found in matrix.`,
        pseudocodeLine: 8
      });
    }

    return steps;
  };

  useEffect(() => {
    if (array.length > 0 && target !== null) {
      const newSteps = generateSteps(array, target);
      setSteps(newSteps);
      setCurrentStep(0);
      setIsPlaying(false);
    }
  }, [array, target]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(currentStep + 1), speed);
    } else if (currentStep === steps.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  // Helper to get background color for a cell at flattened index `idx`
  const getBgColor = (idx) => {
    const step = steps[currentStep];
    if (!step) return 'bg-blue-500';
    if (step.result === idx) return 'bg-green-600';
    if (step.mid === idx) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getBorderStyle = (idx) => {
    const step = steps[currentStep];
    if (!step) return 'border-2 border-[#222222]';
    // For 2D, we don't use low/high pointers as they are 1D indices
    return 'border-2 border-[#222222]';
  };

  // Build matrix rows from flattened array
  const matrix = [];
  for (let i = 0; i < rows; i++) {
    const row = array.slice(i * cols, i * cols + cols);
    matrix.push(row);
  }

  const step = steps[currentStep] || {};

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl transition-all duration-300 font-mono border border-[#222222]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Search in a 2D Matrix</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">⏱️ Time: <span className="text-[#4ec9b0]">O(log n)</span></span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">💾 Space: <span className="text-[#4ec9b0]">O(1)</span></span>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); updateInputs(); }} className="flex flex-wrap justify-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-[#9cdcfe]">Matrix (flattened, 3x4):</label>
          <input type="text" value={arrayInput} onChange={(e) => setArrayInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 focus:border-[#569cd6]" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[#9cdcfe]">Target:</label>
          <input type="number" value={targetInput} onChange={(e) => setTargetInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 focus:border-[#569cd6]" />
        </div>
        <button type="submit" className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">Update</button>
      </form>

      {steps.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column: 2D matrix visualization */}
          <div className="lg:w-2/3 space-y-6">
            <div className="flex flex-col items-center gap-2">
              {/* Column indices */}
              <div className="flex ml-8">
                <div className="w-8"></div>
                {[...Array(cols)].map((_, ci) => (
                  <div key={`col-${ci}`} className="w-16 text-center text-[#9cdcfe] text-xs">c{ci}</div>
                ))}
              </div>
              {/* Rows */}
              {matrix.map((row, ri) => (
                <div key={`row-${ri}`} className="flex items-center gap-2">
                  <div className="w-8 text-[#ce9178] text-xs">r{ri}</div>
                  {row.map((num, ci) => {
                    const flatIdx = ri * cols + ci;
                    return (
                      <div
                        key={`cell-${ri}-${ci}`}
                        className={`w-16 h-16 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl ${getBgColor(flatIdx)} ${getBorderStyle(flatIdx)}`}
                      >
                        {num}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 flex-wrap text-sm">
              <div className="flex items-center gap-2"><span className="w-4 h-4 bg-blue-500 rounded-full"></span>Not examined</div>
              <div className="flex items-center gap-2"><span className="w-4 h-4 bg-yellow-500 rounded-full"></span>Mid (current)</div>
              <div className="flex items-center gap-2"><span className="w-4 h-4 bg-green-600 rounded-full"></span>Found</div>
            </div>

            {/* Description */}
            <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]">
              <p className="text-gray-300">
                <span className="font-bold text-[#9cdcfe]">Step {currentStep + 1}:</span> {step.description}
              </p>
              {step.low !== undefined && step.high !== undefined && (
                <p className="text-sm text-gray-400 mt-1">
                  low = {step.low}, high = {step.high}
                </p>
              )}
            </div>

            {/* Progress */}
            <div>
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Progress</span>
                <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-[#1a1a1a] rounded-full h-3 overflow-hidden">
                <div className="bg-[#4ec9b0] h-3 rounded-full transition-all" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}></div>
              </div>
              <div className="text-center text-xs text-gray-500 mt-1">Step {currentStep + 1} of {steps.length}</div>
            </div>

            {/* Speed control */}
            <div className="flex items-center justify-center gap-4 bg-[#0d0d0d] p-3 rounded-lg">
              <span>⏱️ Speed:</span>
              <input type="range" min="300" max="2000" value={speed} onChange={(e) => setSpeed(e.target.value)} className="w-48 md:w-64 accent-[#4ec9b0]" />
              <span className="bg-[#1a1a1a] px-3 py-1 rounded-full">{speed}ms</span>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4 flex-wrap">
              <button onClick={() => { setCurrentStep(Math.max(0, currentStep-1)); setIsPlaying(false); }} disabled={currentStep===0} className={`px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 ${currentStep===0 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : 'bg-[#0e639c] hover:bg-[#1177bb] text-white'}`}>← Prev</button>
              <button onClick={() => { setCurrentStep(0); setIsPlaying(false); }} className="px-6 py-3 bg-[#c2410c] hover:bg-[#b91c1c] text-white rounded-lg font-semibold hover:scale-105">Reset</button>
              <button onClick={() => setIsPlaying(!isPlaying)} disabled={currentStep===steps.length-1} className={`px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 ${currentStep===steps.length-1 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : isPlaying ? 'bg-[#ca5100] hover:bg-[#b74700] text-white' : 'bg-[#2e7d32] hover:bg-[#1e5f20] text-white'}`}>{isPlaying ? '⏸️ Pause' : '▶️ Play'}</button>
              <button onClick={() => { setCurrentStep(Math.min(steps.length-1, currentStep+1)); setIsPlaying(false); }} disabled={currentStep===steps.length-1} className={`px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 ${currentStep===steps.length-1 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : 'bg-[#0e639c] hover:bg-[#1177bb] text-white'}`}>Next →</button>
            </div>
          </div>

          {/* Right column: Pseudocode */}
          <div className="lg:w-1/3 bg-[#0a0a0a] border border-[#222222] rounded-xl p-5 font-mono text-sm shadow-inner">
            <h3 className="text-lg font-bold text-[#569cd6] mb-4">📝 Pseudocode</h3>
            <div className="space-y-1">
              {pseudocodeLines.map((line, idx) => (
                <div key={idx} className={`px-3 py-1.5 rounded transition-all duration-200 ${idx === step.pseudocodeLine ? 'bg-[#1a1a1a] text-[#d4d4d4] font-semibold border-l-4 border-[#569cd6]' : 'text-[#9cdcfe] hover:bg-[#1a1a1a]'}`}>{line}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search2DMatrix;