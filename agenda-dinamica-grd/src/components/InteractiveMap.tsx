import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, OrbitControls, Text, ContactShadows, Environment, Float } from '@react-three/drei';
import { Room } from '../data/agenda';
import * as THREE from 'three';

interface InteractiveMapProps {
  rooms: Room[];
  onSelectRoom: (roomId: string) => void;
}

// Spinning energetic core representing PN26 navigation point in pristine emerald green
function CrystalCore({ color }: { color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 1.2;
      meshRef.current.rotation.x += delta * 0.6;
    }
  });

  // Base fallback to emerald green if color is not specified or too dark
  const finalColor = color && color !== '#000000' ? color : '#10b981';

  return (
    <mesh ref={meshRef} position={[0, 0.45, 0]}>
      <octahedronGeometry args={[0.26, 0]} />
      <meshStandardMaterial 
        color={finalColor} 
        emissive={finalColor}
        emissiveIntensity={1.5}
        roughness={0.05}
        metalness={0.8}
      />
    </mesh>
  );
}

function RoomLayout({ room, position, onClick }: { room: Room, position: [number, number, number], onClick: () => void }) {
  const isHovered = useRef(false);

  // Check if it's a main venue
  const isPrincipal = useMemo(() => {
    const nameLower = room.name.toLowerCase();
    return (
      nameLower.includes('plenaria') ||
      nameLower.includes('principal') ||
      nameLower.includes('auditorio') ||
      room.capacity >= 120
    );
  }, [room.name, room.capacity]);

  // Clean, high-impact light palette color for PN26 Navigation Map
  const activeColor = room.color && room.color !== '#000000' ? room.color : '#10b981';
  const accentColor = isPrincipal ? '#059669' : '#34d399'; // Strong emerald vs. soft emerald
  const emissiveInt = isPrincipal ? 1.6 : 1.0;

  // Modern crisp white/translucent frosted glass standard material
  const GlassMaterial = () => (
    <meshPhysicalMaterial 
      color="#ffffff"
      transmission={0.9}
      opacity={0.8}
      metalness={0.1}
      roughness={0.1}
      ior={1.5}
      thickness={0.05}
    />
  );

  return (
    <group 
      position={position}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; isHovered.current = true; }}
      onPointerOut={() => { document.body.style.cursor = 'default'; isHovered.current = false; }}
    >
      <Float speed={2.5} rotationIntensity={0.05} floatIntensity={0.1}>
        {/* Main Clean Alabaster White Platform */}
        <Box args={[2.2, 0.12, 2.2]} position={[0, -0.06, 0]}>
          <meshStandardMaterial 
            color="#ffffff" 
            roughness={0.2}
            metalness={0.1}
          />
        </Box>

        {/* Dynamic Green Neon Border Strip */}
        <Box args={[2.22, 0.04, 0.12]} position={[0, 0.02, 1.05]}>
          <meshStandardMaterial 
            color={activeColor} 
            emissive={activeColor}
            emissiveIntensity={emissiveInt}
            roughness={0.2}
          />
        </Box>

        {/* Translucent white minimalist structural walls */}
        <Box args={[2.0, 0.8, 0.04]} position={[0, 0.4, -1.0]}>
          <GlassMaterial />
        </Box>
        <Box args={[0.04, 0.8, 1.2]} position={[-1.0, 0.4, -0.4]}>
          <GlassMaterial />
        </Box>
        <Box args={[0.04, 0.8, 1.2]} position={[1.0, 0.4, -0.4]}>
          <GlassMaterial />
        </Box>

        {/* Internal Navigation Point Glow Core */}
        <CrystalCore color={activeColor} />
        
        {/* Soft, vibrant green under-glow light to highlight structure */}
        <pointLight position={[0, 0.3, 0]} color={activeColor} intensity={1.5} distance={3.0} decay={2} />

        {/* Crisp Room Labels - Extremely Legible */}
        <Text 
          position={[0, 1.15, 0]} 
          fontSize={0.23} 
          color="#1e293b" // Dark Slate for crisp reading
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
        >
          {room.name}
        </Text>
      </Float>
    </group>
  );
}

function Scene({ rooms, onSelectRoom }: { rooms: Room[], onSelectRoom: (roomId: string) => void }) {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef}>
      {rooms.map((room, index) => {
        // Multi-point radial topology optimized for high aesthetic beauty on mobile views
        const angle = (index / rooms.length) * Math.PI * 2;
        const radius = Math.max(3.6, rooms.length * 0.95);
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
    <div className="w-full h-full relative group bg-slate-50 overflow-hidden">
      <Canvas camera={{ position: [0, 8.0, 10.5], fof: 45 } as any}>
        {/* Soft, architectural white fog */}
        <fog attach="fog" args={['#f8fafc', 8, 25]} />
        
        {/* Balanced high-brightness studio lighting */}
        <ambientLight intensity={0.6} color="#ffffff" />
        <directionalLight position={[10, 18, 10]} intensity={1.5} color="#e2f0d9" castShadow />
        <spotLight position={[-8, 15, -8]} intensity={0.8} color="#ffffff" angle={0.6} penumbra={1} />
        
        <Scene rooms={rooms} onSelectRoom={onSelectRoom} />
        
        {/* Soft elegant shadow mask */}
        <ContactShadows 
          position={[0, -0.49, 0]} 
          opacity={0.4} 
          scale={30} 
          blur={2.8} 
          far={8} 
          color="#0f172a"
        />
        
        {/* Elegant infinite light green/gray grid */}
        <gridHelper args={[60, 60, '#cbd5e1', '#e2e8f0']} position={[0, -0.5, 0]} />
        
        <OrbitControls 
          enablePan={true} 
          enableZoom={true}
          autoRotate={false}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={3.5}
          maxDistance={20}
        />
      </Canvas>

      {/* Fresh Clean Minimal Badge */}
      <div className="absolute bottom-4 left-4 pointer-events-none bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-md px-4 py-2 rounded-full">
         <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-widest flex items-center gap-2">
           <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
           Mapa Interactivo PN26
         </p>
      </div>
    </div>
  );
}
