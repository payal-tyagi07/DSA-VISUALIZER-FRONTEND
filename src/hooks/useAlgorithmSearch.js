// src/hooks/useAlgorithmSearch.js
import { useState, useEffect, useCallback } from 'react';
import { searchAlgorithms } from '../data/searchIndex';

export const useAlgorithmSearch = (debounceMs = 200) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = useCallback((q) => {
    if (!q.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }
    const matches = searchAlgorithms(q);
    setResults(matches);
    setIsSearching(false);
  }, []);

  useEffect(() => {
    setIsSearching(true);
    const handler = setTimeout(() => {
      performSearch(query);
    }, debounceMs);
    return () => clearTimeout(handler);
  }, [query, performSearch, debounceMs]);

  return { query, setQuery, results, isSearching };
};