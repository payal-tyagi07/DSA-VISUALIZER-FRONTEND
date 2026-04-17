import React, { useState, useEffect } from 'react';

const FirstLastOccurrence = () => {
  const pseudocodeLines = [
    "procedure firstOccurrence(arr, target):",
    "  low = 0, high = length(arr) - 1",
    "  result = -1",
    "  while low <= high:",
    "    mid = floor((low + high) / 2)",
    "    if arr[mid] == target:",
    "      result = mid",
    "      high = mid - 1   // look left",
    "    else if arr[mid] < target:",
    "      low = mid + 1",
    "    else:",
    "      high = mid - 1",
    "  return result",
    "",
    "procedure lastOccurrence(arr, target):",
    "  low = 0, high = length(arr) - 1",
    "  result = -1",
    "  while low <= high:",
    "    mid = floor((low + high) / 2)",
    "    if arr[mid] == target:",
    "      result = mid",
    "      low = mid + 1    // look right",
    "    else if arr[mid] < target:",
    "      low = mid + 1",
    "    else:",
    "      high = mid - 1",
    "  return result"
  ];

  const [arrayInput, setArrayInput] = useState('1,2,3,3,3,4,5');
  const [targetInput, setTargetInput] = useState('3');
  const [array, setArray] = useState([1,2,3,3,3,4,5]);
  const [target, setTarget] = useState(3);
  const [steps, setSteps] = useState([]);
  const [isSorted, setIsSorted] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [firstResult, setFirstResult] = useState(-1);
  const [lastResult, setLastResult] = useState(-1);

  const updateInputs = () => {
    const arrStr = arrayInput.split(',').map(s => s.trim()).filter(s => s !== '');
    const newArray = arrStr.map(Number).filter(n => !isNaN(n));
    const newTarget = Number(targetInput);
    if (newArray.length === 0 || isNaN(newTarget)) return;
    const sorted = newArray.every((val, i, a) => i === 0 || a[i-1] <= val);
    setIsSorted(sorted);
    setArray(newArray);
    setTarget(newTarget);
  };

  const generateSteps = (arr, t) => {
    if (arr.length === 0) return [];
    const steps = [];
    let first = -1;
    let last = -1;

    // ---- First occurrence search ----
    steps.push({
      array: [...arr],
      low: 0,
      high: arr.length - 1,
      mid: null,
      result: null,
      phase: 'first',
      description: `Searching for first occurrence of ${t}`,
      pseudocodeLine: 0
    });

    let low = 0;
    let high = arr.length - 1;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      steps.push({
        array: [...arr],
        low,
        high,
        mid,
        result: null,
        phase: 'first',
        description: `mid = ${mid}, arr[${mid}] = ${arr[mid]}`,
        pseudocodeLine: 4
      });

      if (arr[mid] === t) {
        first = mid;
        steps.push({
          array: [...arr],
          low,
          high,
          mid,
          result: null,
          phase: 'first',
          description: `Found ${t} at index ${mid}, searching left for earlier occurrence`,
          pseudocodeLine: 5
        });
        high = mid - 1;
        if (low <= high) {
          steps.push({
            array: [...arr],
            low,
            high,
            mid: null,
            result: null,
            phase: 'first',
            description: `Now search left half [${low}, ${high}]`,
            pseudocodeLine: 1
          });
        }
      } else if (arr[mid] < t) {
        low = mid + 1;
        steps.push({
          array: [...arr],
          low,
          high,
          mid,
          result: null,
          phase: 'first',
          description: `${arr[mid]} < ${t} → search right half, low = ${low}`,
          pseudocodeLine: 7
        });
      } else {
        high = mid - 1;
        steps.push({
          array: [...arr],
          low,
          high,
          mid,
          result: null,
          phase: 'first',
          description: `${arr[mid]} > ${t} → search left half, high = ${high}`,
          pseudocodeLine: 9
        });
      }
    }

    steps.push({
      array: [...arr],
      low: null,
      high: null,
      mid: null,
      result: first,
      phase: 'first',
      description: first !== -1 ? `First occurrence at index ${first}` : `${t} not found`,
      pseudocodeLine: 10
    });

    // ---- Last occurrence search ----
    steps.push({
      array: [...arr],
      low: 0,
      high: arr.length - 1,
      mid: null,
      result: null,
      phase: 'last',
      description: `Searching for last occurrence of ${t}`,
      pseudocodeLine: 12
    });

    low = 0;
    high = arr.length - 1;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      steps.push({
        array: [...arr],
        low,
        high,
        mid,
        result: null,
        phase: 'last',
        description: `mid = ${mid}, arr[${mid}] = ${arr[mid]}`,
        pseudocodeLine: 16
      });

      if (arr[mid] === t) {
        last = mid;
        steps.push({
          array: [...arr],
          low,
          high,
          mid,
          result: null,
          phase: 'last',
          description: `Found ${t} at index ${mid}, searching right for later occurrence`,
          pseudocodeLine: 17
        });
        low = mid + 1;
        if (low <= high) {
          steps.push({
            array: [...arr],
            low,
            high,
            mid: null,
            result: null,
            phase: 'last',
            description: `Now search right half [${low}, ${high}]`,
            pseudocodeLine: 13
          });
        }
      } else if (arr[mid] < t) {
        low = mid + 1;
        steps.push({
          array: [...arr],
          low,
          high,
          mid,
          result: null,
          phase: 'last',
          description: `${arr[mid]} < ${t} → search right half, low = ${low}`,
          pseudocodeLine: 19
        });
      } else {
        high = mid - 1;
        steps.push({
          array: [...arr],
          low,
          high,
          mid,
          result: null,
          phase: 'last',
          description: `${arr[mid]} > ${t} → search left half, high = ${high}`,
          pseudocodeLine: 21
        });
      }
    }

    steps.push({
      array: [...arr],
      low: null,
      high: null,
      mid: null,
      result: last,
      phase: 'last',
      description: last !== -1 ? `Last occurrence at index ${last}` : `${t} not found`,
      pseudocodeLine: 22
    });

    // Final result
    steps.push({
      array: [...arr],
      low: null,
      high: null,
      mid: null,
      result: [first, last],
      phase: 'result',
      description: first !== -1 ? `First = ${first}, Last = ${last}` : `Target ${t} not found`,
      pseudocodeLine: 0
    });

    return steps;
  };

  useEffect(() => {
    if (array.length > 0 && !isNaN(target) && isSorted) {
      const newSteps = generateSteps(array, target);
      setSteps(newSteps);
      setCurrentStep(0);
      setIsPlaying(false);
    }
  }, [array, target, isSorted]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(currentStep + 1), speed);
    } else if (currentStep === steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  const getBgColor = (index) => {
    const step = steps[currentStep];
    if (!step) return 'bg-blue-500';
    if (step.phase === 'result' && Array.isArray(step.result) && step.result[0] !== -1) {
      if (index >= step.result[0] && index <= step.result[1]) return 'bg-green-600';
    } else if (step.result === index) return 'bg-green-600';
    if (step.mid === index) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getBorderStyle = (index) => {
    const step = steps[currentStep];
    if (!step) return 'border-2 border-[#222222]';
    if (step.low === index) return 'border-2 border-[#4ec9b0]';
    if (step.high === index) return 'border-2 border-[#ce9178]';
    return 'border-2 border-[#222222]';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateInputs();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl transition-all duration-300 font-mono border border-[#222222]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">First and Last Occurrence</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">⏱️ Time: <span className="text-[#4ec9b0]">O(log n)</span></span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">💾 Space: <span className="text-[#4ec9b0]">O(1)</span></span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-wrap justify-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-[#9cdcfe]">Array (sorted):</label>
          <input type="text" value={arrayInput} onChange={(e) => setArrayInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 focus:border-[#569cd6]" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[#9cdcfe]">Target:</label>
          <input type="number" value={targetInput} onChange={(e) => setTargetInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 focus:border-[#569cd6]" />
        </div>
        <button type="submit" className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">Update</button>
      </form>

      {!isSorted && (
        <div className="bg-red-900/30 border border-red-500 text-red-300 p-3 rounded mb-4 text-center">
          ⚠️ Array must be sorted for binary search to work correctly.
        </div>
      )}

      {steps.length > 0 && isSorted && (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-6">
            <div className="flex justify-center gap-3 flex-wrap">
              {steps[currentStep].array.map((num, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl ${getBgColor(idx)} ${getBorderStyle(idx)}`}>
                    {num}
                  </div>
                  <div className="text-xs mt-1 font-bold">
                    {steps[currentStep].low === idx && <span className="text-[#4ec9b0]">L</span>}
                    {steps[currentStep].mid === idx && <span className="text-yellow-500">M</span>}
                    {steps[currentStep].high === idx && <span className="text-[#ce9178]">H</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-6 flex-wrap text-sm">
              <div className="flex items-center gap-2"><span className="w-4 h-4 bg-blue-500 rounded-full"></span>Not examined</div>
              <div className="flex items-center gap-2"><span className="w-4 h-4 bg-yellow-500 rounded-full"></span>Mid</div>
              <div className="flex items-center gap-2"><span className="w-4 h-4 bg-green-600 rounded-full"></span>Found/Result</div>
              <div className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-[#4ec9b0]"></span>Low</div>
              <div className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-[#ce9178]"></span>High</div>
            </div>

            <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]">
              <p className="text-gray-300">
                <span className="font-bold text-[#9cdcfe]">Step {currentStep + 1}:</span> {steps[currentStep].description}
                {steps[currentStep].phase === 'first' && <span className="ml-2 text-[#569cd6]">(First occurrence)</span>}
                {steps[currentStep].phase === 'last' && <span className="ml-2 text-[#569cd6]">(Last occurrence)</span>}
              </p>
            </div>

            <div>
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Progress</span>
                <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-[#1a1a1a] rounded-full h-3 overflow-hidden">
                <div className="bg-[#4ec9b0] h-3 rounded-full transition-all duration-300" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}></div>
              </div>
              <div className="text-center text-xs text-gray-500 mt-1">Step {currentStep + 1} of {steps.length}</div>
            </div>

            <div className="flex items-center justify-center gap-4 bg-[#0d0d0d] p-3 rounded-lg">
              <span className="text-gray-300 font-medium">⏱️ Speed:</span>
              <input type="range" min="300" max="2000" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-48 md:w-64 accent-[#4ec9b0]" />
              <span className="text-gray-300 bg-[#1a1a1a] px-3 py-1 rounded-full shadow-sm">{speed}ms</span>
            </div>

            <div className="flex justify-center gap-4 flex-wrap">
              <button onClick={() => { setCurrentStep(Math.max(0, currentStep-1)); setIsPlaying(false); }} disabled={currentStep === 0} className={`px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 ${currentStep === 0 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : 'bg-[#0e639c] hover:bg-[#1177bb] text-white'}`}>← Prev</button>
              <button onClick={() => { setCurrentStep(0); setIsPlaying(false); }} className="px-6 py-3 bg-[#c2410c] hover:bg-[#b91c1c] text-white rounded-lg font-semibold hover:scale-105 active:scale-95 transition-all">Reset</button>
              <button onClick={() => setIsPlaying(!isPlaying)} disabled={currentStep === steps.length - 1} className={`px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 ${currentStep === steps.length - 1 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : isPlaying ? 'bg-[#ca5100] hover:bg-[#b74700] text-white' : 'bg-[#2e7d32] hover:bg-[#1e5f20] text-white'}`}>{isPlaying ? '⏸️ Pause' : '▶️ Play'}</button>
              <button onClick={() => { setCurrentStep(Math.min(steps.length - 1, currentStep + 1)); setIsPlaying(false); }} disabled={currentStep === steps.length - 1} className={`px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 ${currentStep === steps.length - 1 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : 'bg-[#0e639c] hover:bg-[#1177bb] text-white'}`}>Next →</button>
            </div>

            <div className="text-center text-sm text-gray-400">
              {steps[currentStep].low !== undefined && steps[currentStep].low !== null && <span className="mr-4">low = {steps[currentStep].low}</span>}
              {steps[currentStep].high !== undefined && steps[currentStep].high !== null && <span className="mr-4">high = {steps[currentStep].high}</span>}
              {steps[currentStep].mid !== undefined && steps[currentStep].mid !== null && <span>mid = {steps[currentStep].mid}</span>}
            </div>
          </div>

          <div className="lg:w-1/3 bg-[#0a0a0a] border border-[#222222] rounded-xl p-5 font-mono text-sm shadow-inner">
            <h3 className="text-lg font-bold text-[#569cd6] mb-4 flex items-center gap-2">📝 Pseudocode</h3>
            <div className="space-y-1 overflow-x-auto">
              {pseudocodeLines.map((line, idx) => (
                <div key={idx} className={`px-3 py-1.5 rounded transition-all duration-200 ${idx === steps[currentStep]?.pseudocodeLine ? 'bg-[#1a1a1a] text-[#d4d4d4] font-semibold border-l-4 border-[#569cd6]' : 'text-[#9cdcfe] hover:bg-[#1a1a1a]'}`}>{line}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FirstLastOccurrence;