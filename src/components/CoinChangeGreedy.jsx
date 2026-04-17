import React, { useState, useEffect } from 'react';

const CoinChangeGreedy = () => {
  const pseudocodeLines = [
    "procedure coinChange(coins, amount):",
    "  sort coins descending",
    "  count = 0",
    "  for coin in coins:",
    "    if amount == 0: break",
    "    num = floor(amount / coin)",
    "    count += num",
    "    amount -= num * coin",
    "  if amount > 0: return -1",
    "  else: return count"
  ];
  const [coins, setCoins] = useState([1,2,5,10,20,50,100,500,2000]);
  const [amount, setAmount] = useState(73);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [coinInput, setCoinInput] = useState('1,2,5,10,20,50,100,500,2000');
  const [amountInput, setAmountInput] = useState('73');

  const update = () => {
    const newCoins = coinInput.split(',').map(Number).filter(n=>!isNaN(n));
    setCoins(newCoins);
    setAmount(Number(amountInput));
  };

  const generateSteps = (coins, amount) => {
    const steps = [];
    const sorted = [...coins].sort((a,b)=>b-a);
    let remaining = amount;
    let totalCoins = 0;
    steps.push({ coins: sorted, amount, remaining, totalCoins, description: "Sort coins descending", pseudocodeLine: 1 });
    for (let i = 0; i < sorted.length; i++) {
      const coin = sorted[i];
      if (remaining === 0) break;
      const num = Math.floor(remaining / coin);
      if (num > 0) {
        totalCoins += num;
        remaining -= num * coin;
        steps.push({ coins: sorted, remaining, totalCoins, highlight: i, coin, num, description: `Use ${num} × ${coin} = ${num*coin}, remaining = ${remaining}`, pseudocodeLine: 4 });
      } else {
        steps.push({ coins: sorted, remaining, totalCoins, highlight: i, description: `Skip ${coin} (too large)`, pseudocodeLine: 3 });
      }
    }
    if (remaining > 0) {
      steps.push({ error: true, description: `Cannot make amount ${amount} with given coins (remaining ${remaining})`, pseudocodeLine: 6 });
    } else {
      steps.push({ totalCoins, description: `Minimum coins needed = ${totalCoins}`, pseudocodeLine: 7 });
    }
    return steps;
  };

  useEffect(() => {
    setSteps(generateSteps(coins, amount));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [coins, amount]);

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
      <div className="text-center mb-6"><h2 className="text-3xl font-bold text-[#569cd6] mb-2">Coin Change (Greedy)</h2><div className="flex justify-center gap-4 mb-4"><span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">⏱️ Time: O(n)</span><span className="bg-[#2d2d2d] px-3 py-1 rounded-full text-sm">💾 Space: O(1)</span></div></div>
      <div className="flex flex-wrap justify-center gap-4 mb-6"><input type="text" value={coinInput} onChange={(e) => setCoinInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1" placeholder="coins, comma separated" /><input type="number" value={amountInput} onChange={(e) => setAmountInput(e.target.value)} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1 w-24" /><button onClick={update} className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-1 rounded">Update</button></div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <div className="flex gap-1 flex-wrap">{step.coins?.map((c,i) => (<div key={i} className={`w-16 h-16 flex items-center justify-center text-lg font-mono rounded border ${i === step.highlight ? 'bg-yellow-500 text-black' : 'bg-[#1e1e1e] text-white'} border-[#3c3c3c]`}>{c}</div>))}</div>
          <div className="bg-[#0d0d0d] p-4 rounded-lg border-l-4 border-[#569cd6]"><p className="text-gray-300"><span className="font-bold text-[#9cdcfe]">Step {currentStep+1}:</span> {step.description}</p>{step.totalCoins !== undefined && <p className="text-[#4ec9b0] mt-2">Total coins = {step.totalCoins}</p>}{step.error && <p className="text-red-500">{step.description}</p>}</div>
          {/* progress, speed, buttons */}
          <div><div className="flex justify-between text-sm text-gray-400 mb-1"><span>Progress</span><span>{Math.round(((currentStep+1)/steps.length)*100)}%</span></div><div className="w-full bg-[#1a1a1a] rounded-full h-3 overflow-hidden"><div className="bg-[#4ec9b0] h-3 rounded-full transition-all" style={{ width: `${((currentStep+1)/steps.length)*100}%` }}></div></div><div className="text-center text-xs text-gray-500 mt-1">Step {currentStep+1} of {steps.length}</div></div>
          <div className="flex items-center justify-center gap-4 bg-[#0d0d0d] p-3 rounded-lg"><span>⏱️ Speed:</span><input type="range" min="300" max="2000" value={speed} onChange={(e) => setSpeed(e.target.value)} className="w-48 md:w-64 accent-[#4ec9b0]" /><span className="bg-[#1a1a1a] px-3 py-1 rounded-full">{speed}ms</span></div>
          <div className="flex justify-center gap-4 flex-wrap">
            <button onClick={() => { setCurrentStep(Math.max(0, currentStep-1)); setIsPlaying(false); }} disabled={currentStep===0} className={`px-6 py-3 rounded-lg font-semibold transition-all ${currentStep===0 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : 'bg-[#0e639c] hover:bg-[#1177bb] text-white'}`}>← Prev</button>
            <button onClick={() => { setCurrentStep(0); setIsPlaying(false); }} className="px-6 py-3 bg-[#c2410c] hover:bg-[#b91c1c] text-white rounded-lg">Reset</button>
            <button onClick={() => setIsPlaying(!isPlaying)} disabled={currentStep===steps.length-1} className={`px-6 py-3 rounded-lg font-semibold ${currentStep===steps.length-1 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : isPlaying ? 'bg-[#ca5100] hover:bg-[#b74700] text-white' : 'bg-[#2e7d32] hover:bg-[#1e5f20] text-white'}`}>{isPlaying ? '⏸️ Pause' : '▶️ Play'}</button>
            <button onClick={() => { setCurrentStep(Math.min(steps.length-1, currentStep+1)); setIsPlaying(false); }} disabled={currentStep===steps.length-1} className={`px-6 py-3 rounded-lg font-semibold ${currentStep===steps.length-1 ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed' : 'bg-[#0e639c] hover:bg-[#1177bb] text-white'}`}>Next →</button>
          </div>
        </div>
        <div className="lg:w-1/3 bg-[#0a0a0a] border border-[#222222] rounded-xl p-5 font-mono text-sm shadow-inner"><h3 className="text-lg font-bold text-[#569cd6] mb-4">📝 Pseudocode</h3><div className="space-y-1">{pseudocodeLines.map((line, idx) => (<div key={idx} className={`px-3 py-1.5 rounded transition-all duration-200 ${idx === step.pseudocodeLine ? 'bg-[#1a1a1a] text-[#d4d4d4] font-semibold border-l-4 border-[#569cd6]' : 'text-[#9cdcfe] hover:bg-[#1a1a1a]'}`}>{line}</div>))}</div></div>
      </div>
    </div>
  );
};

export default CoinChangeGreedy;