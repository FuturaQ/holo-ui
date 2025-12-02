import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { BlochSphere } from './components/atomic/BlochSphere';
import { Multiverse } from './components/atomic/Multiverse';
import { StarField } from './components/atomic/StarField';

// SONSUZ KUANTUM AKIŞI İÇİN SENARYOLAR
const SCENARIOS = [
  { name: "QUANTUM ENTANGLEMENT SWAP", code: "H 0\nH 1\nCX 0 1\nCX 1 2\nH 0\nMEASURE 0" },
  { name: "SHOR ALGORITHM (PRIME 15)", code: "H 0\nH 1\nH 2\nCP 0 1\nCP 1 2\nCX 2 0\nINV_QFT" },
  { name: "GROVER SEARCH (ORACLE)", code: "H 0\nH 1\nX 0\nCX 0 1\nZ 1\nCX 0 1\nX 0\nH 0" },
  { name: "ERROR CORRECTION (SURFACE)", code: "CNOT 1 3\nCNOT 2 4\nCNOT 1 2\nH 3\nMEASURE SYNDROME" },
  { name: "VQE MOLECULAR SIM", code: "RY 0.5 0\nRZ 1.2 1\nCNOT 0 1\nRY -0.5 0\nMEASURE HAMILTONIAN" }
];

function App() {
  const [code, setCode] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [currentCmd, setCurrentCmd] = useState("INIT");
  const [blochState, setBlochState] = useState({ theta: 0, phi: 0 });
  
  // --- ENGINE STATES ---
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [entropy, setEntropy] = useState(0); // 0 to 100
  const [totalOps, setTotalOps] = useState(849200); // Fake sayaç, sürekli artacak

  // --- THE PERPETUAL MOTION ENGINE ---
  useEffect(() => {
    let timeout: any;
    
    // HIZ HESAPLAMA: Entropi arttıkça hızlanır (Min 30ms, Max 150ms)
    // Entropi 100 olunca "CRITICAL" mod, çok hızlı.
    const speed = Math.max(30, 150 - entropy); 

    const runStep = () => {
      const scenario = SCENARIOS[scenarioIndex];
      const lines = scenario.code.split('\n');

      if (lineIndex < lines.length) {
        // --- SATIR İŞLEME ---
        const line = lines[lineIndex];
        
        // Kodu ekle (Matrix stili: üstten alta değil, sürekli üzerine yazma hissi)
        setCode(prev => {
            const arr = prev.split('\n');
            if (arr.length > 12) arr.shift(); // Ekran dolmasın, yukarı kaydır
            return arr.join('\n') + line + "\n";
        });
        
        // Komut Analizi
        if (line.includes('H')) setCurrentCmd('H');
        else if (line.includes('CX') || line.includes('CNOT')) setCurrentCmd('CX');
        else if (line.includes('MEASURE')) setCurrentCmd('MEASURE');
        else setCurrentCmd('OP');

        // Bloch Oynat
        setBlochState({ theta: Math.random() * Math.PI, phi: Math.random() * Math.PI * 2 });

        // İstatistikleri Artır
        setLogs(prev => [`[T+${Date.now()%10000}] ${line}`, ...prev].slice(0, 18));
        setTotalOps(prev => prev + 1);
        
        // ENTROPİ ARTIRMA (Her satırda artar)
        setEntropy(prev => {
            if (prev >= 100) return 0; // SINGULARITY RESET!
            return prev + 0.5;
        });

        // Sonraki satıra geç
        setLineIndex(prev => prev + 1);
        
      } else {
        // --- SENARYO BİTTİ -> ANINDA SONRAKİNE GEÇ (DURMAK YOK) ---
        setLogs(prev => [`--- ${scenario.name} COMPLETE ---`, ...prev]);
        setLineIndex(0);
        setScenarioIndex(prev => (prev + 1) % SCENARIOS.length);
        // Kod ekranını temizlemiyoruz, akış devam etsin!
      }
    };

    timeout = setTimeout(runStep, speed);
    return () => clearTimeout(timeout);

  }, [lineIndex, scenarioIndex, entropy]);

  // CRITICAL MODE (Entropy > 90) Rengi
  const isCritical = entropy > 90;
  const systemColor = isCritical ? '#ff3300' : 'var(--primary)';

  return (
    <>
      <div className="scanline"></div>
      
      {/* BACKGROUND - Rengi duruma göre değişir */}
      <div style={{ position: 'fixed', inset: 0, zIndex: -1, background: isCritical ? '#1a0500' : '#020205', transition: 'background 0.5s' }}>
        <Canvas camera={{ position: [0, 0, 1] }}>
          <StarField />
        </Canvas>
      </div>

      <div className="grid-layout" style={{ gap: '0', padding: '0', height: '100vh', display:'grid', gridTemplateColumns:'280px 1fr 320px', gridTemplateRows:'1fr 280px' }}>
        
        {/* SOL PANEL: SYSTEM METRICS */}
        <div className="panel" style={{ gridRow: '1 / 3', borderRight: `1px solid ${systemColor}`, background:'rgba(0,0,0,0.85)', padding:'20px', display:'flex', flexDirection:'column' }}>
            <div style={{color: systemColor, fontSize:'24px', fontWeight:'900', letterSpacing:'4px', marginBottom:'20px'}}>
                FUTURAQ
            </div>

            {/* ENTROPY BAR (SINGULARITY PROGRESS) */}
            <div style={{marginBottom:'30px'}}>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:'10px', color:'var(--text-dim)', marginBottom:'5px'}}>
                    <span>SYSTEM ENTROPY</span>
                    <span style={{color: isCritical ? 'red' : 'inherit'}}>{Math.floor(entropy)}%</span>
                </div>
                <div style={{width:'100%', height:'6px', background:'#222'}}>
                    <div style={{width: `${entropy}%`, height:'100%', background: isCritical ? 'red' : 'var(--primary)', boxShadow: `0 0 10px ${systemColor}`, transition:'width 0.1s linear'}}></div>
                </div>
                {isCritical && <div style={{color:'red', fontSize:'10px', marginTop:'5px', animation:'blink 0.2s infinite'}}>⚠ CRITICAL MASS IMMINENT</div>}
            </div>
            
            <div style={{fontSize:'10px', color:'var(--text-dim)', marginTop:'auto'}}>
                TOTAL OPS: <span style={{color:'white'}}>{totalOps.toLocaleString()}</span><br/>
                QPU TEMP: <span style={{color: isCritical ? 'red' : 'white'}}>{isCritical ? '15mK (WARNING)' : '12mK'}</span>
            </div>
        </div>

        {/* ORTA PANEL: INFINITE CODE STREAM */}
        <div className="panel" style={{ borderRight: `1px solid ${systemColor}`, position:'relative', overflow:'hidden' }}>
            {/* Arka Plan Dev Harf */}
            <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', fontSize:'150px', opacity:'0.03', fontWeight:'900', color:'white', pointerEvents:'none'}}>
                {currentCmd}
            </div>

            <div style={{padding:'40px', fontFamily:'Fira Code', fontSize:'16px', lineHeight:'1.8', color:'var(--text-main)', height:'100%', display:'flex', flexDirection:'column', justifyContent:'flex-end'}}>
                <div style={{color: systemColor, marginBottom:'10px', borderBottom:`1px solid ${systemColor}`, paddingBottom:'5px'}}>
                    &gt; EXECUTING: {SCENARIOS[scenarioIndex].name}
                </div>
                <pre style={{whiteSpace:'pre-wrap', textShadow:`0 0 5px ${systemColor}`, margin:0}}>
                    {code}
                    <span className="cursor" style={{background: systemColor}}> </span>
                </pre>
            </div>
        </div>

        {/* SAĞ ÜST: REACTIVE MULTIVERSE */}
        <div className="panel" style={{ background:'black', borderBottom: `1px solid ${systemColor}` }}>
            <Canvas camera={{ position: [0, 0, 7], fov: 60 }}>
                <Multiverse command={currentCmd} entropy={entropy} />
            </Canvas>
            <div style={{position:'absolute', top:10, right:10, fontSize:'10px', color: systemColor}}>
                {isCritical ? 'SINGULARITY DETECTED' : 'HILBERT SPACE'}
            </div>
        </div>

        {/* ORTA ALT: LOGS */}
        <div className="panel" style={{ gridColumn: '2 / 3', borderTop: `1px solid ${systemColor}`, background:'rgba(0,0,0,0.95)' }}>
            <div style={{padding:'10px', height:'100%', overflow:'hidden', display:'flex', flexDirection:'column-reverse'}}>
                {logs.map((log, i) => (
                    <div key={i} style={{fontFamily:'monospace', fontSize:'11px', color: i===0 ? 'white' : '#555'}}>
                        {log}
                    </div>
                ))}
            </div>
        </div>

        {/* SAĞ ALT: BLOCH SPHERE */}
        <div className="panel" style={{ background:'black' }}>
             <Canvas camera={{ position: [2, 2, 5], fov: 45 }}>
               <BlochSphere theta={blochState.theta} phi={blochState.phi} active={!isCritical} />
             </Canvas>
        </div>

      </div>
    </>
  )
}

export default App