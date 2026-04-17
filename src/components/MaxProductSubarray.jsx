import { createArrayVisualizer } from '../visualizations/arrayFactory';

const generateSteps = (arr) => {
  const steps = [];
  let maxProd = arr[0];
  let minProd = arr[0];
  let result = arr[0];
  steps.push({ array: arr, description: "Find maximum product subarray", pseudocodeLine: 1 });
  for (let i = 1; i < arr.length; i++) {
    const options = [arr[i], maxProd * arr[i], minProd * arr[i]];
    const newMax = Math.max(...options);
    const newMin = Math.min(...options);
    steps.push({ array: arr, highlight: [i], description: `At i=${i}, val=${arr[i]}, max=${newMax}, min=${newMin}`, pseudocodeLine: 3 });
    maxProd = newMax;
    minProd = newMin;
    result = Math.max(result, maxProd);
    steps.push({ array: arr, description: `Current max product = ${result}`, pseudocodeLine: 4 });
  }
  steps.push({ array: arr, result, description: `Maximum product subarray product = ${result}` });
  return steps;
};

export default createArrayVisualizer({
  title: "Maximum Product Subarray",
  pseudocodeLines: [
    "procedure maxProduct(arr):",
    "  maxProd = arr[0], minProd = arr[0], result = arr[0]",
    "  for i = 1 to n-1:",
    "    candidates = [arr[i], maxProd*arr[i], minProd*arr[i]]",
    "    maxProd = max(candidates), minProd = min(candidates)",
    "    result = max(result, maxProd)",
    "  return result"
  ],
  generateSteps,
  complexity: { time: 'O(n)', space: 'O(1)' }
});