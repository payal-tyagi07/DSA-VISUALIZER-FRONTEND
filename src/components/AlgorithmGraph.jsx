// src/components/AlgorithmGraph.jsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import topics from '../data/a2zTopics';

const getAllAlgorithms = () => {
  const algorithms = [];
  for (const step of topics) {
    for (const subtopic of step.subtopics) {
      for (const problem of subtopic.problems) {
        algorithms.push({
          id: problem.id,
          name: problem.name,
          stepName: step.name,
          stepId: step.id,
          visualizable: problem.visualizable,
        });
      }
    }
  }
  return algorithms;
};

const buildGraphData = (algorithms) => {
  const nodes = algorithms.map(algo => ({
    id: algo.id,
    name: algo.name,
    stepName: algo.stepName,
    group: algo.stepId,
  }));

  const links = [];
  const stepGroups = new Map();
  algorithms.forEach(algo => {
    if (!stepGroups.has(algo.stepId)) stepGroups.set(algo.stepId, []);
    stepGroups.get(algo.stepId).push(algo.id);
  });
  for (const algoIds of stepGroups.values()) {
    for (let i = 0; i < algoIds.length; i++) {
      for (let j = i + 1; j < algoIds.length; j++) {
        links.push({ source: algoIds[i], target: algoIds[j] });
      }
    }
  }
  return { nodes, links };
};

const AlgorithmGraph = ({ onSelectAlgorithm }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const fgRef = useRef();

  const algorithms = useMemo(() => getAllAlgorithms(), []);

  useEffect(() => {
    const data = buildGraphData(algorithms);
    setGraphData(data);
  }, [algorithms]);

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth - 256,
        height: window.innerHeight,
      });
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Highlight logic
  const getHighlighted = () => {
    if (!searchQuery.trim()) return { nodes: new Set(), links: new Set() };
    const lowerQuery = searchQuery.toLowerCase();
    const matchedNodes = new Set();
    graphData.nodes.forEach(node => {
      if (node.name.toLowerCase().includes(lowerQuery)) matchedNodes.add(node.id);
    });
    const matchedLinks = new Set();
    graphData.links.forEach(link => {
      const source = typeof link.source === 'object' ? link.source.id : link.source;
      const target = typeof link.target === 'object' ? link.target.id : link.target;
      if (matchedNodes.has(source) || matchedNodes.has(target)) {
        matchedLinks.add(`${source}-${target}`);
      }
    });
    return { nodes: matchedNodes, links: matchedLinks };
  };

  const { nodes: highlightedNodes, links: highlightedLinks } = getHighlighted();

  if (graphData.nodes.length === 0 || dimensions.width === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#050510] to-[#0a0a2a]">
        <div className="text-white text-lg">Loading algorithm galaxy...</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gradient-to-br from-[#050510] to-[#0a0a2a] relative">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 w-96">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 Search algorithm... (e.g., bubble, binary)"
          className="w-full px-5 py-2 rounded-full bg-black/60 backdrop-blur-md text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
        />
        <p className="text-center text-xs text-gray-400 mt-2 font-mono">
          {highlightedNodes.size} algorithms connected
        </p>
      </div>

      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        nodeLabel="name"
        nodeColor={(node) => highlightedNodes.has(node.id) ? '#fbbf24' : '#1e3a8a'}
        nodeVal={(node) => highlightedNodes.has(node.id) ? 12 : 8}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const size = (node.val || 8) * (globalScale < 1 ? 1 : 0.8);
          ctx.beginPath();
          ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
          ctx.fillStyle = node.color;
          ctx.fill();
          ctx.shadowBlur = 10;
          ctx.shadowColor = highlightedNodes.has(node.id) ? '#fbbf24' : '#3b82f6';
          ctx.fillStyle = '#ffffff';
          ctx.font = `${Math.min(12, size * 1.2)}px 'Courier New', monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          let displayName = node.name;
          if (displayName.length > 12) displayName = displayName.slice(0, 10) + '..';
          ctx.fillText(displayName, node.x, node.y);
        }}
        linkColor={(link) => {
          const source = typeof link.source === 'object' ? link.source.id : link.source;
          const target = typeof link.target === 'object' ? link.target.id : link.target;
          const key = `${source}-${target}`;
          return highlightedLinks.has(key) ? '#fbbf24' : '#1e3a8a';
        }}
        linkWidth={(link) => {
          const source = typeof link.source === 'object' ? link.source.id : link.source;
          const target = typeof link.target === 'object' ? link.target.id : link.target;
          const key = `${source}-${target}`;
          return highlightedLinks.has(key) ? 3 : 1;
        }}
        linkDirectionalParticles={(link) => {
          const source = typeof link.source === 'object' ? link.source.id : link.source;
          const target = typeof link.target === 'object' ? link.target.id : link.target;
          const key = `${source}-${target}`;
          return highlightedLinks.has(key) ? 2 : 0;
        }}
        linkDirectionalParticleSpeed={0.005}
        onNodeClick={(node) => {
          const algorithm = algorithms.find(a => a.id === node.id);
          if (algorithm) onSelectAlgorithm(algorithm);
        }}
        cooldownTicks={100}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#0a0a2a"
      />
    </div>
  );
};

export default AlgorithmGraph;