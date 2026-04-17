import React, { useState, useEffect } from 'react';

const PeakElement = () => {
  const pseudocodeLines = [
    "procedure findPeakElement(arr):",
    "  low = 0, high = length(arr) - 1",
    "  while low < high:",
    "    mid = floor((low + high) / 2)",
    "    if arr[mid] > arr[mid + 1]:",
    "      high = mid",
    "    else:",
    "      low = mid + 1",
    "  return low"
  ];

  const [arrayInput, setArrayInput] = useState('1,2,3,1');
  const [array, setArray] = useState([1,2,3,1]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const updateInputs = () => {
    const arrStr = arrayInput.split(',').map(s => s.trim()).filter(s => s !== '');
    const newArray = arrStr.map(Number).filter(n => !isNaN(n));
    if (newArray.length === 0) return;
    setArray(newArray);
  };

  const generateSteps = (arr) => {
    if (arr.length === 0) return [];
    const steps = [];
    let low = 0;
    let high = arr.length - 1;
    let result = null;

    steps.push({
      array: [...arr],
      low,
      high,
      mid: null,
      result: null,
      description: `Find a peak element in [${arr.join(', ')}]`,
      pseudocodeLine: 1
    });

    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      steps.push({
        array: [...arr],
        low,
        high,
        mid,
        result: null,
        description: `mid = ${mid}, arr[${mid}] = ${arr[mid]}, arr[${mid+1}] = ${arr[mid+1]}`,
        pseudocodeLine: 3
      });

      if (arr[mid] > arr[mid + 1]) {
        high = mid;
        steps.push({
          array: [...arr],
          low,
          high,
          mid,
          result: null,
          description: `arr[${mid}] > arr[${mid+1}] → peak in left half, high = ${high}`,
          pseudocodeLine: 4
        });
      } else {
        low = mid + 1;
        steps.push({
          array: [...arr],
          low,
          high,
          mid,
          result: null,
          description: `arr[${mid}] < arr[${mid+1}] → peak in right half, low = ${low}`,
          pseudocodeLine: 6
        });
      }

      if (low < high) {
        steps.push({
          array: [...arr],
          low,
          high,
          mid: null,
          result: null,
          description: `Now search in [${low}, ${high}]`,
          pseudocodeLine: 1
        });
      }
    }

    result = low;
    steps.push({
      array: [...arr],
      low,
      high,
      mid: null,
      result,
      description: `Peak found at index ${result} (value = ${arr[result]}) 🎉`,
      pseudocodeLine: 7
    });

    return steps;
  };

  useEffect(() => {
    if (array.length > 0) {
      setSteps(generateSteps(array));
      setCurrentStep(0);
      setIsPlaying(false);
    }
  }, [array]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(currentStep + 1), speed);
    } else if (currentStep === steps.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  const getBgColor = (index) => {
    const step = steps[currentStep];
    if (!step) return 'bg-blue-500';
    if (step.result === index) return 'bg-green-600';
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

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl transition-all duration-300 font-mono border border-[#222222]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Find Peak Element</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">⏱️ Time: <span className="text-[#4ec9b0]">O(log n)</span></span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">💾 Space: <span className="text-[#4ec9b0]">O(1)</span></span>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); updateInputs(); }} className="flex flex-wrap justify-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-[#9cdcfe]">Array:</label>
          <input type="text" value={arrayInput} onChange={(e) => setArrayInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 focus:border-[#569cd6]" />
        </div>
        <button type="submit" className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">Update</button>
      </form>

      {steps.length > 0 && (
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
              <div className="flex items-center gap-2"><span className="w-4 h-4 bg-green-600 rounded-full"></span>Peak</div>
              <div className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-[#4ec9b0]"></span>Low</div>
              <div className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-[#ce9178]"></span>High</div>
            </div>

            <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]">
              <p><span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {steps[currentStep].description}</p>
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
              <button onClick={() => { setCurrentStep(Math.max(0, currentStep-1)); setIsPlaying(false); }} disabled={currentStep===0} className={`px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 ${currentStep===0 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : 'bg-[#0e639c] hover:bg-[#1177bb] text-white'}`}>← Prev</button>
              <button onClick={() => { setCurrentStep(0); setIsPlaying(false); }} className="px-6 py-3 bg-[#c2410c] hover:bg-[#b91c1c] text-white rounded-lg font-semibold hover:scale-105">Reset</button>
              <button onClick={() => setIsPlaying(!isPlaying)} disabled={currentStep===steps.length-1} className={`px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 ${currentStep===steps.length-1 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : isPlaying ? 'bg-[#ca5100] hover:bg-[#b74700] text-white' : 'bg-[#2e7d32] hover:bg-[#1e5f20] text-white'}`}>{isPlaying ? '⏸️ Pause' : '▶️ Play'}</button>
              <button onClick={() => { setCurrentStep(Math.min(steps.length-1, currentStep+1)); setIsPlaying(false); }} disabled={currentStep===steps.length-1} className={`px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 ${currentStep===steps.length-1 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : 'bg-[#0e639c] hover:bg-[#1177bb] text-white'}`}>Next →</button>
            </div>

            <div className="text-center text-sm text-gray-400">
              {steps[currentStep].low !== undefined && <span className="mr-4">low = {steps[currentStep].low}</span>}
              {steps[currentStep].high !== undefined && <span className="mr-4">high = {steps[currentStep].high}</span>}
              {steps[currentStep].mid !== undefined && <span>mid = {steps[currentStep].mid}</span>}
            </div>
          </div>

          <div className="lg:w-1/3 bg-[#0a0a0a] border border-[#222222] rounded-xl p-5 font-mono text-sm shadow-inner">
            <h3 className="text-lg font-bold text-[#569cd6] mb-4">📝 Pseudocode</h3>
            <div className="space-y-1">
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

export default PeakElement;