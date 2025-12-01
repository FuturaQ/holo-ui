import { useState, useEffect } from 'react'

function App() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkSystem = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/system/status');
      const data = await res.json();
      setStatus(data);
    } catch (e) {
      console.error(e);
      setStatus({ status: "OFFLINE", error: "Backend Unreachable" });
    }
    setLoading(false);
  };

  useEffect(() => {
    checkSystem();
  }, []);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, #1a1a1a 0%, #000 100%)' }}>
      
      <h1 className="glow-text" style={{ fontSize: '4rem', margin: '0 0 20px 0', fontFamily: 'monospace' }}>
        FUTURA<span style={{color: 'var(--neon-blue)'}}>Q</span>
      </h1>
      
      <div className="holo-card" style={{ width: '400px', textAlign: 'center' }}>
        <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>SYSTEM STATUS</h2>
        
        {loading ? (
          <p>Scanning Quantum Core...</p>
        ) : status ? (
          <div style={{ textAlign: 'left', fontFamily: 'monospace' }}>
            <p><strong>CORE:</strong> <span style={{ color: status.status === 'operational' ? '#0f0' : '#f00' }}>{status.status?.toUpperCase()}</span></p>
            <p><strong>NODE:</strong> {status.node}</p>
            <p><strong>QSIM:</strong> {status.quantum_engine}</p>
            <p><strong>PQC:</strong> {status.crypto_engine}</p>
          </div>
        ) : (
          <p style={{ color: 'red' }}>OFFLINE</p>
        )}

        <div style={{ marginTop: '20px' }}>
          <button className="cyber-btn" onClick={checkSystem}>
            RE-SYNC
          </button>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '20px', fontSize: '0.8rem', color: '#666' }}>
        QAHP HYBRID PLATFORM v0.1
      </div>
    </div>
  )
}

export default App
