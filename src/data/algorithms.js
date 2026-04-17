// src/data/algorithms.js

// Extract all algorithms from your main curriculum structure
const extractAllAlgorithms = () => {
  const allAlgorithms = [];
  
  // This is your main curriculum data from above
  const curriculum = [/* Your complete curriculum array here */];
  
  curriculum.forEach(step => {
    step.subtopics.forEach(subtopic => {
      subtopic.problems.forEach(problem => {
        // Generate keywords from the problem name
        const keywords = generateKeywords(problem.name);
        
        allAlgorithms.push({
          id: problem.id,
          name: problem.name,
          visualizable: problem.visualizable || false,
          stepId: step.id,
          stepName: step.name,
          subtopicId: subtopic.id,
          subtopicName: subtopic.name,
          keywords: keywords
        });
      });
    });
  });
  
  return allAlgorithms;
};

// Enhanced keyword generation with sub-word support
const generateKeywords = (name) => {
  const lowerName = name.toLowerCase();
  const keywords = new Set();
  
  // Add the full name
  keywords.add(lowerName);
  
  // Split into words and add each word
  const words = lowerName.split(/\s+/);
  words.forEach(word => {
    keywords.add(word);
    
    // Add common variations
    if (word.endsWith('s')) keywords.add(word.slice(0, -1));
    if (word.endsWith('ing')) keywords.add(word.slice(0, -3));
    if (word.endsWith('ed')) keywords.add(word.slice(0, -2));
  });
  
  // Add special cases for common algorithm names
  const specialCases = {
    'binary search': ['binsearch', 'bs', 'binary'],
    'bubble sort': ['bubblesort', 'bubble'],
    'quick sort': ['quicksort', 'quick'],
    'merge sort': ['mergesort', 'merge'],
    'insertion sort': ['insertionsort', 'insertion'],
    'selection sort': ['selectionsort', 'selection'],
    'kadane': ['maximum subarray', 'max subarray'],
    'two sum': ['2sum', 'two sum'],
    'three sum': ['3sum', 'three sum'],
    'four sum': ['4sum', 'four sum'],
  };
  
  // Add special case mappings
  Object.entries(specialCases).forEach(([key, values]) => {
    if (lowerName.includes(key)) {
      values.forEach(v => keywords.add(v));
    }
  });
  
  return Array.from(keywords);
};

// Sub-word matching function
const matchesSubWord = (text, query) => {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  
  // Exact match
  if (lowerText.includes(lowerQuery)) return true;
  
  // Sub-word matching: split query and check if each part appears as a sub-word
  const queryParts = lowerQuery.split(/\s+/);
  if (queryParts.length > 1) {
    return queryParts.every(part => 
      lowerText.split(/\s+/).some(word => word.includes(part))
    );
  }
  
  // Check for sub-strings within words (e.g., "bin" in "Binary")
  const words = lowerText.split(/\s+/);
  return words.some(word => word.includes(lowerQuery));
};

// Enhanced search function with sub-word matching
const searchAlgorithms = (query, algorithmsList) => {
  if (!query || query.trim() === '') return [];
  
  const lowerQuery = query.toLowerCase();
  const results = [];
  
  for (const algo of algorithmsList) {
    // Check name with sub-word matching
    const nameMatch = matchesSubWord(algo.name, lowerQuery);
    
    // Check keywords
    const keywordMatch = algo.keywords.some(keyword => 
      matchesSubWord(keyword, lowerQuery)
    );
    
    // Check step and subtopic names
    const stepMatch = matchesSubWord(algo.stepName || '', lowerQuery);
    const subtopicMatch = matchesSubWord(algo.subtopicName || '', lowerQuery);
    
    if (nameMatch || keywordMatch || stepMatch || subtopicMatch) {
      // Calculate relevance score for better sorting
      let relevance = 0;
      if (algo.name.toLowerCase() === lowerQuery) relevance = 100;
      else if (algo.name.toLowerCase().startsWith(lowerQuery)) relevance = 90;
      else if (algo.name.toLowerCase().includes(lowerQuery)) relevance = 80;
      else if (keywordMatch) relevance = 70;
      else if (stepMatch) relevance = 60;
      else if (subtopicMatch) relevance = 50;
      
      results.push({ ...algo, relevance });
    }
  }
  
  // Sort by relevance
  return results.sort((a, b) => b.relevance - a.relevance);
};

const allAlgorithms = extractAllAlgorithms();

export { allAlgorithms, searchAlgorithms, matchesSubWord };
export default allAlgorithms;