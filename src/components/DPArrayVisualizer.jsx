// src/components/DPArrayVisualizer.jsx
import React from 'react';

const DPArrayVisualizer = ({ array = [], labels = [], highlight = {} }) => {
  if (!array.length) return <div className="text-gray-400">DP array not ready</div>;
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {array.map((val, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className={`w-16 h-16 flex items-center justify-center text-lg font-mono rounded border ${highlight.current === i ? 'bg-yellow-800' : highlight.computed?.includes(i) ? 'bg-green-800' : 'bg-[#1e1e1e]'} text-white border-[#3c3c3c]`}>
            {val === Infinity ? '∞' : val}
          </div>
          <div className="text-xs text-gray-400 mt-1">{labels[i] || i}</div>
        </div>
      ))}
    </div>
  );
};

export default DPArrayVisualizer;