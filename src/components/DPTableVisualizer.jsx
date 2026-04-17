// src/components/DPTableVisualizer.jsx
import React from 'react';

const DPTableVisualizer = ({ table, rows, cols, rowLabels, colLabels, highlight = {} }) => {
  // Ensure rowLabels and colLabels are arrays
  const safeRowLabels = Array.isArray(rowLabels) ? rowLabels : [];
  const safeColLabels = Array.isArray(colLabels) ? colLabels : [];
  
  if (!table || !Array.isArray(table) || table.length === 0) {
    return <div className="text-gray-400">DP table not ready</div>;
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse mx-auto">
        <thead>
          <tr>
            <th className="border border-[#3c3c3c] p-2 bg-[#1e1e1e]"></th>
            {safeColLabels.map((label, j) => (
              <th key={j} className="border border-[#3c3c3c] p-2 bg-[#1e1e1e] text-[#9cdcfe]">{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.map((row, i) => (
            <tr key={i}>
              <td className="border border-[#3c3c3c] p-2 bg-[#1e1e1e] text-[#9cdcfe]">{safeRowLabels[i] !== undefined ? safeRowLabels[i] : i}</td>
              {row.map((cell, j) => {
                let bgColor = 'bg-[#0a0a0a]';
                if (highlight.current && highlight.current[0] === i && highlight.current[1] === j) bgColor = 'bg-yellow-800';
                else if (highlight.computed && highlight.computed.some(([x,y]) => x===i && y===j)) bgColor = 'bg-green-800';
                else if (highlight.path && highlight.path.some(([x,y]) => x===i && y===j)) bgColor = 'bg-blue-800';
                return (
                  <td key={j} className={`border border-[#3c3c3c] p-2 text-center ${bgColor} text-white`}>
                    {cell === Infinity ? '∞' : cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DPTableVisualizer;