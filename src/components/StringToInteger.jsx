import { createStringVisualizer } from '../visualizations/stringFactory';

const generateSteps = (str) => {
  const steps = [];
  let i = 0, sign = 1, result = 0;
  const n = str.length;
  steps.push({ string: str, description: "Convert string to integer", pseudocodeLine: 1 });
  while (i < n && str[i] === ' ') i++;
  if (i < n && (str[i] === '-' || str[i] === '+')) {
    sign = str[i] === '-' ? -1 : 1;
    steps.push({ string: str, highlight: [i], description: `Sign = ${sign}`, pseudocodeLine: 2 });
    i++;
  }
  while (i < n && str[i] >= '0' && str[i] <= '9') {
    const digit = str[i].charCodeAt(0) - '0'.charCodeAt(0);
    if (result > Math.floor(2147483647/10) || (result === 2147483647/10 && digit > 7)) {
      result = sign === 1 ? 2147483647 : -2147483648;
      steps.push({ string: str, highlight: [i], description: `Overflow → clamped`, pseudocodeLine: 4 });
      break;
    }
    result = result * 10 + digit;
    steps.push({ string: str, highlight: [i], description: `digit ${digit} → current result = ${result}`, pseudocodeLine: 3 });
    i++;
  }
  const final = sign * result;
  steps.push({ string: str, result: final, description: `Final integer = ${final}` });
  return steps;
};

export default createStringVisualizer({
  title: "String to Integer (atoi)",
  pseudocodeLines: [
    "procedure myAtoi(s):",
    "  i=0, sign=1, result=0",
    "  skip spaces",
    "  handle sign",
    "  while digit:",
    "    if overflow: clamp",
    "    result = result*10 + digit",
    "  return sign*result"
  ],
  generateSteps,
  complexity: { time: 'O(n)', space: 'O(1)' }
});