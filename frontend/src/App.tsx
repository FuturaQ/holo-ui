import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { BlochSphere } from './components/atomic/BlochSphere';

// --- MOCK DATA (İleride Backend'den Gelecek) ---
const MOCK_CODE = `
def qrun(qcircuit, n, hypo, epsilon):
    """
    execute a quantum subroutine in the optimization solution
    """
    qdev = DEVSQ.backends(simulator=False, lambda=xmax)[n]
    qjob = execute(priority=highest, qdev, qcircuit)
    
    if (qjob.retcode[7] == 0):
        q_data = qjob.meas[n]
    else: 
        # run failed, try again
        return FALSE 
    
    return q_data
    
    qreg = QuantumRegister(n//2)
    do case
        hypo in 0 to 3: / shor_pre_data = shor.pre(qint_data)
        qreg = shor.qft(n, shor_pre_data)
`;

function App() {
  const [logs, setLogs] = useState<string[]>([]);
  const [matrix, setMatrix] = useState<number[][]>([]);

  // Log Simülasyonu
  useEffect(() => {
    const interval = setInterval(() => {
      const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
      const newLog = `[${timestamp}] QPU_NODE_${Math.floor(Math.random()*10)}: SYNDROME <${Math.random().toFixed(4)}>`;
      setLogs(prev => [newLog, ...prev].slice(0, 15));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Matris Simülasyonu
  useEffect(() => {
    const interval = setInterval(() => {
      const rows = Array(12).fill(0).map(() => 
        Array(4).fill(0).map(() => Math.floor(Math.random() * 9999))
      );
      setMatrix(rows);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="scanline"></div>
      
      <div className="grid-layout">
        
        {/* PANEL 1: PROJECT NOTES */}
        <div className="panel" style={{ gridRow: "1 / 3" }}>
          <div className="panel-header">
            <span>SYSTEM CONTROL</span>
            <span>V 0.1</span>
          </div>
          
          <div className="code-text" style={{ fontSize: '11px' }}>
            # 0 = Shor <br/>
            # 1 = Discrete Log <br/>
            # 2 = Elliptic <br/>
            <br/>
            <span style={{ color: 'var(--text-dim)' }}># Note: failure syndromes active</span>
            <br/><br/>
            
            {/* STATİK GÜÇLÜ MARKA ALANI */}
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
            
            <div style={{ marginTop: '20px', color: 'var(--text-dim)', fontSize: '9px', textAlign: 'center' }}>
              QUANTUM-AI HYBRID ARCHITECTURE<br/>
              EST. 2025
            </div>
          </div>
        </div>

        {/* PANEL 2: MAIN CODE EDITOR */}
        <div className="panel">
          <div className="panel-header">
            <span>Q774 PROCESS IMPLEMENTATION</span>
            <span>EDIT MODE</span>
          </div>
          <pre className="code-text" style={{ whiteSpace: 'pre-wrap' }}>
            {MOCK_CODE}
            <span className="cursor"></span>
          </pre>
        </div>

        {/* PANEL 3: VARIANCE MONITOR */}
        <div className="panel">
           <div className="panel-header">
            <span>GATE MONITOR</span>
            <span>AxTx</span>
          </div>
          <table style={{ width: '100%', textAlign: 'right', fontFamily: 'monospace', color: 'var(--text-dim)' }}>
            <thead>
              <tr style={{ color: 'var(--primary)' }}>
                <th>GID</th><th>T1-T2</th><th>Tx</th><th>Val</th>
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, i) => (
                <tr key={i}>
                  <td style={{ color: 'var(--text-main)' }}>{row[0]}</td>
                  <td>- S 08</td>
                  <td>{row[2]}</td>
                  <td style={{ color: 'var(--accent)' }}>{row[3]}m</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PANEL 4: SYSTEM LOGS */}
        <div className="panel">
          <div className="panel-header">
            <span>SUB-ROUTINE RUNNING</span>
            <span style={{color:'var(--success)'}}>ONLINE</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column-reverse', height: '100%', overflow: 'hidden' }}>
             {logs.map((log, i) => (
               <div key={i} style={{ fontFamily: 'monospace', fontSize: '10px', color: i===0 ? 'var(--success)' : 'var(--text-main)' }}>
                 {log}
               </div>
             ))}
          </div>
        </div>

        {/* PANEL 5: 3D BLOCH SPHERE */}
        <div className="panel" style={{ position: 'relative', overflow: 'hidden' }}>
           <div className="panel-header" style={{ position: 'absolute', top: 10, left: 10, zIndex: 10, width: '90%' }}>
             <span>STATE VISUALIZER</span>
             <span>|Ψ⟩</span>
           </div>
           
           <div style={{ width: '100%', height: '100%' }}>
             <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
               <BlochSphere />
             </Canvas>
           </div>
           
           <div style={{ position: 'absolute', bottom: 10, right: 10, color: 'var(--success)', fontSize: '10px' }}>
             COHERENCE: 99.9%
           </div>
        </div>

      </div>
    </>
  )
}

export default App