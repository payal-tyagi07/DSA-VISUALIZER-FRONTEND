// src/components/A2ZSheetLayout.jsx
import React, { useState } from 'react';
import topics from '../data/a2zTopics';
import VisualizationRenderer from './VisualizationRenderer';
import AlgorithmGalaxy from './AlgorithmGalaxy';  // ✅ changed to space galaxy
import SearchBarWithSuggestions from './SearchBarWithSuggestions';

const A2ZSheetLayout = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [expandedTopics, setExpandedTopics] = useState({});
  const [notFoundQuery, setNotFoundQuery] = useState(null);

  const toggleTopic = (topicId) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  const handleAlgorithmSelect = (algorithm, searchQuery) => {
    if (algorithm) {
      setSelectedAlgorithm({
        id: algorithm.id,
        name: algorithm.name,
        visualizable: true
      });
      setNotFoundQuery(null);
    } else if (searchQuery) {
      setSelectedAlgorithm(null);
      setNotFoundQuery(searchQuery);
    }
  };

  return (
    <div className="flex h-full bg-[#0a0a0a] text-gray-300 font-mono">
      {/* Sidebar – scrollable */}
      <div className="w-64 bg-[#111111] border-r border-[#222222] overflow-y-auto">
        <div className="p-3 bg-[#0d0d0d] border-b border-[#222222]">
          <h2 className="text-base font-bold text-[#9cdcfe] flex items-center gap-2">
            <span>📚</span> DSA SHEET
          </h2>
          <p className="text-[11px] text-[#6a9955] mt-1">Visualize Your Code</p>
        </div>

        <div className="p-2">
          {topics.map((topic) => (
            <div key={topic.id} className="mb-2">
              <button
                onClick={() => toggleTopic(topic.id)}
                className="w-full text-left p-2 bg-[#0d0d0d] hover:bg-[#1a1a1a] rounded flex justify-between items-center transition-colors border border-transparent hover:border-[#333333]"
              >
                <span className="text-[#9cdcfe] text-sm font-medium">{topic.name}</span>
                <span className="text-xs text-[#6a9955]">
                  {topic.completed || 0}/{topic.total}
                </span>
              </button>

              {expandedTopics[topic.id] && (
                <div className="ml-3 mt-1 space-y-1">
                  {topic.subtopics.map((subtopic) => (
                    <div key={subtopic.id} className="border-l-2 border-[#222222] pl-2">
                      <h4 className="text-xs font-medium text-[#d4d4d4] mt-2 mb-1">
                        {subtopic.name}
                      </h4>
                      {subtopic.problems.map((problem) => (
                        <button
                          key={problem.id}
                          onClick={() => {
                            setSelectedAlgorithm(problem);
                            setNotFoundQuery(null);
                          }}
                          className={`
                            w-full text-left p-1.5 text-xs rounded transition-colors
                            flex items-center gap-2
                            ${
                              selectedAlgorithm?.id === problem.id
                                ? 'bg-[#094771] text-white border-l-2 border-[#007acc] pl-2'
                                : 'text-[#9cdcfe] hover:bg-[#1a1a1a]'
                            }
                          `}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              problem.completed ? 'bg-[#6a9955]' : 'bg-[#3c3c3c]'
                            }`}
                          ></span>
                          {problem.name}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main content – scrollable independently */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-[#0a0a0a]">
        <div className="flex-1 p-0">
          {selectedAlgorithm ? (
            <VisualizationRenderer algorithm={selectedAlgorithm} />
          ) : notFoundQuery ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center p-8 bg-[#0a0a0a] border border-[#222222] rounded-xl shadow-2xl max-w-md">
                <h3 className="text-2xl font-bold text-[#569cd6] mb-4">Work in Progress 🚧</h3>
                <p className="text-gray-400 mb-4">
                  The algorithm <span className="text-yellow-500 font-mono">"{notFoundQuery}"</span> is not yet available.
                </p>
                <p className="text-sm text-gray-500">
                  We are constantly adding new visualizations. Please check back soon!
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setNotFoundQuery(null)}
                    className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-2 rounded transition"
                  >
                    Try another search
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <AlgorithmGalaxy onSelectAlgorithm={handleAlgorithmSelect} />
          )}
        </div>

        {/* Sticky bottom search bar (only shown when an algorithm is selected) */}
        {selectedAlgorithm && (
          <div className="sticky bottom-0 bg-[#0a0a0a] border-t border-[#222222] p-3">
            <SearchBarWithSuggestions
              onSelectAlgorithm={handleAlgorithmSelect}
              placeholder="Search another algorithm..."
              compact={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default A2ZSheetLayout;