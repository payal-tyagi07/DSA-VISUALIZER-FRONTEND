import { createStringVisualizer } from '../visualizations/stringFactory';

const generateSteps = (str) => {
  const steps = [];
  let left = 0, right = str.length - 1;
  steps.push({ string: str, left, right, description: "Check if palindrome", pseudocodeLine: 1 });
  while (left < right) {
    if (str[left] !== str[right]) {
      steps.push({ string: str, left, right, highlight: [left, right], description: `'${str[left]}' ≠ '${str[right]}' → not palindrome`, pseudocodeLine: 4 });
      steps.push({ string: str, result: false, description: "Not a palindrome" });
      return steps;
    }
    steps.push({ string: str, left, right, highlight: [left, right], description: `'${str[left]}' == '${str[right]}' → ok`, pseudocodeLine: 3 });
    left++; right--;
    if (left < right) steps.push({ string: str, left, right, description: `Move pointers: left=${left}, right=${right}`, pseudocodeLine: 2 });
  }
  steps.push({ string: str, result: true, description: "String is a palindrome" });
  return steps;
};

export default createStringVisualizer({
  title: "Check Palindrome",
  pseudocodeLines: [
    "procedure isPalindrome(s):",
    "  left = 0, right = len(s)-1",
    "  while left < right:",
    "    if s[left] != s[right]: return false",
    "    left++; right--",
    "  return true"
  ],
  generateSteps,
  complexity: { time: 'O(n)', space: 'O(1)' }
});