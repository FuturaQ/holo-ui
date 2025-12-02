import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

// Rastgele Şehir Koordinatları Üret (Lat/Long -> Vector3)
const generateNodes = (count: number) => {
  const nodes = [];
  for (let i = 0; i < count; i++) {
    // Rastgele küresel koordinatlar
    const phi = Math.acos(-1 + (2 * i) / count);
    const theta = Math.sqrt(count * Math.PI) * phi;
    
    // Kartezyene çevir
    const r = 2.5; // Küre yarıçapı
    const x = r * Math.cos(theta) * Math.sin(phi);
    const y = r * Math.sin(theta) * Math.sin(phi);
    const z = r * Math.cos(phi);
    
    nodes.push(new THREE.Vector3(x, y, z));
  }
  return nodes;
};

export const HoloGlobe = () => {
  const globeRef = useRef<THREE.Group>(null);
  const nodes = useMemo(() => generateNodes(30), []); // 30 Adet Kuantum Düğümü

  // Dünya Dönüşü
  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={globeRef}>
      {/* 1. Ana Atmosfer (Parlaklık) */}
      <Sphere args={[2.4, 32, 32]}>
        <meshBasicMaterial color="#000" transparent opacity={0.9} />
      </Sphere>
      
      {/* 2. Wireframe Dünya (Enlem/Boylam Çizgileri) */}
      <Sphere args={[2.5, 24, 24]}>
        <meshBasicMaterial 
          color="#1e252e" 
          wireframe 
          transparent 
          opacity={0.3} 
        />
      </Sphere>

      {/* 3. Kuantum Düğümleri (Şehirler) */}
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color={i % 5 === 0 ? "#cba052" : "#56f3d9"} />
        </mesh>
      ))}

      {/* 4. Bağlantı Hatları (Uplinks) */}
      {/* Rastgele bazı noktaları birbirine bağla */}
      {nodes.slice(0, 10).map((pos, i) => {
          const target = nodes[nodes.length - 1 - i];
          return (
             <Line
                key={`line-${i}`}
                points={[pos, new THREE.Vector3(0,0,0), target]} // Merkezden geçsin (Curve effect)
                color="#56f3d9"
                opacity={0.2}
                transparent
                lineWidth={1}
             />
          )
      })}
      
      {/* 5. Ekvatoral Halka (Süs) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.2, 0.01, 16, 100]} />
        <meshBasicMaterial color="#cba052" transparent opacity={0.5} />
      </mesh>
      
      {/* 6. Dış Halka (Dönen) */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
         <torusGeometry args={[3.5, 0.01, 16, 100]} />
         <meshBasicMaterial color="#56f3d9" transparent opacity={0.3} />
      </mesh>

    </group>
  );
};