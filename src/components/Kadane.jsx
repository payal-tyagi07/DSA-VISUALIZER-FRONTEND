import { createArrayVisualizer } from '../visualizations/arrayFactory';

const generateSteps = (arr) => {
  const steps = [];
  let maxSoFar = arr[0];
  let maxEndingHere = arr[0];
  let start = 0, end = 0, tempStart = 0;

  steps.push({
    array: arr,
    highlight: [0],
    description: `Start: maxSoFar = ${maxSoFar}, maxEndingHere = ${maxEndingHere}`,
    pseudocodeLine: 2
  });

  for (let i = 1; i < arr.length; i++) {
    if (maxEndingHere + arr[i] > arr[i]) {
      maxEndingHere = maxEndingHere + arr[i];
      // keep tempStart
    } else {
      maxEndingHere = arr[i];
      tempStart = i;
    }
    steps.push({
      array: arr,
      highlight: [i],
      description: `i=${i}, new maxEndingHere = ${maxEndingHere}`,
      pseudocodeLine: 4
    });
    if (maxEndingHere > maxSoFar) {
      maxSoFar = maxEndingHere;
      start = tempStart;
      end = i;
      steps.push({
        array: arr,
        highlight: Array.from({ length: end - start + 1 }, (_, k) => start + k),
        description: `New maxSoFar = ${maxSoFar} (subarray ${start}..${end})`,
        pseudocodeLine: 5
      });
    }
  }
  steps.push({
    array: arr,
    result: maxSoFar,
    description: `Maximum subarray sum = ${maxSoFar}`
  });
  return steps;
};

export default createArrayVisualizer({
  title: "Kadane's Algorithm (Maximum Subarray)",
  pseudocodeLines: [
    "procedure maxSubarray(arr):",
    "  maxSoFar = arr[0], maxEndingHere = arr[0]",
    "  for i = 1 to n-1:",
    "    maxEndingHere = max(arr[i], maxEndingHere + arr[i])",
    "    maxSoFar = max(maxSoFar, maxEndingHere)",
    "  return maxSoFar"
  ],
  generateSteps,
  complexity: { time: 'O(n)', space: 'O(1)' }
});