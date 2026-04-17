import React, { useState, useEffect } from 'react';

const RemoveDuplicatesSorted = () => {
  const pseudocodeLines = [
    "procedure removeDuplicates(arr):",
    "  if n == 0: return 0",
    "  j = 0",
    "  for i = 1 to n-1:",
    "    if arr[i] != arr[j]:",
    "      j++; arr[j] = arr[i]",
    "  return j+1"
  ];

  // Default sorted array
  const defaultArray = [1, 1, 2, 2, 3, 4, 4];
  const [array, setArray] = useState(defaultArray);
  const [inputStr, setInputStr] = useState('1,1,2,2,3,4,4');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [error, setError] = useState('');

  const updateArray = () => {
    setError('');
    const newArr = inputStr.split(',').map(Number).filter(n => !isNaN(n));
    if (newArr.length === 0) {
      setError('Please enter valid numbers.');
      return;
    }
    // Check if array is sorted in non-decreasing order
    let isSorted = true;
    for (let i = 1; i < newArr.length; i++) {
      if (newArr[i] < newArr[i-1]) {
        isSorted = false;
        break;
      }
    }
    if (!isSorted) {
      setError('Array must be sorted in non-decreasing order. Please enter a sorted sequence.');
      return;
    }
    setArray(newArr);
  };

  const generateSteps = (arr) => {
    const steps = [];
    if (arr.length === 0) {
      steps.push({ array: [], result: 0, description: "Empty array", pseudocodeLine: 1 });
      return steps;
    }
    let j = 0;
    let currentArr = [...arr];
    steps.push({ array: [...currentArr], j, i: null, description: "Start: first element is unique", pseudocodeLine: 1 });
    for (let i = 1; i < currentArr.length; i++) {
      steps.push({ array: [...currentArr], j, i, description: `Compare arr[${i}] = ${currentArr[i]} with arr[${j}] = ${currentArr[j]}`, pseudocodeLine: 3 });
      if (currentArr[i] !== currentArr[j]) {
        j++;
        currentArr[j] = currentArr[i];
        steps.push({ array: [...currentArr], j, i, description: `Different → increment j to ${j}, set arr[${j}] = ${currentArr[i]}`, pseudocodeLine: 4 });
      } else {
        steps.push({ array: [...currentArr], j, i, description: `Same → skip`, pseudocodeLine: 3 });
      }
    }
    const newLength = j + 1;
    const uniqueArray = currentArr.slice(0, newLength);
    steps.push({ array: uniqueArray, result: newLength, description: `New length = ${newLength}, unique array = [${uniqueArray.join(',')}]`, pseudocodeLine: 5 });
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(array));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [array]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(currentStep + 1), speed);
    } else if (currentStep === steps.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  const step = steps[currentStep] || {};

  const getBgColor = (idx) => {
    if (step.array && idx >= (step.result || step.array.length)) return 'bg-gray-600 text-gray-400 line-through';
    if (idx === step.j) return 'bg-green-500';
    if (idx === step.i) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getBorder = (idx) => {
    if (idx === step.j) return 'border-2 border-[#4ec9b0]';
    if (idx === step.i) return 'border-2 border-[#ce9178]';
    return 'border border-[#3c3c3c]';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Remove Duplicates from Sorted Array</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">⏱️ Time: O(n)</span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">💾 Space: O(1)</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <input
          type="text"
          value={inputStr}
          onChange={(e) => setInputStr(e.target.value)}
          className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 w-96"
          placeholder="Sorted numbers, comma separated (e.g., 1,1,2,2,3,4,4)"
        />
        <button onClick={updateArray} className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">
          Update
        </button>
      </div>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      {!error && array.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-6">
            <div>
              <div className="text-sm text-[#9cdcfe] mb-1">Sorted array (greyed out = removed)</div>
              <div className="flex gap-1">
                {step.array?.map((val, idx) => (
                  <div
                    key={idx}
                    className={`w-12 h-12 flex flex-col items-center justify-center text-lg font-mono rounded ${getBgColor(idx)} ${getBorder(idx)}`}
                  >
                    <span>{val}</span>
                    <span className="text-xs">{idx}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]">
              <p className="text-gray-300">
                <span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {step.description}
              </p>
              {step.result !== undefined && <p className="text-[#4ec9b0] mt-2">New length = {step.result}</p>}
            </div>

            <div>
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Progress</span>
                <span>{Math.round(((currentStep+1)/steps.length)*100)}%</span>
              </div>
              <div className="w-full bg-[#1a1a1a] rounded-full h-3 overflow-hidden">
                <div
                  className="bg-[#4ec9b0] h-3 rounded-full transition-all"
                  style={{ width: `${((currentStep+1)/steps.length)*100}%` }}
                ></div>
              </div>
              <div className="text-center text-xs text-gray-500 mt-1">Step {currentStep+1} of {steps.length}</div>
            </div>

            <div className="flex items-center justify-center gap-4 bg-[#0d0d0d] p-3 rounded-lg">
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
                onClick={() => { setCurrentStep(Math.max(0, currentStep-1)); setIsPlaying(false); }}
                disabled={currentStep===0}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${currentStep===0 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : 'bg-[#0e639c] hover:bg-[#1177bb] text-white'}`}
              >← Prev</button>
              <button
                onClick={() => { setCurrentStep(0); setIsPlaying(false); }}
                className="px-6 py-3 bg-[#c2410c] hover:bg-[#b91c1c] text-white rounded-lg"
              >Reset</button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={currentStep===steps.length-1}
                className={`px-6 py-3 rounded-lg font-semibold ${currentStep===steps.length-1 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : isPlaying ? 'bg-[#ca5100] hover:bg-[#b74700] text-white' : 'bg-[#2e7d32] hover:bg-[#1e5f20] text-white'}`}
              >{isPlaying ? '⏸️ Pause' : '▶️ Play'}</button>
              <button
                onClick={() => { setCurrentStep(Math.min(steps.length-1, currentStep+1)); setIsPlaying(false); }}
                disabled={currentStep===steps.length-1}
                className={`px-6 py-3 rounded-lg font-semibold ${currentStep===steps.length-1 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : 'bg-[#0e639c] hover:bg-[#1177bb] text-white'}`}
              >Next →</button>
            </div>
          </div>

          <div className="lg:w-1/3 bg-[#0a0a0a] border border-[#222222] rounded-xl p-5 font-mono text-sm shadow-inner">
            <h3 className="text-lg font-bold text-[#569cd6] mb-4">📝 Pseudocode</h3>
            <div className="space-y-1">
              {pseudocodeLines.map((line, idx) => (
                <div
                  key={idx}
                  className={`px-3 py-1.5 rounded transition-all duration-200 ${idx === step.pseudocodeLine ? 'bg-[#1a1a1a] text-[#d4d4d4] font-semibold border-l-4 border-[#569cd6]' : 'text-[#9cdcfe] hover:bg-[#1a1a1a]'}`}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RemoveDuplicatesSorted;