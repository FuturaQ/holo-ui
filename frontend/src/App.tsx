import { useState, useEffect } from 'react'

// Sahte Kod Verisi (Devs dizisindeki Python koduna benzer)
const MOCK_CODE = `
def qrun(qcircuit, n, hypo, epsilon):
    """
    execute a quantum subroutine in the optimization solution
    search the quantum circuit has already been built to match
    """
    qdev = DEVSQ.backends(simulator=False, lambda=xmax)[n]
    qjob = execute(priority=highest, qdev, qcircuit)
    
    if (qjob.retcode[7] == 0):
        q_data = qjob.meas[n]
    else: 
        # run failed, try again
        return FALSE 
    
    return q_data # run successful
    
    qreg = QuantumRegister(n//2)
    do case
        hypo in 0 to 3: / shor_pre_data = shor.pre(qint_data)
        qreg = shor.qft(n, shor_pre_data)
        # Slicing done dynamically for hypo = 6-8
`;

function App() {
  const [logs, setLogs] = useState<string[]>([]);
  const [matrix, setMatrix] = useState<number[][]>([]);

  // Log Üretici (Sistem çalışıyor hissi vermek için)
  useEffect(() => {
    const interval = setInterval(() => {
      const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
      const newLog = `[${timestamp}] QPU_NODE_${Math.floor(Math.random()*10)}: SYNDROME_DETECTED <${Math.random().toFixed(4)}>`;
      setLogs(prev => [newLog, ...prev].slice(0, 15));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Matrix Üretici (Sağ paneldeki sayılar)
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
            <span>NOTES</span>
            <span>UNK_VAR</span>
          </div>
          <div className="code-text" style={{ fontSize: '11px' }}>
            # 0 = Shor <br/>
            # 1 = Discrete Log <br/>
            # 2 = Elliptic <br/>
            # 3 = Supersingular <br/>
            # 4 = Lattice A <br/>
            # 5 = Lattice B <br/>
            <br/>
            <span className="comment"># Note: failure syndromes for 1 and 3</span>
            <br/><br/>
            <div style={{ border: '1px solid var(--devs-cyan)', padding: '5px', textAlign: 'center', marginTop: '20px', color: 'var(--devs-gold)' }}>
              PROJECT FUTURAQ
            </div>
          </div>
        </div>

        {/* PANEL 2: MAIN CODE EDITOR */}
        <div className="panel">
          <div className="panel-header">
            <span>Q774 PROCESS IMPLEMENTATION</span>
            <span>VERSION: 05.09.004</span>
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
          <table style={{ width: '100%', textAlign: 'right', fontFamily: 'monospace', color: '#888' }}>
            <thead>
              <tr style={{ color: 'var(--devs-cyan)' }}>
                <th>GID</th><th>T1-T2</th><th>Tx</th><th>Val</th>
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, i) => (
                <tr key={i}>
                  <td style={{ color: '#fff' }}>{row[0]}</td>
                  <td>- S 08</td>
                  <td>{row[2]}</td>
                  <td style={{ color: 'var(--devs-gold)' }}>{row[3]}m</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PANEL 4: SYSTEM LOGS (Bottom Center) */}
        <div className="panel">
          <div className="panel-header">
            <span>R-FYMN SUB-ROUTINE RUNNING</span>
            <span>STATUS: ONLINE</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column-reverse', height: '100%', overflow: 'hidden' }}>
             {logs.map((log, i) => (
               <div key={i} style={{ fontFamily: 'monospace', fontSize: '10px', color: i===0 ? 'var(--devs-green)' : '#333' }}>
                 {log}
               </div>
             ))}
          </div>
        </div>

        {/* PANEL 5: QUBIT STATE (Bottom Right) */}
        <div className="panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <div style={{ 
             width: '100px', 
             height: '100px', 
             border: '2px dashed var(--devs-dim)', 
             borderRadius: '50%', 
             display: 'flex', 
             alignItems: 'center', 
             justifyContent: 'center',
             color: 'var(--devs-cyan)',
             boxShadow: '0 0 20px var(--devs-cyan)'
           }}>
             |Ψ⟩
           </div>
        </div>

      </div>
    </>
  )
}

export default App