import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, OrbitControls, Text, ContactShadows, Environment, Float, Html } from '@react-three/drei';
import { Room } from '../data/agenda';
import * as THREE from 'three';

interface InteractiveMapProps {
  rooms: Room[];
  onSelectRoom: (roomId: string) => void;
}

function RoomLayout({ room, position, onClick }: { room: Room, position: [number, number, number], onClick: () => void }) {
  const hovered = useRef(false);
  
  // Minimalist Platform components are inside the group now.
  
  // Modern Glass walls (partial privacy walls)
  const GlassMaterial = () => (
    <meshPhysicalMaterial 
      color="#e2e8f0"
      transmission={0.8}
      opacity={1}
      metalness={0.1}
      roughness={0.05}
      ior={1.5}
      thickness={0.05}
    />
  );

  return (
    <group 
      position={position}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; hovered.current = true; }}
      onPointerOut={() => { document.body.style.cursor = 'default'; hovered.current = false; }}
    >
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.1}>
        <Box args={[2.2, 0.1, 2.2]} position={[0, -0.05, 0]}>
          <meshStandardMaterial 
            color="#ffffff" 
            roughness={0.1}
            metalness={0.1}
          />
        </Box>
        <Box args={[2.2, 0.02, 0.2]} position={[0, 0.01, 1.0]}>
          <meshStandardMaterial 
            color={room.color} 
            emissive={room.color}
            emissiveIntensity={0.5}
          />
        </Box>
        
        {/* Back wall */}
        <Box args={[2.0, 1.0, 0.05]} position={[0, 0.5, -1.0]}>
          <GlassMaterial />
        </Box>
        {/* Side partial walls */}
        <Box args={[0.05, 1.0, 1.0]} position={[-1.0, 0.5, -0.5]}>
          <GlassMaterial />
        </Box>
        <Box args={[0.05, 1.0, 1.0]} position={[1.0, 0.5, -0.5]}>
          <GlassMaterial />
        </Box>
        
        {/* Soft fill light */}
        <pointLight position={[0, 0.5, 0]} color={room.color} intensity={0.5} distance={3} decay={2} />

        <Text 
          position={[0, 1.2, 0]} 
          fontSize={0.25} 
          color="#334155"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
        >
          {room.name}
        </Text>
      </Float>
    </group>
  );
}

function Tree({ position, scale = 1 }: { position: [number, number, number], scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 0.8, 5]} />
        <meshStandardMaterial color="#8B5A2B" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial color="#4ade80" roughness={0.8} flatShading />
      </mesh>
      <mesh position={[0, 1.6, 0]}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial color="#22c55e" roughness={0.8} flatShading />
      </mesh>
    </group>
  );
}

function CampusNature() {
  const trees = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 6 + Math.random() * 12;
      return {
        id: i,
        position: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius] as [number, number, number],
        scale: 0.6 + Math.random() * 0.8
      };
    });
  }, []);

  return (
    <>
      {trees.map(t => <Tree key={t.id} position={t.position} scale={t.scale} />)}
    </>
  );
}

function Scene({ rooms, onSelectRoom }: { rooms: Room[], onSelectRoom: (roomId: string) => void }) {
  const groupRef = useRef<THREE.Group>(null);

  // Arrange them in a staggered grid or circular pattern to look like a modern campus
  return (
    <group ref={groupRef}>
      {rooms.map((room, index) => {
        // Hexagonal / Circle layout for clear modern aesthetic
        const angle = (index / rooms.length) * Math.PI * 2;
        const radius = Math.max(4, rooms.length * 0.8);
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <RoomLayout 
            key={room.id} 
            room={room} 
            position={[x, 0, z]} 
            onClick={() => onSelectRoom(room.id)}
          />
        );
      })}
    </group>
  );
}

export function InteractiveMap({ rooms, onSelectRoom }: InteractiveMapProps) {
  return (
    <div className="w-full h-full relative group bg-slate-50">
      <Canvas camera={{ position: [0, 8, 12], fov: 45 }}>
        <fog attach="fog" args={['#f8fafc', 10, 30]} />
        
        <ambientLight intensity={0.6} color="#ffffff" />
        <directionalLight position={[10, 20, 10]} intensity={1.2} color="#ffffff" castShadow />
        <spotLight position={[-10, 10, -10]} intensity={0.5} color="#e2e8f0" angle={0.5} penumbra={1} />
        
        <Scene rooms={rooms} onSelectRoom={onSelectRoom} />
        <CampusNature />
        
        <ContactShadows 
          position={[0, -0.49, 0]} 
          opacity={0.4} 
          scale={30} 
          blur={2} 
          far={10} 
          color="#94a3b8"
        />
        
        {/* Subtle grid on the floor */}
        <gridHelper args={[40, 40, '#e2e8f0', '#f1f5f9']} position={[0, -0.5, 0]} />
        
        <OrbitControls 
          enablePan={true} 
          enableZoom={true}
          autoRotate={false}
          maxPolarAngle={Math.PI / 2 - 0.1}
          minDistance={5}
          maxDistance={30}
        />
        <Environment preset="city" />
      </Canvas>
      <div className="absolute bottom-4 left-4 pointer-events-none bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm px-4 py-2 rounded-full">
         <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
           Live 3D View
         </p>
      </div>
    </div>
  );
}
