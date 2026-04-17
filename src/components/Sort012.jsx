import React, { useState, useEffect } from 'react';

const Sort012 = () => {
  const pseudocodeLines = [
    "procedure sort012(arr):",
    "  low = 0, mid = 0, high = n-1",
    "  while mid <= high:",
    "    if arr[mid] == 0:",
    "      swap(arr[low], arr[mid])",
    "      low++; mid++",
    "    else if arr[mid] == 1:",
    "      mid++",
    "    else: // arr[mid] == 2",
    "      swap(arr[mid], arr[high])",
    "      high--"
  ];

  const defaultArray = [2,0,2,1,1,0];
  const [array, setArray] = useState(defaultArray);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [arrayInput, setArrayInput] = useState(defaultArray.join(','));

  const updateArray = () => {
    const newArr = arrayInput.split(',').map(x => Number(x.trim())).filter(n => !isNaN(n));
    if (newArr.length) setArray(newArr);
  };

  const generateSteps = (arr) => {
    const steps = [];
    let low = 0, mid = 0, high = arr.length - 1;
    let currentArr = [...arr];
    steps.push({
      array: [...currentArr],
      low, mid, high,
      description: `Start: low=0, mid=0, high=${high}`,
      pseudocodeLine: 1
    });

    while (mid <= high) {
      if (currentArr[mid] === 0) {
        [currentArr[low], currentArr[mid]] = [currentArr[mid], currentArr[low]];
        steps.push({
          array: [...currentArr],
          low, mid, high,
          description: `arr[${mid}] = 0 → swap with arr[${low}], low++, mid++`,
          pseudocodeLine: 3
        });
        low++;
        mid++;
      } else if (currentArr[mid] === 1) {
        steps.push({
          array: [...currentArr],
          low, mid, high,
          description: `arr[${mid}] = 1 → move mid++`,
          pseudocodeLine: 4
        });
        mid++;
      } else {
        [currentArr[mid], currentArr[high]] = [currentArr[high], currentArr[mid]];
        steps.push({
          array: [...currentArr],
          low, mid, high,
          description: `arr[${mid}] = 2 → swap with arr[${high}], high--`,
          pseudocodeLine: 5
        });
        high--;
      }
      if (mid <= high) {
        steps.push({
          array: [...currentArr],
          low, mid, high,
          description: `Now low=${low}, mid=${mid}, high=${high}`,
          pseudocodeLine: 2
        });
      }
    }
    steps.push({
      array: [...currentArr],
      low, mid, high,
      description: `Sorted array: [${currentArr.join(',')}]`,
      pseudocodeLine: 0
    });
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
    if (step.result === idx) return 'bg-green-600';
    if (step.low === idx) return 'border-2 border-[#4ec9b0]';
    if (step.mid === idx) return 'bg-yellow-500';
    if (step.high === idx) return 'border-2 border-[#ce9178]';
    return 'bg-blue-500';
  };

  const getBorderStyle = (idx) => {
    if (step.low === idx) return 'border-2 border-[#4ec9b0]';
    if (step.high === idx) return 'border-2 border-[#ce9178]';
    if (step.mid === idx) return 'border-2 border-yellow-500';
    return 'border-2 border-[#222222]';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Sort 0s, 1s, 2s (Dutch National Flag)</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">⏱️ Time: O(n)</span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">💾 Space: O(1)</span>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <input type="text" value={arrayInput} onChange={(e) => setArrayInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 focus:border-[#569cd6]" />
        <button onClick={updateArray} className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">Update</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left column: Visualization */}
        <div className="lg:w-2/3 space-y-6">
          <div className="flex justify-center gap-3 flex-wrap">
            {step.array?.map((val, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className={`w-16 h-16 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-2xl transition-all duration-300 ${getBgColor(idx)} ${getBorderStyle(idx)}`}>
                  {val}
                </div>
                <div className="text-xs mt-1">
                  {step.low === idx && <span className="text-[#4ec9b0]">L</span>}
                  {step.mid === idx && <span className="text-yellow-500">M</span>}
                  {step.high === idx && <span className="text-[#ce9178]">H</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-6 flex-wrap text-sm">
            <div className="flex items-center gap-2"><span className="w-4 h-4 bg-blue-500 rounded-full"></span>Element</div>
            <div className="flex items-center gap-2"><span className="w-4 h-4 bg-yellow-500 rounded-full"></span>Mid</div>
            <div className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-[#4ec9b0]"></span>Low</div>
            <div className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-[#ce9178]"></span>High</div>
          </div>

          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]">
            <p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {step.description}</p>
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

export default Sort012;