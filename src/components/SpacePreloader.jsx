import React, { useEffect, useState } from 'react';

const SpacePreloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      {/* Stars background (CSS only) */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: 0.5 + Math.random() * 0.5,
              animation: `twinkle ${2 + Math.random() * 3}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <div className="text-5xl font-bold text-green-400 retro-text mb-6 animate-pulse">AlgoScape</div>
        <div className="w-80 h-2 bg-gray-800 rounded-full overflow-hidden mx-auto">
          <div
            className="h-full bg-green-400 rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-green-400 retro-text text-sm mt-4">
          {progress < 30 && "✨ Initializing galaxy..."}
          {progress >= 30 && progress < 60 && "🌌 Loading algorithms..."}
          {progress >= 60 && progress < 90 && "🪐 Preparing planets..."}
          {progress >= 90 && "🚀 Almost ready!"}
        </p>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default SpacePreloader;