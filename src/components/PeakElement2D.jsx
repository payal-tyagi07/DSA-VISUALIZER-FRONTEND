import React, { useState, useEffect } from 'react';

const PeakElement2D = () => {
  const pseudocodeLines = [
    "procedure findPeak2D(matrix):",
    "  lowCol = 0, highCol = cols - 1",
    "  while lowCol <= highCol:",
    "    midCol = floor((lowCol + highCol) / 2)",
    "    maxRow = argmax(matrix[r][midCol] for r)",
    "    left = matrix[maxRow][midCol-1] if midCol > 0 else -∞",
    "    right = matrix[maxRow][midCol+1] if midCol < cols-1 else -∞",
    "    if matrix[maxRow][midCol] > left and > right:",
    "      return (maxRow, midCol)",
    "    else if left > matrix[maxRow][midCol]:",
    "      highCol = midCol - 1",
    "    else:",
    "      lowCol = midCol + 1",
    "  return (-1, -1)"
  ];

  const defaultArrayInput = '10,20,15,12,21,30,14,13,7,9,25,18,8,11,23,22';
  const defaultRows = 4;
  const defaultCols = 4;

  const [arrayInput, setArrayInput] = useState(defaultArrayInput);
  const [rowsInput, setRowsInput] = useState(defaultRows.toString());
  const [colsInput, setColsInput] = useState(defaultCols.toString());
  const [array, setArray] = useState([]);
  const [rows, setRows] = useState(defaultRows);
  const [cols, setCols] = useState(defaultCols);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const updateInputs = () => {
    const arrStr = arrayInput.split(',').map(s => s.trim()).filter(s => s !== '');
    const newArray = arrStr.map(Number).filter(n => !isNaN(n));
    const newRows = parseInt(rowsInput);
    const newCols = parseInt(colsInput);
    if (newArray.length !== newRows * newCols) {
      alert(`Array must have exactly ${newRows * newCols} numbers.`);
      return;
    }
    setArray(newArray);
    setRows(newRows);
    setCols(newCols);
  };

  const generateSteps = (arr, rows, cols) => {
  const steps = [];
  let lowCol = 0;
  let highCol = cols - 1;
  let resultRow = -1, resultCol = -1;

  steps.push({
    array: arr,
    rows,
    cols,
    lowCol,
    highCol,
    midCol: null,
    maxRow: null,
    left: null,
    right: null,
    result: null,
    description: `Search for a peak in ${rows}x${cols} matrix. Column range: [${lowCol}, ${highCol}]`,
    pseudocodeLine: 1
  });

  while (lowCol <= highCol) {
    const midCol = Math.floor((lowCol + highCol) / 2);
    
    steps.push({
      array: arr,
      rows,
      cols,
      lowCol,
      highCol,
      midCol,
      maxRow: null,
      left: null,
      right: null,
      result: null,
      description: `Select middle column: midCol = ${midCol}`,
      pseudocodeLine: 3
    });

    // Find row with maximum value in this column
    let maxRow = 0;
    let maxVal = arr[maxRow * cols + midCol];
    steps.push({
      array: arr,
      rows,
      cols,
      lowCol,
      highCol,
      midCol,
      maxRow: null,
      left: null,
      right: null,
      result: null,
      description: `Find maximum element in column ${midCol}: start at row 0 (value ${maxVal})`,
      pseudocodeLine: 4
    });

    for (let r = 1; r < rows; r++) {
      const val = arr[r * cols + midCol];
      steps.push({
        array: arr,
        rows,
        cols,
        lowCol,
        highCol,
        midCol,
        maxRow,
        left: null,
        right: null,
        result: null,
        description: `Check row ${r}: value = ${val} (current max = ${maxVal})`,
        pseudocodeLine: 4
      });
      if (val > maxVal) {
        maxVal = val;
        maxRow = r;
        steps.push({
          array: arr,
          rows,
          cols,
          lowCol,
          highCol,
          midCol,
          maxRow,
          left: null,
          right: null,
          result: null,
          description: `New max at row ${maxRow} with value ${maxVal}`,
          pseudocodeLine: 4
        });
      }
    }

    const left = midCol > 0 ? arr[maxRow * cols + (midCol - 1)] : -Infinity;
    const right = midCol < cols - 1 ? arr[maxRow * cols + (midCol + 1)] : -Infinity;
    const current = arr[maxRow * cols + midCol];

    steps.push({
      array: arr,
      rows,
      cols,
      lowCol,
      highCol,
      midCol,
      maxRow,
      left,
      right,
      result: null,
      description: `Maximum in column ${midCol} is at (${maxRow}, ${midCol}) = ${current}. Left neighbor = ${left === -Infinity ? 'none' : left}, right neighbor = ${right === -Infinity ? 'none' : right}`,
      pseudocodeLine: 5
    });

    if (current > left && current > right) {
      resultRow = maxRow;
      resultCol = midCol;
      steps.push({
        array: arr,
        rows,
        cols,
        lowCol,
        highCol,
        midCol,
        maxRow,
        left,
        right,
        result: [resultRow, resultCol],
        description: `Peak found at (${resultRow}, ${resultCol}) = ${current} 🎉`,
        pseudocodeLine: 6
      });
      break;
    } else if (left > current) {
      highCol = midCol - 1;
      steps.push({
        array: arr,
        rows,
        cols,
        lowCol,
        highCol,
        midCol,
        maxRow,
        left,
        right,
        result: null,
        description: `Left neighbor ${left} > ${current} → peak must be in left half. Update highCol = ${highCol}`,
        pseudocodeLine: 8
      });
    } else {
      lowCol = midCol + 1;
      steps.push({
        array: arr,
        rows,
        cols,
        lowCol,
        highCol,
        midCol,
        maxRow,
        left,
        right,
        result: null,
        description: `Right neighbor ${right} > ${current} → peak must be in right half. Update lowCol = ${lowCol}`,
        pseudocodeLine: 9
      });
    }

    if (lowCol <= highCol && resultRow === -1) {
      steps.push({
        array: arr,
        rows,
        cols,
        lowCol,
        highCol,
        midCol: null,
        maxRow: null,
        left: null,
        right: null,
        result: null,
        description: `Continue searching in column range [${lowCol}, ${highCol}]`,
        pseudocodeLine: 2
      });
    }
  }

  if (resultRow === -1) {
    steps.push({
      array: arr,
      rows,
      cols,
      lowCol,
      highCol,
      midCol: null,
      maxRow: null,
      left: null,
      right: null,
      result: null,
      description: "No peak found (should not happen)",
      pseudocodeLine: 10
    });
  }

  return steps;
};

  useEffect(() => {
    if (array.length > 0) {
      const newSteps = generateSteps(array, rows, cols);
      setSteps(newSteps);
      setCurrentStep(0);
      setIsPlaying(false);
    }
  }, [array, rows, cols]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(currentStep + 1), speed);
    } else if (currentStep === steps.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  const step = steps[currentStep] || {};

  // Build matrix for display
  const matrix = [];
  for (let r = 0; r < rows; r++) {
    const row = array.slice(r * cols, r * cols + cols);
    matrix.push(row);
  }

  const getBgColor = (r, c) => {
    if (step.result && step.result[0] === r && step.result[1] === c) return 'bg-green-600';
    if (step.maxRow === r && step.midCol === c) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getBorderStyle = () => 'border-2 border-[#222222]';

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl transition-all duration-300 font-mono border border-[#222222]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Peak Element in 2D Matrix</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">⏱️ Time: <span className="text-[#4ec9b0]">O(rows log cols)</span></span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">💾 Space: <span className="text-[#4ec9b0]">O(1)</span></span>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); updateInputs(); }} className="flex flex-wrap justify-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-[#9cdcfe]">Matrix (flattened):</label>
          <input type="text" value={arrayInput} onChange={(e) => setArrayInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 focus:border-[#569cd6]" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[#9cdcfe]">Rows:</label>
          <input type="number" min="1" value={rowsInput} onChange={(e) => setRowsInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 focus:border-[#569cd6]" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[#9cdcfe]">Cols:</label>
          <input type="number" min="1" value={colsInput} onChange={(e) => setColsInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 focus:border-[#569cd6]" />
        </div>
        <button type="submit" className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">Update</button>
      </form>

      {steps.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-8">
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
                  {row.map((num, ci) => (
                    <div
                      key={`cell-${ri}-${ci}`}
                      className={`w-16 h-16 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl ${getBgColor(ri, ci)} ${getBorderStyle()}`}
                    >
                      {num}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-6 flex-wrap text-sm">
              <div className="flex items-center gap-2"><span className="w-4 h-4 bg-blue-500 rounded-full"></span>Not peak</div>
              <div className="flex items-center gap-2"><span className="w-4 h-4 bg-yellow-500 rounded-full"></span>Current max in column</div>
              <div className="flex items-center gap-2"><span className="w-4 h-4 bg-green-600 rounded-full"></span>Peak found</div>
            </div>

            <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]">
              <p className="text-gray-300">
                <span className="font-bold text-[#9cdcfe]">Step {currentStep + 1}:</span> {step.description}
              </p>
              {step.lowCol !== undefined && step.highCol !== undefined && (
                <p className="text-sm text-gray-400 mt-1">
                  lowCol = {step.lowCol}, highCol = {step.highCol}
                </p>
              )}
              {step.left !== undefined && step.left !== null && (
                <p className="text-sm text-gray-400">
                  left = {step.left === -Infinity ? '-∞' : step.left}, right = {step.right === -Infinity ? '-∞' : step.right}
                </p>
              )}
            </div>

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

            <div className="flex items-center justify-center gap-4 bg-[#0d0d0d] p-3 rounded-lg">
              <span>⏱️ Speed:</span>
              <input type="range" min="300" max="2000" value={speed} onChange={(e) => setSpeed(e.target.value)} className="w-48 md:w-64 accent-[#4ec9b0]" />
              <span className="bg-[#1a1a1a] px-3 py-1 rounded-full">{speed}ms</span>
            </div>

            <div className="flex justify-center gap-4 flex-wrap">
              <button onClick={() => { setCurrentStep(Math.max(0, currentStep-1)); setIsPlaying(false); }} disabled={currentStep===0} className={`px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 ${currentStep===0 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : 'bg-[#0e639c] hover:bg-[#1177bb] text-white'}`}>← Prev</button>
              <button onClick={() => { setCurrentStep(0); setIsPlaying(false); }} className="px-6 py-3 bg-[#c2410c] hover:bg-[#b91c1c] text-white rounded-lg font-semibold hover:scale-105">Reset</button>
              <button onClick={() => setIsPlaying(!isPlaying)} disabled={currentStep===steps.length-1} className={`px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 ${currentStep===steps.length-1 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : isPlaying ? 'bg-[#ca5100] hover:bg-[#b74700] text-white' : 'bg-[#2e7d32] hover:bg-[#1e5f20] text-white'}`}>{isPlaying ? '⏸️ Pause' : '▶️ Play'}</button>
              <button onClick={() => { setCurrentStep(Math.min(steps.length-1, currentStep+1)); setIsPlaying(false); }} disabled={currentStep===steps.length-1} className={`px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 ${currentStep===steps.length-1 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : 'bg-[#0e639c] hover:bg-[#1177bb] text-white'}`}>Next →</button>
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
      )}
    </div>
  );
};

export default PeakElement2D;