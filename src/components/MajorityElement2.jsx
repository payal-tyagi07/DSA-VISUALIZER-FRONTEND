import { createArrayVisualizer } from '../visualizations/arrayFactory';

const generateSteps = (arr) => {
  const steps = [];
  let candidate1 = null, candidate2 = null;
  let count1 = 0, count2 = 0;
  steps.push({ array: arr, description: "Find elements appearing > n/3 times", pseudocodeLine: 1 });

  for (let i = 0; i < arr.length; i++) {
    const x = arr[i];
    if (candidate1 !== null && candidate1 === x) count1++;
    else if (candidate2 !== null && candidate2 === x) count2++;
    else if (count1 === 0) { candidate1 = x; count1 = 1; }
    else if (count2 === 0) { candidate2 = x; count2 = 1; }
    else { count1--; count2--; }
    steps.push({ array: arr, highlight: [i], description: `x=${x}, cand1=${candidate1}(${count1}), cand2=${candidate2}(${count2})`, pseudocodeLine: 3 });
  }

  // Verification
  let freq1 = 0, freq2 = 0;
  for (let x of arr) {
    if (x === candidate1) freq1++;
    else if (x === candidate2) freq2++;
  }
  const result = [];
  if (freq1 > arr.length/3) result.push(candidate1);
  if (freq2 > arr.length/3) result.push(candidate2);
  steps.push({ array: arr, result, description: `Majority elements: ${result.join(',')}` });
  return steps;
};

export default createArrayVisualizer({
  title: "Majority Element II (n/3 times)",
  pseudocodeLines: [
    "procedure majorityElement(arr):",
    "  candidate1 = null, candidate2 = null",
    "  count1 = 0, count2 = 0",
    "  for x in arr:",
    "    update candidates using Boyer-Moore",
    "  verify counts",
    "  return candidates with count > n/3"
  ],
  generateSteps,
  complexity: { time: 'O(n)', space: 'O(1)' }
});