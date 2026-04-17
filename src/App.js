import React, { useContext } from 'react';
import A2ZSheetLayout from './components/A2ZSheetLayout';

function App() {
  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a] text-gray-200 font-mono">
      <header className="bg-[#0d0d0d] border-b border-[#222222] py-3 px-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-[#007acc] rounded-lg flex items-center justify-center text-white font-bold text-lg">
          &lt;/&gt;
        </div>
        <h1 className="text-xl font-bold text-[#9cdcfe] tracking-wide">DSA VISUALIZER</h1>
      </header>

      {/* Main content area – takes remaining height */}
      <div className="flex-1 overflow-hidden">
        <A2ZSheetLayout />
      </div>
    </div>
  );
}

export default App;