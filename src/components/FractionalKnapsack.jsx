import React, { useState, useEffect } from 'react';

const FractionalKnapsack = () => {
  const pseudocodeLines = [
    "procedure fractionalKnapsack(items, capacity):",
    "  sort items by value/weight descending",
    "  totalValue = 0",
    "  for each item in items:",
    "    if capacity >= item.weight:",
    "      take whole item",
    "      capacity -= item.weight",
    "      totalValue += item.value",
    "    else:",
    "      take fraction = capacity / item.weight",
    "      totalValue += item.value * fraction",
    "      break",
    "  return totalValue"
  ];

  const defaultItems = [
    { name: 'A', weight: 10, value: 60 },
    { name: 'B', weight: 20, value: 100 },
    { name: 'C', weight: 30, value: 150 }
  ];
  const defaultCapacity = 50;

  const [items, setItems] = useState(defaultItems);
  const [capacity, setCapacity] = useState(defaultCapacity);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [itemInput, setItemInput] = useState('A,10,60;B,20,100;C,30,150');
  const [capacityInput, setCapacityInput] = useState('50');

  const updateItems = () => {
    const lines = itemInput.split(';').map(l => l.trim());
    const newItems = lines.map(line => {
      const parts = line.split(',');
      return { name: parts[0], weight: Number(parts[1]), value: Number(parts[2]) };
    });
    setItems(newItems);
    setCapacity(Number(capacityInput));
  };

  const generateSteps = (items, cap) => {
    const steps = [];
    const sorted = [...items].sort((a,b) => (b.value/b.weight) - (a.value/a.weight));
    steps.push({ items: sorted.map(i => ({...i})), capacity: cap, totalValue: 0, description: "Sort items by value/weight ratio", pseudocodeLine: 1 });
    let remaining = cap;
    let totalValue = 0;
    for (let i = 0; i < sorted.length; i++) {
      const item = sorted[i];
      if (remaining >= item.weight) {
        totalValue += item.value;
        remaining -= item.weight;
        steps.push({ items: sorted.map(i => ({...i})), capacity: remaining, totalValue, taken: i, fraction: 1, description: `Take whole item ${item.name} (weight ${item.weight}, value ${item.value}), remaining capacity = ${remaining}`, pseudocodeLine: 3 });
      } else {
        const fraction = remaining / item.weight;
        const addValue = item.value * fraction;
        totalValue += addValue;
        steps.push({ items: sorted.map(i => ({...i})), capacity: 0, totalValue, taken: i, fraction, description: `Take ${fraction.toFixed(2)} of ${item.name} (value ${addValue.toFixed(2)}), total value = ${totalValue.toFixed(2)}`, pseudocodeLine: 5 });
        break;
      }
    }
    steps.push({ totalValue, description: `Maximum value = ${totalValue.toFixed(2)}`, pseudocodeLine: 7 });
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(items, capacity));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [items, capacity]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(currentStep + 1), speed);
    } else if (currentStep === steps.length - 1) setIsPlaying(false);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, steps.length]);

  const step = steps[currentStep] || {};

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#0a0a0a] text-gray-200 rounded-2xl shadow-2xl font-mono border border-[#222222]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#569cd6] mb-2">Fractional Knapsack</h2>
        <div className="flex justify-center gap-4 mb-4">
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">⏱️ Time: O(n log n)</span>
          <span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">💾 Space: O(1)</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <input type="text" value={itemInput} onChange={(e) => setItemInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 w-96" placeholder="name,weight,value;name2,weight2,value2" />
        <input type="number" value={capacityInput} onChange={(e) => setCapacityInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 w-24" />
        <button onClick={updateItems} className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">Update</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          {/* Items table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#1e1e1e]">
                  <th className="border border-[#3c3c3c] p-2">Item</th>
                  <th className="border border-[#3c3c3c] p-2">Weight</th>
                  <th className="border border-[#3c3c3c] p-2">Value</th>
                  <th className="border border-[#3c3c3c] p-2">Ratio</th>
                  <th className="border border-[#3c3c3c] p-2">Taken</th>
                </tr>
              </thead>
              <tbody>
                {step.items?.map((item, idx) => (
                  <tr key={idx} className={`${idx === step.taken ? 'bg-yellow-800' : ''}`}>
                    <td className="border border-[#3c3c3c] p-2 text-center">{item.name}</td>
                    <td className="border border-[#3c3c3c] p-2 text-center">{item.weight}</td>
                    <td className="border border-[#3c3c3c] p-2 text-center">{item.value}</td>
                    <td className="border border-[#3c3c3c] p-2 text-center">{(item.value/item.weight).toFixed(2)}</td>
                    <td className="border border-[#3c3c3c] p-2 text-center">
                      {step.taken !== undefined && idx === step.taken && step.fraction !== undefined ? `${(step.fraction * 100).toFixed(0)}%` : idx < step.taken ? '100%' : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]">
            <p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {step.description}</p>
            {step.totalValue !== undefined && <p className="text-[#4ec9b0] mt-2">Total value = {step.totalValue.toFixed(2)}</p>}
          </div>

          {/* Progress, speed, buttons (same as other components) */}
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

export default FractionalKnapsack;