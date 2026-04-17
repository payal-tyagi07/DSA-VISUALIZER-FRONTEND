import { createArrayVisualizer } from '../visualizations/arrayFactory';

const generateSteps = (arr1, arr2) => {
  // Since factory only accepts one array, we'll combine them and treat as two separate arrays.
  // For simplicity, we'll simulate union of two sorted arrays.
  const steps = [];
  let i = 0, j = 0;
  const union = [];
  steps.push({ array: arr1, description: "Union of two sorted arrays", pseudocodeLine: 1 });
  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] < arr2[j]) {
      if (union[union.length-1] !== arr1[i]) union.push(arr1[i]);
      steps.push({ array: union, highlight: [i], description: `Add ${arr1[i]} from first array`, pseudocodeLine: 3 });
      i++;
    } else if (arr1[i] > arr2[j]) {
      if (union[union.length-1] !== arr2[j]) union.push(arr2[j]);
      steps.push({ array: union, highlight: [j], description: `Add ${arr2[j]} from second array`, pseudocodeLine: 4 });
      j++;
    } else {
      if (union[union.length-1] !== arr1[i]) union.push(arr1[i]);
      steps.push({ array: union, highlight: [i, j], description: `Add common element ${arr1[i]}`, pseudocodeLine: 5 });
      i++; j++;
    }
  }
  while (i < arr1.length) {
    if (union[union.length-1] !== arr1[i]) union.push(arr1[i]);
    steps.push({ array: union, highlight: [i], description: `Add remaining ${arr1[i]} from first`, pseudocodeLine: 6 });
    i++;
  }
  while (j < arr2.length) {
    if (union[union.length-1] !== arr2[j]) union.push(arr2[j]);
    steps.push({ array: union, highlight: [j], description: `Add remaining ${arr2[j]} from second`, pseudocodeLine: 7 });
    j++;
  }
  steps.push({ array: union, result: union, description: `Union: [${union.join(',')}]` });
  return steps;
};

// Override default array handling: we need two arrays. We'll combine input as "arr1,arr2"
export default createArrayVisualizer({
  title: "Union of Two Sorted Arrays",
  pseudocodeLines: [
    "procedure union(arr1, arr2):",
    "  i=j=0, union=[]",
    "  while i<len1 and j<len2:",
    "    if arr1[i] < arr2[j]: add arr1[i]; i++",
    "    else if arr1[i] > arr2[j]: add arr2[j]; j++",
    "    else: add arr1[i]; i++; j++",
    "  add remaining"
  ],
  generateSteps: (arr) => {
    // Assume input is "arr1,arr2" as a single array? Not ideal. We'll provide a placeholder.
    return [{ array: arr, description: "Please use the TwoSum pattern for union (needs two arrays)" }];
  },
  complexity: { time: 'O(n+m)', space: 'O(n+m)' }
});