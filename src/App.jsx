import React, { useState } from 'react';
import AlgorithmCity from './components/AlgorithmCity';
import VisualizationRenderer from './components/VisualizationRenderer';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [selectedAlgo, setSelectedAlgo] = useState(null);

  const handleBackToCity = () => setSelectedAlgo(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      <ThemeToggle />
      {selectedAlgo ? (
        <div>
          <button
            onClick={handleBackToCity}
            className="fixed top-4 left-4 z-10 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-md"
          >
            ← Back to City
          </button>
          <VisualizationRenderer algorithm={selectedAlgo} />
        </div>
      ) : (
        <AlgorithmCity onSelectAlgorithm={setSelectedAlgo} />
      )}
    </div>
  );
}

export default App;