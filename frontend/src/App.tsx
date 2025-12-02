import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { BlochSphere } from './components/atomic/BlochSphere';

const DEFAULT_CODE = `# Initialize Superposition
H 0`;

function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [blochState, setBlochState] = useState({ theta: 0, phi: 0 });

  const [cryptoData, setCryptoData] = useState<any[]>([]);

  // --- YENİ AI STATE'LERİ ---
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // --- AI GENERATION FUNCTION ---
  const generateWithAI = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setLogs(prev => [`[${new Date().toISOString().split('T')[1].slice(0,-1)}] UPLINKING_TO_QAI_ENGINE...`, ...prev]);

    try {
      const response = await fetch('http://127.0.0.1:8000/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
         // Kodu değiştir (Daktilo efekti olmadan direkt yapıştırıyoruz şimdilik)
         setCode(data.generated_code);
         setLogs(prev => [`QAI_RESPONSE: ${data.agent_message}`, ...prev]);
      } else {
         setLogs(prev => [`AI_ERROR: ${data.message}`, ...prev]);
      }
    } catch (e) {
      setLogs(prev => [`CONNECTION_REFUSED: AI Node offline`, ...prev]);
    }
    
    setIsGenerating(false);
  };

  // ... (runCircuit fonksiyonu AYNI kalsın) ...
  const runCircuit = async () => {
    setIsRunning(true);
    // ... (Eski kodun aynısı buraya)
    // ... (fetch quantum/run kısmı)
    // ...
    // ... (blochState hesaplama kısmı)
    // Sadece örnek olması için buraya tekrar kopyalamıyorum, eski runCircuit'i koru.
    // Ancak backend çağrısı hatasız olmalı. 
    
    // -- HIZLI RESTORASYON İÇİN KISA VERSİYON (Eğer kopyalarken bozulursa diye) --
    try {
        const response = await fetch('http://127.0.0.1:8000/quantum/run', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: code })
        });
        const data = await response.json();
        if (data.status === 'success') {
            setLogs(prev => [...data.logs.reverse(), ...prev]);
            // Bloch Logic
            if (data.statevector && data.statevector.length >= 2) {
                const amp0 = data.statevector[0]; const amp1 = data.statevector[1];
                const mag0 = Math.sqrt(amp0.real**2 + amp0.imag**2);
                const mag1 = Math.sqrt(amp1.real**2 + amp1.imag**2);
                let theta = 2 * Math.acos(Math.min(mag0, 1.0));
                if (mag1 > mag0) theta = Math.PI - (2 * Math.acos(Math.min(mag1, 1.0)));
                if (Math.abs(mag0 - mag1) < 0.1 && mag0 > 0.4) theta = Math.PI / 2; 
                setBlochState({ theta, phi: 0 });
            }
        }
    } catch(e) { console.error(e); }
    setIsRunning(false);
  };

  // ... runCircuit ve generateWithAI fonksiyonlarının yanına
  const establishSecureLink = async () => {
      try {
          const res = await fetch('http://127.0.0.1:8000/crypto/handshake');
          const data = await res.json();
          
          // Yeni gelen veriyi listenin başına ekle (Log gibi akması için)
          setCryptoData(prev => [
              {
                  id: Math.floor(Math.random() * 9999),
                  algo: data.algo,
                  key: data.keys.public_key_frag,
                  status: data.status
              },
              ...prev
          ].slice(0, 12)); // Sadece son 12 satırı tut
          
      } catch (e) {
          console.error("Crypto module offline");
      }
  };

  // Otomatik handshake simülasyonu (Her 2 saniyede bir çalışsın)
  useEffect(() => {
      const interval = setInterval(establishSecureLink, 2000);
      return () => clearInterval(interval);
  }, []);

  // Klavye: Ctrl+Enter (Run), Enter (AI Input'tayken Generate)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') runCircuit();
  };

  return (
    <>
      <div className="scanline"></div>
      <div className="grid-layout">
        
        {/* PANEL 1: CONTROL (SOL) - AYNI KALSIN */}
        <div className="panel" style={{ gridRow: "1 / 3" }}>
          {/* ... (Eski Panel 1 kodları aynen kalsın) ... */}
           <div className="panel-header">
            <span>SYSTEM CONTROL</span>
            <span>V 0.3 AI</span>
          </div>
          {/* EXECUTE BUTTON vb... */}
          <div className="code-text" style={{ fontSize: '11px' }}>
             <button onClick={runCircuit} disabled={isRunning} style={{
                background: isRunning ? 'var(--text-dim)' : 'transparent',
                color: isRunning ? '#000' : 'var(--primary)',
                border: '1px solid var(--primary)', padding: '10px', width: '100%', cursor: 'pointer', fontFamily: 'var(--font-stack)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px'
              }}>
              {isRunning ? 'PROCESSING...' : 'EXECUTE SEQUENCE'}
            </button>
            <div style={{ textAlign: 'center', marginTop: '40px', border: '1px solid var(--primary)', padding: '10px', color: 'var(--accent)', background: 'rgba(86, 243, 217, 0.05)' }}>
              FUTURAQ PLATFORM
            </div>
          </div>
        </div>

        {/* PANEL 2: EDITOR (ORTA) - GÜNCELLENİYOR */}
        <div className="panel">
          <div className="panel-header">
            <span>QUANTUM INSTRUCTION SET</span>
            <span>EDIT MODE</span>
          </div>
          
          {/* --- YENİ AI INPUT BAR --- */}
          <div style={{ display: 'flex', marginBottom: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            <span style={{ color: 'var(--accent)', marginRight: '10px', alignSelf: 'center' }}>AI_PROMPT:</span>
            <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && generateWithAI()}
                placeholder="Ex: Create a Bell State..."
                style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: 'none',
                    color: 'var(--text-main)',
                    fontFamily: 'var(--font-stack)',
                    flex: 1,
                    outline: 'none'
                }}
            />
            <button 
                onClick={generateWithAI}
                disabled={isGenerating}
                style={{
                    background: 'var(--accent)',
                    color: '#000',
                    border: 'none',
                    fontFamily: 'var(--font-stack)',
                    cursor: 'pointer',
                    padding: '0 15px',
                    fontWeight: 'bold'
                }}
            >
                {isGenerating ? '...' : 'GEN'}
            </button>
          </div>
          
          {/* TEXTAREA (Aynı) */}
          <textarea 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            className="code-text"
            spellCheck="false"
            style={{ width: '100%', height: '100%', background: 'transparent', border: 'none', resize: 'none', outline: 'none', fontFamily: 'var(--font-stack)', fontSize: '14px', color: 'var(--text-main)' }}
          />
        </div>

        {/* PANEL 3: CRYPTO MONITOR (RIGHT) */}
        <div className="panel">
          <div className="panel-header">
            <span>PQC UPLINK (KYBER-512)</span>
            <span style={{ color: 'var(--success)' }}>SECURE</span>
          </div>
          
          <table style={{ width: '100%', textAlign: 'left', fontFamily: 'monospace', color: 'var(--text-dim)', fontSize: '10px' }}>
            <thead>
              <tr style={{ color: 'var(--primary)', borderBottom: '1px solid #333' }}>
                <th>ID</th><th>ALGO</th><th>KEY_FRAG</th><th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {cryptoData.map((row, i) => (
                <tr key={i} style={{ opacity: 1 - (i * 0.08) }}> {/* Eskiyen veriler sönükleşsin */}
                  <td style={{ color: 'var(--text-main)' }}>#{row.id}</td>
                  <td style={{ color: 'var(--accent)' }}>{row.algo}</td>
                  <td style={{ fontFamily: 'monospace' }}>{row.key}</td>
                  <td style={{ color: 'var(--success)' }}>{row.status}</td>
                </tr>
              ))}
              {/* Veri yoksa placeholder */}
              {cryptoData.length === 0 && (
                  <tr><td colSpan={4} style={{textAlign:'center', paddingTop:'20px'}}>INITIALIZING PQC PROTOCOL...</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <div className="panel-header"><span>KERNEL LOG</span><span>LIVE</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
             {logs.map((log, i) => (
               <div key={i} style={{ fontFamily: 'monospace', fontSize: '10px', color: log.includes('ERROR') ? 'red' : 'var(--text-main)', borderBottom: '1px solid #222', padding: '2px' }}>{log}</div>
             ))}
          </div>
        </div>

        <div className="panel" style={{ position: 'relative', overflow: 'hidden' }}>
           <div style={{ width: '100%', height: '100%' }}>
             <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
               <BlochSphere theta={blochState.theta} phi={blochState.phi} />
             </Canvas>
           </div>
        </div>

      </div>
    </>
  )
}

export default App