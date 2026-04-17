import React, { useState, useEffect } from 'react';

const SpiralMatrix = () => {
  const pseudocodeLines = [
    "procedure spiralOrder(matrix):",
    "  result = []",
    "  top = 0, bottom = rows-1, left = 0, right = cols-1",
    "  while top <= bottom and left <= right:",
    "    // Traverse top row",
    "    for j = left to right: result.push(matrix[top][j])",
    "    top++",
    "    // Traverse right column",
    "    for i = top to bottom: result.push(matrix[i][right])",
    "    right--",
    "    // Traverse bottom row",
    "    if top <= bottom:",
    "      for j = right down to left: result.push(matrix[bottom][j])",
    "      bottom--",
    "    // Traverse left column",
    "    if left <= right:",
    "      for i = bottom down to top: result.push(matrix[i][left])",
    "      left++",
    "  return result"
  ];

  const defaultMatrix = [
    [1,2,3],
    [4,5,6],
    [7,8,9]
  ];
  const [matrix, setMatrix] = useState(defaultMatrix);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [matrixInput, setMatrixInput] = useState('1,2,3,4,5,6,7,8,9');
  const [size, setSize] = useState(3);

  const updateMatrix = () => {
    const flat = matrixInput.split(',').map(x => Number(x.trim())).filter(n => !isNaN(n));
    const s = Math.sqrt(flat.length);
    if (s*s !== flat.length) return;
    setSize(s);
    const newMat = [];
    for (let i = 0; i < s; i++) {
      newMat.push(flat.slice(i*s, i*s+s));
    }
    setMatrix(newMat);
  };

  const generateSteps = (mat) => {
    const steps = [];
    const rows = mat.length, cols = mat[0].length;
    let top = 0, bottom = rows-1, left = 0, right = cols-1;
    let result = [];
    let currentMat = mat.map(row => [...row]);

    steps.push({ matrix: currentMat, result: [...result], top, bottom, left, right, description: "Start", pseudocodeLine: 1 });

    while (top <= bottom && left <= right) {
      // top row
      for (let j = left; j <= right; j++) {
        result.push(currentMat[top][j]);
        steps.push({ matrix: currentMat, result: [...result], top, bottom, left, right, highlight: [[top,j]], description: `Add top row element ${currentMat[top][j]}`, pseudocodeLine: 3 });
      }
      top++;
      if (top > bottom) break;
      steps.push({ matrix: currentMat, result: [...result], top, bottom, left, right, description: `Move top down to ${top}`, pseudocodeLine: 4 });

      // right column
      for (let i = top; i <= bottom; i++) {
        result.push(currentMat[i][right]);
        steps.push({ matrix: currentMat, result: [...result], top, bottom, left, right, highlight: [[i,right]], description: `Add right column element ${currentMat[i][right]}`, pseudocodeLine: 5 });
      }
      right--;
      if (left > right) break;
      steps.push({ matrix: currentMat, result: [...result], top, bottom, left, right, description: `Move right left to ${right}`, pseudocodeLine: 6 });

      // bottom row
      for (let j = right; j >= left; j--) {
        result.push(currentMat[bottom][j]);
        steps.push({ matrix: currentMat, result: [...result], top, bottom, left, right, highlight: [[bottom,j]], description: `Add bottom row element ${currentMat[bottom][j]}`, pseudocodeLine: 7 });
      }
      bottom--;
      steps.push({ matrix: currentMat, result: [...result], top, bottom, left, right, description: `Move bottom up to ${bottom}`, pseudocodeLine: 8 });

      // left column
      for (let i = bottom; i >= top; i--) {
        result.push(currentMat[i][left]);
        steps.push({ matrix: currentMat, result: [...result], top, bottom, left, right, highlight: [[i,left]], description: `Add left column element ${currentMat[i][left]}`, pseudocodeLine: 9 });
      }
      left++;
      steps.push({ matrix: currentMat, result: [...result], top, bottom, left, right, description: `Move left right to ${left}`, pseudocodeLine: 10 });
    }
    steps.push({ matrix: currentMat, result: result, description: `Spiral order: [${result.join(',')}]`, pseudocodeLine: 0 });
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(matrix));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [matrix]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(currentStep + 1), speed);
    } else if (currentStep === steps.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  const step = steps[currentStep] || {};
  const rows = matrix.length;
  const cols = rows > 0 ? matrix[0].length : 0;

  const getBgColor = (r, c) => {
    if (step.highlight && step.highlight.some(([rr,cc]) => rr===r && cc===c)) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Spiral Matrix</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">⏱️ Time: O(m*n)</span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">💾 Space: O(m*n)</span>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <input type="text" value={matrixInput} onChange={(e) => setMatrixInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 focus:border-[#569cd6]" />
        <button onClick={updateMatrix} className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">Update</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left column: Visualization */}
        <div className="lg:w-2/3 space-y-6">
          <div className="flex flex-col items-center gap-2 mb-6">
            {step.matrix && step.matrix.map((row, r) => (
              <div key={r} className="flex gap-2">
                {row.map((val, c) => (
                  <div key={c} className={`w-16 h-16 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-2xl transition-all duration-300 ${getBgColor(r,c)} border-2 border-[#222222]`}>
                    {val}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]">
            <p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {step.description}</p>
            {step.result && <p className="text-sm text-[#4ec9b0] mt-2">Spiral order: [{step.result.join(', ')}]</p>}
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
    </div>
  );
};

export default SpiralMatrix;