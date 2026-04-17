import { createStringVisualizer } from '../visualizations/stringFactory';

const generateSteps = (s) => {
  const map = { 'I':1, 'V':5, 'X':10, 'L':50, 'C':100, 'D':500, 'M':1000 };
  const steps = [];
  let total = 0;
  steps.push({ string: s, description: "Convert Roman to Integer", pseudocodeLine: 1 });
  for (let i = 0; i < s.length; i++) {
    const curr = map[s[i]];
    const next = map[s[i+1]];
    if (next && curr < next) {
      total -= curr;
      steps.push({ string: s, highlight: [i], description: `Subtract ${curr} because ${s[i]} < ${s[i+1]}`, pseudocodeLine: 3 });
    } else {
      total += curr;
      steps.push({ string: s, highlight: [i], description: `Add ${curr}`, pseudocodeLine: 4 });
    }
  }
  steps.push({ string: s, result: total, description: `Integer value = ${total}` });
  return steps;
};

export default createStringVisualizer({
  title: "Roman to Integer",
  pseudocodeLines: [
    "procedure romanToInt(s):",
    "  map = {...}",
    "  total = 0",
    "  for i = 0 to n-1:",
    "    if i+1 < n and map[s[i]] < map[s[i+1]]: subtract",
    "    else: add",
    "  return total"
  ],
  generateSteps,
  complexity: { time: 'O(n)', space: 'O(1)' }
});