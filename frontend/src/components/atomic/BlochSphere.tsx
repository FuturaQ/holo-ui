import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Html, Trail } from '@react-three/drei';
import * as THREE from 'three';

interface BlochProps {
  theta?: number;
  phi?: number;
  active?: boolean;
}

export const BlochSphere = ({ theta = 0, phi = 0, active = true }: BlochProps) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const arrowGroupRef = useRef<THREE.Group>(null);
  // Hedef topu (Trail buna bağlanacak)
  const targetRef = useRef<THREE.Mesh>(null); 

  useFrame((state) => {
    if (sphereRef.current) sphereRef.current.rotation.y += 0.005;

    if (arrowGroupRef.current && targetRef.current) {
        // Oku hedefe yönlendir
        const targetQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, phi, theta));
        arrowGroupRef.current.quaternion.slerp(targetQ, 0.1);
        
        // Trail Hedefini (Görünmez top) okun ucuna koy
        // Ok uzunluğu ~2.5 birim
        // Matematiksel küresel koordinat dönüşümü
        const r = 2.4;
        const x = r * Math.sin(theta) * Math.cos(phi);
        const y = r * Math.cos(theta); // Three.js'de Y yukarıdır (Genelde Z fizikte yukarıdır ama burada Y)
        const z = r * Math.sin(theta) * Math.sin(phi);
        
        // Basitçe okun ucunu takip etmesi için lokal pozisyon kullanalım
        // Ok grubu döndüğü için, içindeki bir objeyi takip etmek daha kolay.
    }
  });

  return (
    <>
      <ambientLight intensity={2} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#56f3d9" />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />

      {/* Ana Küre (Daha belirgin) */}
      <Sphere ref={sphereRef} args={[2.5, 32, 32]}>
        <meshStandardMaterial color="#000" wireframe transparent opacity={0.3} emissive="#111" />
      </Sphere>
      
      {/* İç Enerji (Glow effect hilesi) */}
      <Sphere args={[2.2, 32, 32]}>
          <meshBasicMaterial color={active ? "#56f3d9" : "#333"} transparent opacity={0.05} />
      </Sphere>

      {/* DİNAMİK OK GRUBU */}
      <group ref={arrowGroupRef}>
         {/* Okun Kendisi */}
         <mesh position={[0, 1.2, 0]} rotation={[0,0,0]}>
            <cylinderGeometry args={[0.02, 0.02, 2.4, 8]} />
            <meshBasicMaterial color="#fff" />
         </mesh>
         
         {/* IŞIK İZİ (TRAIL) İÇİN GÖRÜNMEZ HEDEF */}
         {/* Okun ucunda duran görünmez bir nesne */}
         <group position={[0, 2.4, 0]}>
             <Trail width={6} length={8} color={new THREE.Color("#cba052")} attenuation={(t) => t * t}>
                <mesh ref={targetRef}>
                    <sphereGeometry args={[0.1]} />
                    <meshBasicMaterial color="#cba052" />
                </mesh>
             </Trail>
         </group>
      </group>

      <Html position={[0, 2.8, 0]} center><div style={{color: '#56f3d9', fontSize:'12px', fontWeight:'900'}}>|0⟩</div></Html>
      <Html position={[0, -2.8, 0]} center><div style={{color: '#56f3d9', fontSize:'12px', fontWeight:'900'}}>|1⟩</div></Html>
    </>
  );
};