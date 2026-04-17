import React from 'react';

const ProgressTracker = ({ topics }) => {
  const total = topics.reduce((acc, t) => acc + t.total, 0);
  const completed = topics.reduce((acc, t) => acc + (t.completed || 0), 0);
  const percent = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h3 className="font-bold mb-2">Your Progress</h3>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div className="bg-green-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${percent}%` }}></div>
      </div>
      <p className="text-sm text-gray-600">{completed}/{total} problems solved ({percent}%)</p>
    </div>
  );
};

export default ProgressTracker;