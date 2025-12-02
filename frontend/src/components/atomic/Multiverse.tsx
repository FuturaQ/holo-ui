import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export const Multiverse = ({ command, entropy }: { command: string, entropy: number }) => {
  const ref = useRef<THREE.Points>(null);
  
  // 12000 Parçacık (Daha yoğun)
  const positions = useMemo(() => {
    const pos = new Float32Array(12000 * 3);
    for (let i = 0; i < 12000; i++) {
      const r = 6 * Math.random(); 
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;

    // ENTROPİ HIZI ARTIRIR
    // Normal hız: 0.2, Kritik hız: 2.0
    const speedMultiplier = 1 + (entropy / 20); 

    ref.current.rotation.y += delta * 0.1 * speedMultiplier;
    ref.current.rotation.z += delta * 0.05 * speedMultiplier;

    // RENK DEĞİŞİMİ
    // Düşük Entropi: Turkuaz
    // Yüksek Entropi: Turuncu/Kırmızı
    const baseColor = new THREE.Color("#56f3d9");
    const criticalColor = new THREE.Color("#ff3300");
    const currentColor = baseColor.lerp(criticalColor, entropy / 100);

    // SCALE REAKSİYONU (Kalp Atışı)
    let targetScale = 1 + (entropy / 200); // Entropi arttıkça evren şişer
    
    if (command.includes('H')) targetScale += 0.5;
    if (command.includes('CX')) targetScale -= 0.3;

    ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, targetScale, 0.1));
    
    // Malzeme Rengini Güncelle (Biraz hacky ama çalışır)
    // @ts-ignore
    ref.current.material.color = currentColor;
  });

  return (
    <group>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#56f3d9"
          size={0.02}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6 + (entropy/200)} // Entropi arttıkça daha parlak
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
};