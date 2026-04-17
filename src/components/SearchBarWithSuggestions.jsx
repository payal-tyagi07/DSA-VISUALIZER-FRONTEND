// src/components/SearchBarWithSuggestions.jsx
import React, { useRef, useEffect } from 'react';
import { useAlgorithmSearch } from '../hooks/useAlgorithmSearch';

const highlightText = (text, query) => {
  if (!query) return text;
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <mark className="bg-yellow-500/40 text-yellow-200 rounded px-0.5">
        {text.slice(index, index + query.length)}
      </mark>
      {text.slice(index + query.length)}
    </>
  );
};

const SearchBarWithSuggestions = ({ onSelectAlgorithm, placeholder, compact = false }) => {
  const { query, setQuery, results, isSearching } = useAlgorithmSearch(150);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleSelect = (algo) => {
    setQuery(algo.name);
    setShowDropdown(false);
    setSelectedIndex(-1);
    onSelectAlgorithm(algo);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || results.length === 0) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % results.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) handleSelect(results[selectedIndex]);
        break;
      case 'Escape':
        setShowDropdown(false);
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length > 0) {
      setShowDropdown(true);
      setSelectedIndex(-1);
    } else {
      setShowDropdown(false);
    }
  }, [query]);

  return (
    <div className={`relative w-full ${compact ? 'max-w-md mx-auto' : 'max-w-2xl mx-auto'}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setShowDropdown(true)}
          placeholder={placeholder || "Search any algorithm... (e.g., 'bin', 'koko')"}
          className={`w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded-2xl px-4 py-2 pr-10 text-gray-200 focus:outline-none focus:border-[#569cd6] focus:ring-1 focus:ring-[#569cd6] ${compact ? 'text-sm py-1.5' : 'text-lg py-3'}`}
        />
        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9cdcfe]">
          🔍
        </button>
      </div>

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute z-20 w-full mt-1 bg-[#1e1e1e] border border-[#3c3c3c] rounded-xl shadow-lg overflow-hidden max-h-96 overflow-y-auto"
        >
          {isSearching ? (
            <div className="px-4 py-3 text-gray-400 text-sm">Searching...</div>
          ) : results.length === 0 ? (
            <div className="px-4 py-3 text-gray-400 text-sm">
              No results for "{query}". Try "sort", "search", "array", "graph", "dp"
            </div>
          ) : (
            results.map((algo, idx) => (
              <div
                key={algo.id}
                onClick={() => handleSelect(algo)}
                className={`px-4 py-2 hover:bg-[#2d2d2d] cursor-pointer transition-colors ${
                  idx === selectedIndex ? 'bg-[#2d2d2d] border-l-4 border-[#569cd6]' : ''
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="text-gray-200 text-sm font-medium">
                    {highlightText(algo.name, query)}
                  </div>
                  {algo.score > 85 && (
                    <div className="text-[#569cd6] text-xs ml-2">⭐ Best match</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBarWithSuggestions;