import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';

export const BlochSphere = () => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const arrowRef = useRef<THREE.Group>(null);

  // Animasyon Döngüsü
  useFrame((state) => {
    if (sphereRef.current) {
      // Küre yavaşça dönsün
      sphereRef.current.rotation.y += 0.001;
    }
    if (arrowRef.current) {
      // Ok kuantum dalgalanması yapsın
      arrowRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.1;
      arrowRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      
      {/* Kullanıcı kontrolü */}
      <OrbitControls enableZoom={false} />

      {/* Ana Tel Kafes Küre */}
      <Sphere ref={sphereRef} args={[2.5, 32, 32]}>
        <meshStandardMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.15}
        />
      </Sphere>

      {/* İç Dolgu (Hafif karartı) */}
      <Sphere args={[2.45, 32, 32]}>
        <meshBasicMaterial color="#000000" transparent opacity={0.8} />
      </Sphere>

      {/* Ekvator Çizgisi */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.5, 0.01, 16, 100]} />
        <meshBasicMaterial color="#888" />
      </mesh>

      {/* Kuantum Vektörü (Ok) */}
      <group ref={arrowRef} rotation={[0, 0, Math.PI / 4]}>
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 2.4, 8]} />
          <meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} />
        </mesh>
        <mesh position={[0, 2.5, 0]}>
          <coneGeometry args={[0.15, 0.3, 16]} />
          <meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} />
        </mesh>
      </group>

      {/* Etiketler (HTML Overlay) */}
      <Html position={[0, 2.8, 0]} center><div style={{color: 'var(--primary)', fontWeight:'bold'}}>|0⟩</div></Html>
      <Html position={[0, -2.8, 0]} center><div style={{color: 'var(--primary)', fontWeight:'bold'}}>|1⟩</div></Html>
    </>
  );
};