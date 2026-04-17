// src/data/searchIndex.js
import topics from './a2zTopics';

// Helper: generate rich keywords from a problem name
const generateKeywords = (name) => {
  const lower = name.toLowerCase();
  const keywords = new Set();

  // full name
  keywords.add(lower);

  // split into words
  const words = lower.split(/\s+/);
  words.forEach(word => {
    keywords.add(word);
    // remove common suffixes
    if (word.endsWith('s')) keywords.add(word.slice(0, -1));
    if (word.endsWith('ing')) keywords.add(word.slice(0, -3));
    if (word.endsWith('ed')) keywords.add(word.slice(0, -2));
    if (word.endsWith('er')) keywords.add(word.slice(0, -2));
  });

  // special aliases
  const aliases = {
    '2sum': ['two sum', 'two-sum'],
    '3sum': ['three sum', 'three-sum'],
    '4sum': ['four sum', 'four-sum'],
    'kadane': ['maximum subarray', 'max subarray'],
    'koko eating bananas': ['koko', 'bananas'],
    'aggressive cows': ['cows', 'agg cows'],
    'book allocation': ['allocate books'],
    'dijkstra': ['shortest path', 'dijkstras'],
    'prims': ['minimum spanning tree', 'prim'],
    'kruskals': ['kruskal', 'mst'],
    'lca': ['lowest common ancestor'],
    'lis': ['longest increasing subsequence']
  };

  for (const [key, values] of Object.entries(aliases)) {
    if (lower.includes(key)) {
      values.forEach(v => keywords.add(v));
    }
  }

  return Array.from(keywords);
};

// Build the complete search index
export const searchIndex = (() => {
  const index = [];

  for (const step of topics) {
    for (const subtopic of step.subtopics) {
      for (const problem of subtopic.problems) {
        index.push({
          id: problem.id,
          name: problem.name,
          visualizable: problem.visualizable || false,
          stepId: step.id,
          stepName: step.name,
          subtopicId: subtopic.id,
          subtopicName: subtopic.name,
          keywords: generateKeywords(problem.name),
        });
      }
    }
  }
  return index;
})();

// Simple fuzzy + sub‑word matcher (no external library)
export const searchAlgorithms = (query, maxResults = 10) => {
  if (!query || query.trim() === '') return [];

  const lowerQuery = query.toLowerCase().trim();
  const results = [];

  for (const algo of searchIndex) {
    let score = 0;
    let matchedOn = '';

    // 1. Exact match on name → highest score
    if (algo.name.toLowerCase() === lowerQuery) {
      score = 100;
      matchedOn = 'exact';
    }
    // 2. Name starts with query
    else if (algo.name.toLowerCase().startsWith(lowerQuery)) {
      score = 90;
      matchedOn = 'start';
    }
    // 3. Sub‑word match in name (e.g., "bin" in "Binary")
    else if (algo.name.toLowerCase().includes(lowerQuery)) {
      score = 80;
      matchedOn = 'contains';
    }
    // 4. Keyword match (with sub‑word inside keyword)
    else {
      for (const kw of algo.keywords) {
        if (kw === lowerQuery) {
          score = 75;
          matchedOn = 'keyword exact';
          break;
        }
        if (kw.startsWith(lowerQuery)) {
          score = 70;
          matchedOn = 'keyword start';
          break;
        }
        if (kw.includes(lowerQuery)) {
          score = 60;
          matchedOn = 'keyword contains';
          break;
        }
      }
    }

    // 5. Step or subtopic name match (lower relevance)
    if (score === 0) {
      if (algo.stepName.toLowerCase().includes(lowerQuery)) {
        score = 40;
        matchedOn = 'step';
      } else if (algo.subtopicName.toLowerCase().includes(lowerQuery)) {
        score = 30;
        matchedOn = 'subtopic';
      }
    }

    if (score > 0) {
      results.push({ ...algo, score, matchedOn });
    }
  }

  // Sort by score desc, then by name length (shorter names first)
  results.sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score;
    return a.name.length - b.name.length;
  });

  return results.slice(0, maxResults);
};