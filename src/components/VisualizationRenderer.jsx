// src/components/VisualizationRenderer.jsx
import React from 'react';

// ---------- Sorting ----------
import BubbleSortEnhanced from './BubbleSortEnhanced';
import SelectionSort from './SelectionSort';
import InsertionSort from './InsertionSort';
import MergeSort from './MergeSort';
import QuickSort from './QuickSort';

// ---------- Array ----------
import LargestElement from './LargestElement';
import SecondLargest from './SecondLargest';
import ArraySorted from './ArraySorted';
import RemoveDuplicates from './RemoveDuplicates';
import LeftRotateOne from './LeftRotateOne';
import LeftRotateD from './LeftRotateD';
import MoveZeros from './MoveZeros';
import LinearSearch from './LinearSearch';
import Union from './Union';
import MissingNumber from './MissingNumber';
import MaxConsecutiveOnes from './MaxConsecutiveOnes';
import NumberAppearingOnce from './NumberAppearingOnce';
import LongestSubarraySumK from './LongestSubarraySumK';
import TwoSum from './TwoSum';
import Sort012 from './Sort012';
import MajorityElement from './MajorityElement';
import Kadane from './Kadane';
import StockBuySell from './StockBuySell';
import NextPermutation from './NextPermutation';
import SetMatrixZeroes from './SetMatrixZeroes';
import RotateMatrix from './RotateMatrix';
import SpiralMatrix from './SpiralMatrix';
import PascalTriangle from './PascalTriangle';
import MajorityElement2 from './MajorityElement2';
import ThreeSum from './ThreeSum';
import FourSum from './FourSum';
import LargestSubarrayZero from './LargestSubarrayZero';
import MergeOverlapping from './MergeOverlapping';
import MergeTwoSortedArrays from './MergeTwoSortedArrays';
import FindRepeatingMissing from './FindRepeatingMissing';
import CountInversions from './CountInversions';
import ReversePairs from './ReversePairs';
import MaxProductSubarray from './MaxProductSubarray';

// ---------- Binary Search (1D) ----------
import BinarySearch from './BinarySearch';
import LowerBoundSearch from './LowerBoundSearch';
import UpperBoundSearch from './UpperBoundSearch';
import FirstLastOccurrence from './FirstLastOccurrence';
import SearchRotated from './SearchRotated';
import FindMinRotated from './FindMinRotated';
import SingleElementSorted from './SingleElementSorted';
import PeakElement from './PeakElement';

// ---------- Binary Search (2D) ----------
import Search2DMatrix from './Search2DMatrix';
import PeakElement2D from './PeakElement2D';
import MatrixMedian from './MatrixMedian';

// ---------- Binary Search (Answer Concept) ----------
import SquareRoot from './SquareRoot';
import KokoBananas from './KokoBananas';
import ShipCapacity from './ShipCapacity';
import KthMissing from './KthMissing';
import AggressiveCows from './AggressiveCows';
import BookAllocation from './BookAllocation';
import SplitArrayLargestSum from './SplitArrayLargestSum';
import GasStations from './GasStations';
import Bouquets from './Bouquets';
import MedianTwoArrays from './MedianTwoArrays';
import KthTwoArrays from './KthTwoArrays';

// ---------- Strings (Easy) ----------
import ReverseString from './ReverseString';
import Palindrome from './Palindrome';
import ValidAnagram from './ValidAnagram';
import FirstUniqueChar from './FirstUniqueChar';

// ---------- Strings (Medium) ----------
import LongestSubstring from './LongestSubstring';
import GroupAnagrams from './GroupAnagrams';
import LongestPalindromicSubstring from './LongestPalindromicSubstring';
import StringToInteger from './StringToInteger';
import RomanToInteger from './RomanToInteger';

// ---------- Strings (Hard) ----------
import MinWindowSubstring from './MinWindowSubstring';
import ValidNumber from './ValidNumber';
import RegexMatching from './RegexMatching';

// ---------- Linked List ----------
import ReverseLinkedList from './ReverseLinkedList';
import MiddleOfLinkedList from './MiddleOfLinkedList';
import DetectCycle from './DetectCycle';
import FindCycleStart from './FindCycleStart';
import RemoveNthFromEnd from './RemoveNthFromEnd';
import MergeTwoSortedLists from './MergeTwoSortedLists';
import AddTwoNumbers from './AddTwoNumbers';
import ReverseDoublyLinkedList from './ReverseDoublyLinkedList';
import ReverseNodesInKGroup from './ReverseNodesInKGroup';
import CopyListWithRandomPointer from './CopyListWithRandomPointer';
import FlattenMultilevelList from './FlattenMultilevelList';

// ---------- Recursion ----------
import Factorial from './recursion/Factorial';
import Fibonacci from './recursion/Fibonacci';
import Power from './recursion/Power';
import Subsets from './recursion/Subsets';
import SubsetsII from './recursion/SubsetsII';
import Permutations from './recursion/Permutations';
import CombinationSum from './recursion/CombinationSum';
import CombinationSumII from './recursion/CombinationSumII';
import PalindromePartitioning from './recursion/PalindromePartitioning';
import NQueens from './recursion/NQueens';
import SudokuSolver from './recursion/SudokuSolver';
import RatInMaze from './recursion/RatInMaze';

// ---------- Bit Manipulation ----------
import BitwiseOperations from './BitwiseOperations';
import CountSetBits from './CountSetBits';
import PowerOfTwo from './PowerOfTwo';
import SingleNumberXOR from './SingleNumberXOR';
import MissingNumberXOR from './MissingNumberXOR';
import DivideTwoIntegers from './DivideTwoIntegers';
import BitwiseAndRange from './BitwiseAndRange';
import SubsetsBitmask from './SubsetsBitmask';

// ---------- Stack and Queue ----------
import ValidParentheses from './ValidParentheses';
import MinStack from './MinStack';
import NextGreaterElement from './NextGreaterElement';
import LargestRectangleInHistogram from './LargestRectangleInHistogram';
import SlidingWindowMaximum from './SlidingWindowMaximum';
import DailyTemperatures from './DailyTemperatures';
import StackUsingArray from './StackUsingArray';
import QueueUsingArray from './QueueUsingArray';
import StackUsingQueues from './StackUsingQueues';
import QueueUsingStacks from './QueueUsingStacks';

// ---------- Sliding Window & Two Pointers ----------
import MaxSumSubarrayK from './MaxSumSubarrayK';
import LongestSubstringKDistinct from './LongestSubstringKDistinct';
import FruitIntoBaskets from './FruitIntoBaskets';
import MinimumSizeSubarraySum from './MinimumSizeSubarraySum';
import TwoSumSorted from './TwoSumSorted';
import RemoveDuplicatesSorted from './RemoveDuplicatesSorted';
import ContainerWithMostWater from './ContainerWithMostWater';
import TrappingRainWater from './TrappingRainWater';

// ---------- Heap ----------
import MaxHeap from './MaxHeap';
import MinHeap from './MinHeap';
import KthLargestElement from './KthLargestElement';
import KthSmallestElement from './KthSmallestElement';
import TopKFrequentElements from './TopKFrequentElements';
import MergeKSortedLists from './MergeKSortedLists';
import MedianFinder from './MedianFinder';
import TaskScheduler from './TaskScheduler';

// ---------- Greedy ----------
import ActivitySelection from './ActivitySelection';
import NMeetingsInRoom from './NMeetingsInRoom';
import MinimumPlatforms from './MinimumPlatforms';
import JobSequencing from './JobSequencing';
import CoinChangeGreedy from './CoinChangeGreedy';
import HuffmanCoding from './HuffmanCoding';
import FractionalKnapsack from './FractionalKnapsack';
import PrimsAlgorithm from './PrimsAlgorithm';
import KruskalsAlgorithm from './KruskalsAlgorithm';
import DijkstraAlgorithm from './DijkstraAlgorithm';
import FordFulkerson from './FordFulkerson';

// ---------- Tree ----------
import InorderTraversal from './InorderTraversal';
import PreorderTraversal from './PreorderTraversal';
import PostorderTraversal from './PostorderTraversal';
import LevelOrderTraversal from './LevelOrderTraversal';
import MaxDepth from './MaxDepth';
import BalancedBinaryTree from './BalancedBinaryTree';
import DiameterOfBinaryTree from './DiameterOfBinaryTree';
import SameTree from './SameTree';
import InvertBinaryTree from './InvertBinaryTree';
import LowestCommonAncestor from './LowestCommonAncestor';
import BinaryTreeMaxPathSum from './BinaryTreeMaxPathSum';
import ConstructFromInorderPreorder from './ConstructFromInorderPreorder';
import ValidateBST from './ValidateBST';
import KthSmallestInBST from './KthSmallestInBST';

// ---------- Graph ----------
import BFS from './BFS';
import DFS from './DFS';
import CycleDetectionUndirected from './CycleDetectionUndirected';
import CycleDetectionDirected from './CycleDetectionDirected';
import TopologicalSort from './TopologicalSort';
import BellmanFord from './BellmanFord';
import FloydWarshall from './FloydWarshall';
import DisjointSet from './DisjointSet';
import Kosaraju from './Kosaraju';
import BridgesInGraph from './BridgesInGraph';
import ArticulationPoint from './ArticulationPoint';

// ---------- DP ----------
import ClimbingStairsDP from './ClimbingStairs';
import UniquePaths from './UniquePaths';
import LongestCommonSubsequence from './LongestCommonSubsequence';
import Knapsack from './Knapsack';
import CoinChange from './CoinChange';
import HouseRobber from './HouseRobber';
import MaxSubarray from './MaxSubarray';
import DecodeWays from './DecodeWays';
import UniquePathsObstacles from './UniquePathsObstacles';
import MinimumPathSum from './MinimumPathSum';
import CoinChangeII from './CoinChangeII';
import PartitionEqualSubsetSum from './PartitionEqualSubsetSum';
import WordBreak from './WordBreak';
import LIS from './LIS';
import MatrixChainMultiplication from './MatrixChainMultiplication';
import NumberOfLIS from './NumberOfLIS';
import RussianDollEnvelopes from './RussianDollEnvelopes';
import BurstBalloons from './BurstBalloons';
import PalindromicSubstrings from './PalindromicSubstrings';

// ---------- Component Map ----------
const componentMap = {
  // Sorting
  'bubble-sort': BubbleSortEnhanced,
  'selection-sort': SelectionSort,
  'insertion-sort': InsertionSort,
  'merge-sort': MergeSort,
  'quick-sort': QuickSort,

  // Array
  'largest-element': LargestElement,
  'second-largest': SecondLargest,
  'array-sorted': ArraySorted,
  'remove-duplicates': RemoveDuplicates,
  'left-rotate-one': LeftRotateOne,
  'left-rotate-d': LeftRotateD,
  'move-zeros': MoveZeros,
  'linear-search': LinearSearch,
  'union': Union,
  'missing-number': MissingNumber,
  'max-consecutive-ones': MaxConsecutiveOnes,
  'number-appearing-once': NumberAppearingOnce,
  'longest-subarray-sum-k': LongestSubarraySumK,
  '2sum': TwoSum,
  'sort-012': Sort012,
  'majority-element': MajorityElement,
  'kadane': Kadane,
  'stock-buy-sell': StockBuySell,
  'next-permutation': NextPermutation,
  'set-matrix-zeroes': SetMatrixZeroes,
  'rotate-matrix': RotateMatrix,
  'spiral-matrix': SpiralMatrix,
  'pascal-triangle': PascalTriangle,
  'majority-element-2': MajorityElement2,
  '3sum': ThreeSum,
  '4sum': FourSum,
  'largest-subarray-zero': LargestSubarrayZero,
  'merge-overlapping': MergeOverlapping,
  'merge-sorted-arrays': MergeTwoSortedArrays,
  'find-repeating-missing': FindRepeatingMissing,
  'count-inversions': CountInversions,
  'reverse-pairs': ReversePairs,
  'max-product-subarray': MaxProductSubarray,

  // Binary Search (1D)
  'binary-search': BinarySearch,
  'lower-bound': LowerBoundSearch,
  'upper-bound': UpperBoundSearch,
  'first-last-occurrence': FirstLastOccurrence,
  'search-rotated': SearchRotated,
  'find-min-rotated': FindMinRotated,
  'single-element': SingleElementSorted,
  'peak-element': PeakElement,

  // Binary Search (2D)
  'search-2d-matrix': Search2DMatrix,
  'peak-element-2d': PeakElement2D,
  'matrix-median': MatrixMedian,

  // Binary Search (Answer Concept)
  'sqrt': SquareRoot,
  'koko-eating-bananas': KokoBananas,
  'ship-capacity': ShipCapacity,
  'kth-missing': KthMissing,
  'aggressive-cows': AggressiveCows,
  'book-allocation': BookAllocation,
  'split-array': SplitArrayLargestSum,
  'gas-stations': GasStations,
  'minimum-days-bouquets': Bouquets,
  'median-two-arrays': MedianTwoArrays,
  'kth-two-arrays': KthTwoArrays,

  // Strings (Easy)
  'reverse-string': ReverseString,
  'palindrome-string': Palindrome,
  'valid-anagram': ValidAnagram,
  'first-unique-char': FirstUniqueChar,

  // Strings (Medium)
  'longest-substring': LongestSubstring,
  'group-anagrams': GroupAnagrams,
  'longest-palindromic-substring': LongestPalindromicSubstring,
  'string-to-integer': StringToInteger,
  'roman-to-integer': RomanToInteger,

  // Strings (Hard)
  'minimum-window-substring': MinWindowSubstring,
  'valid-number': ValidNumber,
  'regular-expression-matching': RegexMatching,

  // Linked List
  'reverse-linked-list': ReverseLinkedList,
  'middle-of-linked-list': MiddleOfLinkedList,
  'detect-cycle': DetectCycle,
  'cycle-start': FindCycleStart,
  'remove-nth-from-end': RemoveNthFromEnd,
  'merge-two-sorted-lists': MergeTwoSortedLists,
  'add-two-numbers': AddTwoNumbers,
  'reverse-dll': ReverseDoublyLinkedList,
  'reverse-k-group': ReverseNodesInKGroup,
  'copy-random-list': CopyListWithRandomPointer,
  'flatten-multilevel-list': FlattenMultilevelList,

  // Recursion 
'factorial': Factorial,
'fibonacci': Fibonacci,
'power': Power,
'subsets': Subsets,
'subsets-ii': SubsetsII,
'permutations': Permutations,
'combination-sum': CombinationSum,
'combination-sum-ii': CombinationSumII,
'palindrome-partitioning': PalindromePartitioning,
'n-queens': NQueens,
'sudoku-solver': SudokuSolver,
'rat-in-maze': RatInMaze,

  // Bit Manipulation
  'bitwise-operations': BitwiseOperations,
  'count-set-bits': CountSetBits,
  'power-of-two': PowerOfTwo,
  'single-number': SingleNumberXOR,
  'missing-number': MissingNumberXOR,
  'divide-two-integers': DivideTwoIntegers,
  'bitwise-and-range': BitwiseAndRange,
  'subsets-bitmask': SubsetsBitmask,

  // Stack and Queue
  'valid-parentheses': ValidParentheses,
  'min-stack': MinStack,
  'next-greater-element': NextGreaterElement,
  'largest-rectangle-histogram': LargestRectangleInHistogram,
  'sliding-window-maximum': SlidingWindowMaximum,
  'daily-temperatures': DailyTemperatures,
  'stack-using-array': StackUsingArray,
  'queue-using-array': QueueUsingArray,
  'stack-using-queues': StackUsingQueues,
  'queue-using-stacks': QueueUsingStacks,

  // Sliding Window & Two Pointers
  'max-sum-subarray-k': MaxSumSubarrayK,
  'longest-substring-k-distinct': LongestSubstringKDistinct,
  'fruit-into-baskets': FruitIntoBaskets,
  'minimum-size-subarray-sum': MinimumSizeSubarraySum,
  'two-sum-sorted': TwoSumSorted,
  'remove-duplicates-sorted': RemoveDuplicatesSorted,
  'container-with-most-water': ContainerWithMostWater,
  'trapping-rain-water': TrappingRainWater,

  // Heap
  'max-heap': MaxHeap,
  'min-heap': MinHeap,
  'kth-largest': KthLargestElement,
  'kth-smallest': KthSmallestElement,
  'top-k-frequent': TopKFrequentElements,
  'merge-k-sorted-lists': MergeKSortedLists,
  'median-finder': MedianFinder,
  'task-scheduler': TaskScheduler,

  // Greedy
  'activity-selection': ActivitySelection,
  'n-meetings-in-room': NMeetingsInRoom,
  'minimum-platforms': MinimumPlatforms,
  'job-sequencing': JobSequencing,
  'coin-change-greedy': CoinChangeGreedy,
  'fractional-knapsack': FractionalKnapsack,
  'huffman-coding': HuffmanCoding,
  'prims-algorithm': PrimsAlgorithm,
  'kruskals-algorithm': KruskalsAlgorithm,
  'dijkstra-algorithm': DijkstraAlgorithm,
  'ford-fulkerson': FordFulkerson,

  // Tree
  'inorder-traversal': InorderTraversal,
  'preorder-traversal': PreorderTraversal,
  'postorder-traversal': PostorderTraversal,
  'level-order-traversal': LevelOrderTraversal,
  'max-depth': MaxDepth,
  'balanced-tree': BalancedBinaryTree,
  'diameter': DiameterOfBinaryTree,
  'same-tree': SameTree,
  'invert-tree': InvertBinaryTree,
  'lca': LowestCommonAncestor,
  'max-path-sum': BinaryTreeMaxPathSum,
  'construct-from-inorder-preorder': ConstructFromInorderPreorder,
  'validate-bst': ValidateBST,
  'kth-smallest-bst': KthSmallestInBST,

  // Graph
  'bfs': BFS,
  'dfs': DFS,
  'cycle-detection-undirected': CycleDetectionUndirected,
  'cycle-detection-directed': CycleDetectionDirected,
  'topological-sort': TopologicalSort,
  'dijkstra': DijkstraAlgorithm,
  'bellman-ford': BellmanFord,
  'floyd-warshall': FloydWarshall,
  'prims': PrimsAlgorithm,
  'kruskals': KruskalsAlgorithm,
  'disjoint-set': DisjointSet,
  'kosaraju': Kosaraju,
  'bridges': BridgesInGraph,
  'articulation-point': ArticulationPoint,

  // DP
  'climbing-stairs': ClimbingStairsDP,
  'unique-paths': UniquePaths,
  'longest-common-subsequence': LongestCommonSubsequence,
  'knapsack': Knapsack,
  'coin-change': CoinChange,
  'house-robber': HouseRobber,
  'max-subarray': MaxSubarray,
  'decode-ways': DecodeWays,
  'unique-paths-obstacles': UniquePathsObstacles,
  'minimum-path-sum': MinimumPathSum,
  'coin-change-ii': CoinChangeII,
  'partition-equal-subset': PartitionEqualSubsetSum,
  'word-break': WordBreak,
  'lis': LIS,
  'matrix-chain-multiplication': MatrixChainMultiplication,
  'number-of-lis': NumberOfLIS,
  'russian-doll': RussianDollEnvelopes,
  'burst-balloons': BurstBalloons,
  'palindromic-substrings': PalindromicSubstrings,
};

const VisualizationRenderer = ({ algorithm }) => {
  const Component = componentMap[algorithm.id];

  if (!Component) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-8 bg-[#0a0a0a] border border-[#222222] rounded-xl shadow-2xl">
          <h3 className="text-xl font-bold text-[#569cd6] mb-2">{algorithm.name}</h3>
          <p className="text-gray-400 mb-4">Visualization coming soon!</p>
          <div className="bg-[#2d2d2d] border-l-4 border-yellow-500 p-4 rounded">
            <p className="text-sm text-yellow-500">
              This algorithm is in our roadmap. Check back soon!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Component />
    </div>
  );
};

export default VisualizationRenderer;