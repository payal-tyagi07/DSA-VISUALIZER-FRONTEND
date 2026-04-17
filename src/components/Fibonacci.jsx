import { createArrayVisualizer } from '../visualizations/arrayFactory'; // reusing array factory for DP table

const generateSteps = (n) => {
  const steps = [];
  const dp = new Array(n + 1).fill(-1);
  dp[0] = 0;
  if (n >= 1) dp[1] = 1;
  steps.push({ array: dp, description: `Initial DP table for n=${n}`, pseudocodeLine: 1 });

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i-1] + dp[i-2];
    steps.push({
      array: [...dp],
      highlight: [i],
      description: `dp[${i}] = dp[${i-1}] + dp[${i-2}] = ${dp[i-1]} + ${dp[i-2]} = ${dp[i]}`,
      pseudocodeLine: 3
    });
  }
  steps.push({ array: dp, result: dp[n], description: `Fibonacci(${n}) = ${dp[n]}` });
  return steps;
};

export default createArrayVisualizer({
  title: "Fibonacci (Dynamic Programming)",
  pseudocodeLines: [
    "procedure fib(n):",
    "  if n <= 1: return n",
    "  dp[0]=0, dp[1]=1",
    "  for i=2 to n: dp[i] = dp[i-1] + dp[i-2]",
    "  return dp[n]"
  ],
  generateSteps: (arr) => generateSteps(arr[0]), // expects array [n]
  defaultArray: [5],
  complexity: { time: 'O(n)', space: 'O(n)' }
});