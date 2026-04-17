import { createStringVisualizer } from '../visualizations/stringFactory';

const generateSteps = (str) => {
  const steps = [];
  let left = 0, right = str.length - 1;
  let arr = str.split('');
  steps.push({ string: str, left, right, description: "Start", pseudocodeLine: 1 });
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    steps.push({ string: arr.join(''), left, right, highlight: [left, right], description: `Swap ${str[left]} and ${str[right]}`, pseudocodeLine: 3 });
    left++; right--;
    if (left < right) steps.push({ string: arr.join(''), left, right, description: `Move pointers: left=${left}, right=${right}`, pseudocodeLine: 2 });
  }
  steps.push({ string: arr.join(''), result: arr.join(''), description: `Reversed: ${arr.join('')}` });
  return steps;
};

export default createStringVisualizer({
  title: "Reverse a String",
  pseudocodeLines: [
    "procedure reverseString(s):",
    "  left = 0, right = len(s)-1",
    "  while left < right:",
    "    swap(s[left], s[right])",
    "    left++; right--",
    "  return s"
  ],
  generateSteps,
  complexity: { time: 'O(n)', space: 'O(1)' }
});