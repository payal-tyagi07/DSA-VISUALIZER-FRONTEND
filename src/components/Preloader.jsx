import React, { useEffect } from 'react';

const Preloader = ({ onLoadingComplete }) => {
  useEffect(() => {
    // Simulate loading time (2 seconds)
    const timer = setTimeout(() => {
      onLoadingComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-[#0a0a0a]">
      <div className="text-3xl font-bold text-[#569cd6] mb-4">AlgoScape</div>
      <div className="w-64 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <div className="w-1/2 h-full bg-[#569cd6] animate-pulse rounded-full" />
      </div>
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading awesome algorithms...</p>
    </div>
  );
};

export default Preloader;