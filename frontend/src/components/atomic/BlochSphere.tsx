import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';

// Küre artık dışarıdan "hedef açıları" alıyor
interface BlochProps {
  theta?: number; // Kutup açısı (0 = Yukarı, PI = Aşağı)
  phi?: number;   // Ekvator açısı (Dönüş)
}

export const BlochSphere = ({ theta = 0, phi = 0 }: BlochProps) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const arrowRef = useRef<THREE.Group>(null);

  // Hedef rotasyonu saklamak için (Yumuşak geçiş için)
  const targetRotation = useRef(new THREE.Euler(0, 0, 0));

  useEffect(() => {
    // Kuantum durumundan 3D rotasyona çeviri
    // Three.js koordinat sistemine göre ayarlamalar
    targetRotation.current.z = theta; 
    targetRotation.current.y = phi; 
  }, [theta, phi]);

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.001; // Küre iskeleti yavaşça dönsün
    }
    if (arrowRef.current) {
      // Okun ucunu hedefe doğru "yumuşakça" (LERP) döndür
      // Mevcut açıdan hedef açıya %10 hızla yaklaş
      arrowRef.current.rotation.z = THREE.MathUtils.lerp(arrowRef.current.rotation.z, targetRotation.current.z, 0.1);
      arrowRef.current.rotation.y = THREE.MathUtils.lerp(arrowRef.current.rotation.y, targetRotation.current.y, 0.1);
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <OrbitControls enableZoom={false} />

      {/* Ana Tel Kafes Küre */}
      <Sphere ref={sphereRef} args={[2.5, 32, 32]}>
        <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.15} />
      </Sphere>

      {/* İç Dolgu */}
      <Sphere args={[2.45, 32, 32]}>
        <meshBasicMaterial color="#000000" transparent opacity={0.8} />
      </Sphere>

      {/* Ekvator Çizgisi */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.5, 0.01, 16, 100]} />
        <meshBasicMaterial color="#888" />
      </mesh>

      {/* DİNAMİK KUANTUM OKU */}
      {/* Group rotasyonu ile oku hareket ettiriyoruz */}
      <group ref={arrowRef}>
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 2.4, 8]} />
          <meshStandardMaterial color="#56f3d9" emissive="#56f3d9" emissiveIntensity={2} />
        </mesh>
        <mesh position={[0, 2.5, 0]}>
          <coneGeometry args={[0.15, 0.3, 16]} />
          <meshStandardMaterial color="#56f3d9" emissive="#56f3d9" emissiveIntensity={2} />
        </mesh>
      </group>

      <Html position={[0, 2.8, 0]} center><div style={{color: '#56f3d9', fontWeight:'bold', fontSize:'10px'}}>|0⟩</div></Html>
      <Html position={[0, -2.8, 0]} center><div style={{color: '#56f3d9', fontWeight:'bold', fontSize:'10px'}}>|1⟩</div></Html>
    </>
  );
};