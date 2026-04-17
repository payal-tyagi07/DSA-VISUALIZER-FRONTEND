import React, { useState, useEffect } from 'react';

const GasStations = () => {
  const pseudocodeLines = [
    "procedure minMaxGas(stations, k):",
    "  low = 0, high = max distance between stations",
    "  while high - low > 1e-6:",
    "    mid = (low + high) / 2",
    "    count = 0",
    "    for i from 1 to len(stations)-1:",
    "      diff = stations[i] - stations[i-1]",
    "      count += floor(diff / mid)",
    "    if count <= k: high = mid",
    "    else: low = mid",
    "  return high"
  ];

  const [arrayInput, setArrayInput] = useState('1,2,3,4,5,6,7,8,9,10');
  const [kInput, setKInput] = useState('9');
  const [array, setArray] = useState([]);
  const [k, setK] = useState(null);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const updateInputs = () => {
    const arrStr = arrayInput.split(',').map(s => s.trim()).filter(s => s !== '');
    const newArray = arrStr.map(Number).filter(n => !isNaN(n));
    const newK = Number(kInput);
    if (newArray.length === 0 || isNaN(newK)) return;
    setArray(newArray);
    setK(newK);
  };

  const generateSteps = (stations, k) => {
    const steps = [];
    let low = 0;
    let high = 0;
    for (let i = 1; i < stations.length; i++) {
      high = Math.max(high, stations[i] - stations[i - 1]);
    }
    let iter = 0;
    const maxIter = 20; // limit for display

    steps.push({
      array: stations,
      low,
      high,
      mid: null,
      count: null,
      result: null,
      description: `Minimize max distance with ${k} new stations`,
      pseudocodeLine: 1
    });

    while (high - low > 1e-6 && iter < maxIter) {
      const mid = (low + high) / 2;
      let count = 0;
      for (let i = 1; i < stations.length; i++) {
        const diff = stations[i] - stations[i - 1];
        count += Math.floor(diff / mid);
      }
      steps.push({
        array: stations,
        low,
        high,
        mid,
        count,
        result: null,
        description: `mid = ${mid.toFixed(6)} → need ${count} stations (max ${k})`,
        pseudocodeLine: 3
      });

      if (count <= k) {
        high = mid;
        steps.push({
          array: stations,
          low,
          high,
          mid,
          count,
          result: null,
          description: `feasible → try smaller, high = ${high.toFixed(6)}`,
          pseudocodeLine: 6
        });
      } else {
        low = mid;
        steps.push({
          array: stations,
          low,
          high,
          mid,
          count,
          result: null,
          description: `not feasible → increase low, low = ${low.toFixed(6)}`,
          pseudocodeLine: 7
        });
      }
      iter++;
      if (high - low > 1e-6 && iter < maxIter) {
        steps.push({
          array: stations,
          low,
          high,
          mid: null,
          count: null,
          result: null,
          description: `Now search in [${low.toFixed(6)}, ${high.toFixed(6)}]`,
          pseudocodeLine: 2
        });
      }
    }

    const result = high;
    steps.push({
      array: stations,
      low,
      high,
      mid: null,
      count: null,
      result,
      description: `Minimum max distance = ${result.toFixed(6)}`,
      pseudocodeLine: 8
    });

    return steps;
  };

  useEffect(() => {
    if (array.length > 0 && k !== null) {
      const newSteps = generateSteps(array, k);
      setSteps(newSteps);
      setCurrentStep(0);
      setIsPlaying(false);
    }
  }, [array, k]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(currentStep + 1), speed);
    } else if (currentStep === steps.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  const getBgColor = (index) => 'bg-blue-500'; // no specific highlight for this problem
  const getBorderStyle = () => 'border-2 border-[#222222]';

  const step = steps[currentStep] || {};

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl transition-all duration-300 font-mono border border-[#222222]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Gas Stations (Minimize Max Distance)</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">⏱️ Time: <span className="text-[#4ec9b0]">O(n log precision)</span></span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">💾 Space: <span className="text-[#4ec9b0]">O(1)</span></span>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); updateInputs(); }} className="flex flex-wrap justify-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-[#9cdcfe]">Stations (sorted):</label>
          <input type="text" value={arrayInput} onChange={(e) => setArrayInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 focus:border-[#569cd6]" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[#9cdcfe]">New stations k:</label>
          <input type="number" min="1" value={kInput} onChange={(e) => setKInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 focus:border-[#569cd6]" />
        </div>
        <button type="submit" className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">Update</button>
      </form>

      {steps.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-6">
            <div className="flex justify-center gap-3 flex-wrap">
              {step.array?.map((num, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl bg-blue-500 ${getBorderStyle()}`}>
                    {num}
                  </div>
                  <div className="text-xs mt-1 text-gray-400">idx {idx}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-6 flex-wrap text-sm">
              <div className="flex items-center gap-2"><span className="w-4 h-4 bg-blue-500 rounded-full"></span>Station</div>
            </div>

            <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]">
              <p className="text-gray-300">
                <span className="font-bold text-[#9cdcfe]">Step {currentStep + 1}:</span> {step.description}
              </p>
              {step.mid !== null && (
                <div className="mt-2 text-sm">
                  mid = {step.mid.toFixed(6)} | stations needed = {step.count}
                </div>
              )}
              {step.result !== null && (
                <div className="mt-2 text-[#4ec9b0] font-bold">Result = {step.result.toFixed(6)}</div>
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

export default GasStations;