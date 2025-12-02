import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { BlochSphere } from './components/atomic/BlochSphere';

// Varsayılan: |0> Durumu (Ok Yukarı)
// Theta: 0 (Kutup), Phi: 0
const DEFAULT_CODE = `# Initialize Superposition
H 0`;

function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  // Bloch Küresi Açıları
  const [blochState, setBlochState] = useState({ theta: 0, phi: 0 });

  const runCircuit = async () => {
    setIsRunning(true);
    setLogs(prev => [`[${new Date().toISOString().split('T')[1].slice(0,-1)}] SENT_TO_QSIM...`, ...prev]);

    try {
      const response = await fetch('http://127.0.0.1:8000/quantum/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setLogs(prev => [...data.logs.reverse(), ...prev]);
        
        // --- KUANTUM MATEMATİĞİ (Frontend Tarafı) ---
        // Statevector'dan Qubit 0'ın açılarını hesapla
        // |psi> = a|0> + b|1>
        // Theta = 2 * acos(|a|)
        // (Basitleştirilmiş görselleştirme)
        
        if (data.statevector && data.statevector.length >= 2) {
            const amp0 = data.statevector[0]; // |0...0> genliği
            const amp1 = data.statevector[1]; // |0...1> genliği (kabaca)
            
            // Olasılık genliği büyüklüğü (Magnitude)
            const mag0 = Math.sqrt(amp0.real**2 + amp0.imag**2);
            const mag1 = Math.sqrt(amp1.real**2 + amp1.imag**2);
            
            // Basit Theta Hesabı (0 ile PI arası)
            // Eğer |1> genliği yüksekse açı PI'ye (180 derece) yaklaşır.
            let theta = 2 * Math.acos(Math.min(mag0, 1.0));
            
            // Yön düzeltmesi (Hafif hile: |1> daha büyükse aşağı indir)
            if (mag1 > mag0) theta = Math.PI - (2 * Math.acos(Math.min(mag1, 1.0)));

            // Ekvatoral dönüş (Superposition için)
            // Eğer H kapısı varsa (mag0 ~ mag1), oku 90 dereceye (Ekvatora) sabitle
            if (Math.abs(mag0 - mag1) < 0.1 && mag0 > 0.4) {
                theta = Math.PI / 2; 
            }

            console.log("Bloch Angles:", { theta });
            setBlochState({ theta, phi: 0 }); // Şimdilik Phi'yi 0 tutuyoruz
        }

      } else {
        setLogs(prev => [...data.logs, ...prev]);
      }
      
    } catch (error) {
      setLogs(prev => [`CONNECTION_ERROR: Backend unreachable`, ...prev]);
    }
    
    setIsRunning(false);
  };

  // Klavye Kısayolu (Ctrl + Enter)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
      runCircuit();
    }
  };

  return (
    <>
      <div className="scanline"></div>
      
      <div className="grid-layout">
        
        {/* PANEL 1: PROJECT NOTES */}
        <div className="panel" style={{ gridRow: "1 / 3" }}>
          <div className="panel-header">
            <span>SYSTEM CONTROL</span>
            <span>V 0.2</span>
          </div>
          
          <div className="code-text" style={{ fontSize: '11px' }}>
            <div style={{ marginBottom: '20px', color: 'var(--text-dim)' }}>
              COMMANDS:<br/>
              - H [qubit]<br/>
              - X [qubit]<br/>
              - CX [ctrl] [target]
            </div>

            <button 
              onClick={runCircuit}
              disabled={isRunning}
              style={{
                background: isRunning ? 'var(--text-dim)' : 'transparent',
                color: isRunning ? '#000' : 'var(--primary)',
                border: '1px solid var(--primary)',
                padding: '10px 20px',
                width: '100%',
                cursor: 'pointer',
                fontFamily: 'var(--font-stack)',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                transition: 'all 0.2s'
              }}
            >
              {isRunning ? 'PROCESSING...' : 'EXECUTE SEQUENCE'}
            </button>
             <div style={{ textAlign: 'center', marginTop: '5px', fontSize: '9px', color: 'var(--text-dim)' }}>
               [CTRL + ENTER]
             </div>

            <div style={{ 
              border: '1px solid var(--primary)', 
              padding: '10px', 
              textAlign: 'center', 
              marginTop: '40px', 
              color: 'var(--accent)',
              letterSpacing: '2px',
              background: 'rgba(86, 243, 217, 0.05)'
            }}>
              FUTURAQ PLATFORM
            </div>
          </div>
        </div>

        {/* PANEL 2: MAIN CODE EDITOR (Artık Textarea) */}
        <div className="panel">
          <div className="panel-header">
            <span>QUANTUM INSTRUCTION SET</span>
            <span>EDIT MODE</span>
          </div>
          <textarea 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            className="code-text"
            spellCheck="false"
            style={{ 
              width: '100%', 
              height: '100%', 
              background: 'transparent', 
              border: 'none', 
              resize: 'none', 
              outline: 'none',
              fontFamily: 'var(--font-stack)',
              fontSize: '14px',
              color: 'var(--text-main)',
              padding: '10px'
            }}
          />
        </div>

        {/* PANEL 3: VARIANCE MONITOR (Statik kalabilir şimdilik) */}
        <div className="panel">
           <div className="panel-header">
            <span>GATE MONITOR</span>
            <span>AxTx</span>
          </div>
          {/* ... Eski tablo kodu buraya ... (Şimdilik dokunmuyoruz) */}
          <div style={{padding:'20px', textAlign:'center', color:'var(--text-dim)'}}>
            Awaiting Hardware Link...
          </div>
        </div>

        {/* PANEL 4: SYSTEM LOGS (Gerçek Loglar) */}
        <div className="panel">
          <div className="panel-header">
            <span>KERNEL LOG</span>
            <span style={{color: isRunning ? 'var(--accent)' : 'var(--success)'}}>
                {isRunning ? 'BUSY' : 'IDLE'}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
             {logs.map((log, i) => (
               <div key={i} style={{ fontFamily: 'monospace', fontSize: '10px', color: log.includes('ERROR') ? 'red' : 'var(--text-main)', borderBottom: '1px solid #222', padding: '2px' }}>
                 {log}
               </div>
             ))}
          </div>
        </div>

{/* PANEL 5: 3D BLOCH SPHERE */}
        <div className="panel" style={{ position: 'relative', overflow: 'hidden' }}>
           <div className="panel-header" style={{ position: 'absolute', top: 10, left: 10, zIndex: 10, width: '90%' }}>
             <span>STATE VISUALIZER (QUBIT 0)</span>
             <span>|Ψ⟩</span>
           </div>
           
           <div style={{ width: '100%', height: '100%' }}>
             <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
               {/* Hesaplanan açıları Küreye gönderiyoruz */}
               <BlochSphere theta={blochState.theta} phi={blochState.phi} />
             </Canvas>
           </div>
        </div>

      </div>
    </>
  )
}

export default App