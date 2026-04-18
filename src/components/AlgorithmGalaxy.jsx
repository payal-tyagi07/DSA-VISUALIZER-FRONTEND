// src/components/AlgorithmGalaxy.jsx
import React, { useState, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';
import topics from '../data/a2zTopics';

// ---- Helper functions ----
const getAllAlgorithms = () => {
  const algorithms = [];
  for (const step of topics) {
    for (const subtopic of step.subtopics) {
      for (const problem of subtopic.problems) {
        algorithms.push({
          id: problem.id,
          name: problem.name,
          stepName: step.name,
          visualizable: problem.visualizable,
        });
      }
    }
  }
  return algorithms;
};

const getCategories = () => {
  return topics.map(step => ({
    id: step.id,
    name: step.name,
  }));
};

// Fixed bright colors (matching pic1)
const categoryColors = {
  'Sorting Techniques': '#FF6B6B',          // coral
  'Arrays': '#4ECDC4',                     // turquoise
  'Binary Search': '#45B7D1',              // sky blue
  'Strings': '#F9CA24',                    // golden
  'Linked List': '#E056FD',                // purple
  'Recursion': '#FF9F43',                  // orange
  'Bit Manipulation': '#10AC84',           // mint
  'Stack and Queues': '#EE5A24',           // bright orange
  'Sliding Window & Two Pointers': '#FDA7DF', // pink
  'Heaps': '#6AB04C',                      // lime green
  'Greedy Algorithms': '#F0932B',          // amber
  'Binary Trees': '#7ED6DF',               // light blue
  'Graphs': '#686DE0',                     // indigo
  'Dynamic Programming': '#EB4D4B'         // red
};

const getCategoryColor = (stepName) => {
  let shortName = stepName;
  if (stepName.includes(':')) {
    shortName = stepName.split(':')[1].trim();
  }
  const fullNameMap = {
    'Sorting Techniques': 'Sorting Techniques',
    'Arrays': 'Arrays',
    'Binary Search': 'Binary Search',
    'Strings': 'Strings',
    'Linked List': 'Linked List',
    'Recursion': 'Recursion',
    'Bit Manipulation': 'Bit Manipulation',
    'Stack and Queues': 'Stack and Queues',
    'Sliding Window & Two Pointers': 'Sliding Window & Two Pointers',
    'Heaps': 'Heaps',
    'Greedy Algorithms': 'Greedy Algorithms',
    'Binary Trees': 'Binary Trees',
    'Graphs': 'Graphs',
    'Dynamic Programming': 'Dynamic Programming'
  };
  const key = fullNameMap[shortName] || shortName;
  return categoryColors[key] || '#AA8ECC';
};

// Color cache (no random anymore, just category-based)
const colorCache = new Map();
const getPlanetColor = (id, stepName) => {
  const key = `${id}-${stepName}`;
  if (!colorCache.has(key)) {
    colorCache.set(key, getCategoryColor(stepName));
  }
  return colorCache.get(key);
};

// Texture generation (unchanged)
const createPlanetTexture = (baseColor) => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const spotCount = 300;
  for (let i = 0; i < spotCount; i++) {
    const radius = 3 + Math.random() * 15;
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const isDark = Math.random() > 0.5;
    const spotColor = isDark ? '#222' : '#fff';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = spotColor;
    ctx.globalAlpha = 0.2 + Math.random() * 0.3;
    ctx.fill();
  }
  for (let i = 0; i < 30; i++) {
    const radius = 10 + Math.random() * 30;
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#333';
    ctx.globalAlpha = 0.4;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x - 3, y - 3, radius * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = '#ccc';
    ctx.globalAlpha = 0.3;
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

const textureCache = new Map();

const Planet = ({ label, color, position, orbitRadius, speed, onClick, isVisible }) => {
  const meshRef = useRef();
  const angleRef = useRef(Math.random() * Math.PI * 2);
  const [hovered, setHovered] = useState(false);
  const labelRef = useRef();
  const texture = useMemo(() => {
    if (!textureCache.has(color)) {
      textureCache.set(color, createPlanetTexture(color));
    }
    return textureCache.get(color);
  }, [color]);

  useFrame(() => {
    if (!isVisible) return;
    angleRef.current += speed;
    const x = Math.cos(angleRef.current) * orbitRadius;
    const z = Math.sin(angleRef.current) * orbitRadius;
    meshRef.current.position.set(x, position[1], z);
    if (labelRef.current) {
      labelRef.current.position.set(x, position[1] + 0.7, z);
    }
  });

  if (!isVisible) return null;
  const size = 0.55;
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, position[1], 0]}>
        <ringGeometry args={[orbitRadius - 0.05, orbitRadius + 0.05, 64]} />
        <meshStandardMaterial color="#aaa" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
      <mesh
        ref={meshRef}
        position={[orbitRadius, position[1], 0]}
        onClick={() => onClick(label)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
      >
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.3 : 0.1}
          metalness={0.1}
          roughness={0.6}
        />
      </mesh>
      <Text
        ref={labelRef}
        position={[orbitRadius, position[1] + 0.7, 0]}
        fontSize={0.22}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {label.length > 18 ? label.slice(0, 15) + '..' : label}
      </Text>
    </group>
  );
};

const DarkStar = ({ isSearchActive }) => {
  const starRef = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    starRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.05);
  });
  return (
    <group>
      <pointLight position={[0, 0, 0]} intensity={isSearchActive ? 1.2 : 0.8} color="#ffaa66" />
      <mesh ref={starRef}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshStandardMaterial color="#2a1a0a" emissive="#aa7744" emissiveIntensity={isSearchActive ? 0.6 : 0.3} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh scale={[1.5, 1.5, 1.5]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial color="#ffaa66" transparent opacity={0.2} emissive="#ffaa66" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
};

const CameraController = () => {
  const { camera } = useThree();
  useFrame(() => camera.lookAt(0, 0, 0));
  return null;
};

const AlgorithmGalaxy = ({ onSelectAlgorithm }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const algorithms = useMemo(() => getAllAlgorithms(), []);
  const categories = useMemo(() => getCategories(), []);

  const isSearching = searchQuery.trim().length > 0;
  let visibleItems = [];

  if (isSearching) {
    const matched = algorithms.filter(algo =>
      algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      algo.stepName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    visibleItems = matched.map(algo => ({
      id: algo.id,
      label: algo.name,
      color: getPlanetColor(algo.id, algo.stepName),
      algorithm: algo,
    }));
  } else {
    visibleItems = categories.map(cat => ({
      id: cat.id,
      label: cat.name.replace(/Step \d+:\s*/, ''),
      color: getPlanetColor(cat.id, cat.name),
      algorithm: null,
    }));
  }

  const planets = useMemo(() => {
    return visibleItems.map((item, idx) => {
      const orbitRadius = 3 + (idx % 6) * 1.2;
      const speed = 0.005 + (idx % 4) * 0.002;
      const yOffset = (Math.floor(idx / 8) % 3) * 1.5 - 1.5;
      return { ...item, orbitRadius, speed, yOffset };
    });
  }, [visibleItems]);

  const handlePlanetClick = (planet) => {
    if (isSearching && planet.algorithm) {
      onSelectAlgorithm(planet.algorithm);
    } else if (!isSearching) {
      setSearchQuery(planet.label);
    }
  };

  return (
    <div className="h-full w-full bg-black relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
        .retro-text {
          font-family: 'VT323', 'Courier New', monospace;
          letter-spacing: 1px;
          text-shadow: 0 0 5px #0f0;
        }
        .retro-input {
          font-family: 'VT323', 'Courier New', monospace;
          font-size: 1.2rem;
          letter-spacing: 1px;
        }
      `}</style>

      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 w-96">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔭 Search algorithms – click a category to explore"
          className="w-full px-5 py-2 rounded-full bg-black/80 backdrop-blur-md text-green-400 border border-green-500/50 focus:outline-none focus:ring-2 focus:ring-green-400 retro-input"
        />
        <p className="text-center text-green-400 mt-2 retro-text text-sm">
          {planets.length} {isSearching ? 'algorithms' : 'categories'} visible
        </p>
      </div>

      <Canvas shadows camera={{ position: [0, 5, 15], fov: 60 }} style={{ background: 'black' }}>
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0.3} fade speed={1} />
        <ambientLight intensity={0.35} />
        <pointLight position={[10, 10, 10]} intensity={0.6} />
        <fog attach="fog" args={['#000000', 20, 50]} />
        <DarkStar isSearchActive={isSearching} />
        {planets.map((planet) => (
          <Planet
            key={planet.id}
            label={planet.label}
            color={planet.color}
            position={[0, planet.yOffset, 0]}
            orbitRadius={planet.orbitRadius}
            speed={planet.speed}
            onClick={() => handlePlanetClick(planet)}
            isVisible={true}
          />
        ))}
        <CameraController />
        <OrbitControls enableZoom enablePan autoRotate={false} target={[0, 0, 0]} />
      </Canvas>
    </div>
  );
};

export default AlgorithmGalaxy;