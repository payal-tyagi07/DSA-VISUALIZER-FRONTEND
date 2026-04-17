import React, { useState, useEffect } from 'react';

const Bouquets = () => {
  const pseudocodeLines = [
    "procedure minDays(bloomDay, m, k):",
    "  if m*k > len(bloomDay): return -1",
    "  low = min(bloomDay), high = max(bloomDay)",
    "  while low < high:",
    "    mid = floor((low + high) / 2)",
    "    bouquets = 0, flowers = 0",
    "    for day in bloomDay:",
    "      if day <= mid:",
    "        flowers++",
    "        if flowers == k:",
    "          bouquets++; flowers = 0",
    "      else: flowers = 0",
    "    if bouquets >= m: high = mid",
    "    else: low = mid + 1",
    "  return low"
  ];

  const defaultArrayInput = '1,10,3,10,2';
  const [mInput, setMInput] = useState('3');
  const [kInput, setKInput] = useState('1');
  const [array, setArray] = useState([]);
  const [m, setM] = useState(null);
  const [k, setK] = useState(null);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const updateInputs = () => {
    const arrStr = defaultArrayInput.split(',').map(s => s.trim()).filter(s => s !== '');
    const newArray = arrStr.map(Number).filter(n => !isNaN(n));
    const newM = Number(mInput);
    const newK = Number(kInput);
    if (newArray.length === 0 || isNaN(newM) || isNaN(newK)) return;
    setArray(newArray);
    setM(newM);
    setK(newK);
  };

  const generateSteps = (bloomDay, m, k) => {
    if (m * k > bloomDay.length) {
      return [{
        array: bloomDay,
        low: null,
        high: null,
        mid: null,
        bouquets: null,
        result: -1,
        description: `Not enough flowers: need ${m*k}, have ${bloomDay.length}`,
        pseudocodeLine: 0
      }];
    }

    const steps = [];
    let low = Math.min(...bloomDay);
    let high = Math.max(...bloomDay);
    let result = null;

    steps.push({
      array: bloomDay,
      low,
      high,
      mid: null,
      bouquets: null,
      result: null,
      description: `Find min days for ${m} bouquets of ${k} flowers each`,
      pseudocodeLine: 1
    });

    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      let bouquets = 0;
      let flowers = 0;
      for (const day of bloomDay) {
        if (day <= mid) {
          flowers++;
          if (flowers === k) {
            bouquets++;
            flowers = 0;
          }
        } else {
          flowers = 0;
        }
      }
      steps.push({
        array: bloomDay,
        low,
        high,
        mid,
        bouquets,
        result: null,
        description: `mid = ${mid} → can make ${bouquets} bouquets (need ${m})`,
        pseudocodeLine: 4
      });

      if (bouquets >= m) {
        high = mid;
        steps.push({
          array: bloomDay,
          low,
          high,
          mid,
          bouquets,
          result: null,
          description: `feasible → try fewer days, high = ${high}`,
          pseudocodeLine: 11
        });
      } else {
        low = mid + 1;
        steps.push({
          array: bloomDay,
          low,
          high,
          mid,
          bouquets,
          result: null,
          description: `not feasible → need more days, low = ${low}`,
          pseudocodeLine: 12
        });
      }

      if (low < high) {
        steps.push({
          array: bloomDay,
          low,
          high,
          mid: null,
          bouquets: null,
          result: null,
          description: `Now search in [${low}, ${high}]`,
          pseudocodeLine: 3
        });
      }
    }

    result = low;
    steps.push({
      array: bloomDay,
      low,
      high,
      mid: null,
      bouquets: null,
      result,
      description: `Minimum days = ${result}`,
      pseudocodeLine: 13
    });

    return steps;
  };

  useEffect(() => {
    if (array.length > 0 && m !== null && k !== null) {
      const newSteps = generateSteps(array, m, k);
      setSteps(newSteps);
      setCurrentStep(0);
      setIsPlaying(false);
    }
  }, [array, m, k]);

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

  const step = steps[currentStep] || {};

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl transition-all duration-300 font-mono border border-[#222222]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Minimum Days to Make Bouquets</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">⏱️ Time: <span className="text-[#4ec9b0]">O(n log max)</span></span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm border border-[#3c3c3c]">💾 Space: <span className="text-[#4ec9b0]">O(1)</span></span>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); updateInputs(); }} className="flex flex-wrap justify-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-[#9cdcfe]">bloomDay (fixed): [1,10,3,10,2]</label>
          <span className="text-gray-400">(hardcoded example)</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[#9cdcfe]">Bouquets m:</label>
          <input type="number" min="1" value={mInput} onChange={(e) => setMInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 focus:border-[#569cd6]" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[#9cdcfe]">Flowers per bouquet k:</label>
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
                  <div className={`w-16 h-16 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl ${getBgColor(idx)} ${getBorderStyle(idx)}`}>
                    {num}
                  </div>
                  <div className="text-xs mt-1 font-bold">
                    {step.low === idx && <span className="text-[#4ec9b0]">L</span>}
                    {step.mid === idx && <span className="text-yellow-500">M</span>}
                    {step.high === idx && <span className="text-[#ce9178]">H</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-6 flex-wrap text-sm">
              <div className="flex items-center gap-2"><span className="w-4 h-4 bg-blue-500 rounded-full"></span>Not examined</div>
              <div className="flex items-center gap-2"><span className="w-4 h-4 bg-yellow-500 rounded-full"></span>Mid</div>
              <div className="flex items-center gap-2"><span className="w-4 h-4 bg-green-600 rounded-full"></span>Result</div>
              <div className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-[#4ec9b0]"></span>Low</div>
              <div className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-[#ce9178]"></span>High</div>
            </div>

            <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]">
              <p className="text-gray-300">
                <span className="font-bold text-[#9cdcfe]">Step {currentStep + 1}:</span> {step.description}
              </p>
              {step.bouquets !== null && (
                <div className="mt-2 text-sm">bouquets = {step.bouquets}</div>
              )}
              {step.result !== null && (
                <div className="mt-2 text-[#4ec9b0] font-bold">Minimum days = {step.result}</div>
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

export default Bouquets;