import { createStringVisualizer } from '../visualizations/stringFactory';

const generateSteps = (str) => {
  const steps = [];
  const freq = new Array(26).fill(0);
  steps.push({ string: str, description: "Count frequencies", pseudocodeLine: 1 });
  for (let i = 0; i < str.length; i++) {
    freq[str.charCodeAt(i)-97]++;
    steps.push({ string: str, highlight: [i], description: `freq[${str[i]}] = ${freq[str.charCodeAt(i)-97]}`, pseudocodeLine: 2 });
  }
  for (let i = 0; i < str.length; i++) {
    if (freq[str.charCodeAt(i)-97] === 1) {
      steps.push({ string: str, highlight: [i], result: i, description: `First unique character at index ${i} ('${str[i]}')` });
      return steps;
    }
    steps.push({ string: str, highlight: [i], description: `'${str[i]}' appears ${freq[str.charCodeAt(i)-97]} times → skip`, pseudocodeLine: 3 });
  }
  steps.push({ string: str, result: -1, description: "No unique character" });
  return steps;
};

export default createStringVisualizer({
  title: "First Unique Character in a String",
  pseudocodeLines: [
    "procedure firstUniqChar(s):",
    "  freq = array of size 26",
    "  for char in s: freq[char]++",
    "  for i, char in s:",
    "    if freq[char] == 1: return i",
    "  return -1"
  ],
  generateSteps,
  complexity: { time: 'O(n)', space: 'O(1)' }
});