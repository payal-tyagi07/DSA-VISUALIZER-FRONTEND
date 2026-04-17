import { createArrayVisualizer } from '../visualizations/arrayFactory';

const generateSteps = (arr) => {
  const steps = [];
  let maxCount = 0, currentCount = 0;
  steps.push({ array: arr, description: "Find maximum consecutive 1's", pseudocodeLine: 1 });
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === 1) {
      currentCount++;
      steps.push({ array: arr, highlight: [i], description: `1 found → current streak = ${currentCount}`, pseudocodeLine: 3 });
      if (currentCount > maxCount) {
        maxCount = currentCount;
        steps.push({ array: arr, highlight: [i], description: `New maximum streak = ${maxCount}`, pseudocodeLine: 4 });
      }
    } else {
      if (currentCount > 0) {
        steps.push({ array: arr, highlight: [i], description: `0 encountered → streak reset (was ${currentCount})`, pseudocodeLine: 2 });
      }
      currentCount = 0;
    }
  }
  steps.push({ array: arr, result: maxCount, description: `Maximum consecutive 1's = ${maxCount}` });
  return steps;
};

export default createArrayVisualizer({
  title: "Maximum Consecutive Ones",
  pseudocodeLines: [
    "procedure maxConsecutiveOnes(arr):",
    "  maxCount = 0, current = 0",
    "  for x in arr:",
    "    if x == 1: current++; maxCount = max(maxCount, current)",
    "    else: current = 0",
    "  return maxCount"
  ],
  generateSteps,
  complexity: { time: 'O(n)', space: 'O(1)' }
});