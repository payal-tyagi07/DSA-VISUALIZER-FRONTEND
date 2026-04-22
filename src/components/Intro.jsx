import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const RubiksCube = ({ onComplete }) => {
  const groupRef = useRef();
  const [rotationAngle, setRotationAngle] = useState(0);
  const [phase, setPhase] = useState(0);

  useFrame((_, delta) => {
    if (phase === 0) {
      setRotationAngle(prev => prev + delta * 1.5);
      if (groupRef.current) {
        groupRef.current.rotation.y = rotationAngle;
        groupRef.current.rotation.x = Math.sin(rotationAngle * 0.5) * 0.5;
      }
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase(1);
      if (groupRef.current) groupRef.current.scale.set(1.2, 1.2, 1.2);
      setTimeout(() => {
        if (groupRef.current) groupRef.current.scale.set(1, 1, 1);
        onComplete();
      }, 300);
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const cubes = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const getColor = (x, y, z) => {
          if (x === 1) return '#ff4d4d';
          if (x === -1) return '#ffa64d';
          if (y === 1) return '#ffffff';
          if (y === -1) return '#ffff4d';
          if (z === 1) return '#4d4dff';
          if (z === -1) return '#4dff4d';
          return '#888';
        };
        cubes.push(
          <mesh key={`${x},${y},${z}`} position={[x, y, z]}>
            <boxGeometry args={[0.92, 0.92, 0.92]} />
            <meshStandardMaterial color={getColor(x, y, z)} emissive="#222" roughness={0.3} metalness={0.1} />
          </mesh>
        );
      }
    }
  }

  return <group ref={groupRef}>{cubes}</group>;
};

const Intro = ({ onStart }) => {
  const [phase, setPhase] = useState('tap');

  const handleTap = () => {
    console.log("👆 Tap detected, switching to cube phase");
    setPhase('cube');
  };

  const handleCubeComplete = () => {
    console.log("🧩 Cube animation complete, showing logo");
    setPhase('logo');
    setTimeout(() => {
      console.log("🎬 Logo done, calling onStart");
      onStart();
    }, 1500);
  };

  if (phase === 'tap') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black cursor-pointer" onClick={handleTap}>
        <div className="text-5xl font-bold text-green-400 retro-text animate-pulse">👇 TAP TO START 👆</div>
        <p className="text-gray-400 mt-4">AlgoScape – Visualize Algorithms</p>
      </div>
    );
  }

  if (phase === 'cube') {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <Canvas camera={{ position: [3, 3, 5], fov: 45 }} style={{ background: 'black' }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <RubiksCube onComplete={handleCubeComplete} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
        </Canvas>
      </div>
    );
  }

  if (phase === 'logo') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <h1 className="text-6xl font-bold text-green-400 retro-text">AlgoScape</h1>
      </div>
    );
  }

  return null;
};

export default Intro;