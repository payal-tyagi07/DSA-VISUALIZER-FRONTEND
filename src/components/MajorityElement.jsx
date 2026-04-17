import { createArrayVisualizer } from '../visualizations/arrayFactory';

const generateSteps = (arr) => {
  const steps = [];
  let candidate = null;
  let count = 0;

  steps.push({ array: arr, description: "Start candidate = null, count = 0", pseudocodeLine: 1 });

  for (let i = 0; i < arr.length; i++) {
    if (count === 0) {
      candidate = arr[i];
      count = 1;
      steps.push({
        array: arr,
        highlight: [i],
        description: `count == 0 → candidate = ${candidate}, count = 1`,
        pseudocodeLine: 3
      });
    } else if (arr[i] === candidate) {
      count++;
      steps.push({
        array: arr,
        highlight: [i],
        description: `${arr[i]} == candidate → count = ${count}`,
        pseudocodeLine: 4
      });
    } else {
      count--;
      steps.push({
        array: arr,
        highlight: [i],
        description: `${arr[i]} != candidate → count = ${count}`,
        pseudocodeLine: 5
      });
    }
  }

  // verification step (optional)
  let freq = 0;
  for (let v of arr) if (v === candidate) freq++;
  const isMajority = freq > arr.length / 2;
  steps.push({
    array: arr,
    result: isMajority ? candidate : -1,
    description: isMajority ? `Majority element = ${candidate}` : "No majority element"
  });
  return steps;
};

export default createArrayVisualizer({
  title: "Majority Element (Moore's Voting)",
  pseudocodeLines: [
    "procedure majorityElement(arr):",
    "  candidate = null, count = 0",
    "  for each x in arr:",
    "    if count == 0: candidate = x; count = 1",
    "    else if x == candidate: count++",
    "    else: count--",
    "  // verify candidate appears > n/2 times",
    "  return candidate if verified else -1"
  ],
  generateSteps,
  complexity: { time: 'O(n)', space: 'O(1)' }
});