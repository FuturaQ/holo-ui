from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import numpy as np
import time

# Ecosystem Imports (Sanal ortamda kurulu olmalı)
try:
    from qsim_core import QuantumCircuit, StatevectorSimulator
    CORE_AVAILABLE = True
except ImportError:
    CORE_AVAILABLE = False

router = APIRouter(
    prefix="/quantum",
    tags=["quantum"],
)

# Gelen Veri Modeli
class CircuitRequest(BaseModel):
    code: str  # Örn: "H 0\nCX 0 1"

# Basit Parser (Metni Devreye Çevirir)
def parse_and_create_circuit(code: str) -> QuantumCircuit:
    lines = code.strip().split('\n')
    # Maksimum kübit sayısını bulalım (basitçe en büyük indeksi arıyoruz)
    max_qubit = 0
    instructions = []
    
    for line in lines:
        parts = line.strip().upper().split()
        if not parts or line.startswith("#"): continue
        
        cmd = parts[0]
        args = [int(x) for x in parts[1:]]
        if args:
            max_qubit = max(max_qubit, max(args))
        instructions.append((cmd, args))
    
    # Devreyi oluştur
    qc = QuantumCircuit(max_qubit + 1)
    
    # Kapıları ekle
    for cmd, args in instructions:
        if cmd == 'H':
            qc.h(args[0])
        elif cmd == 'X':
            qc.x(args[0])
        elif cmd == 'Y':
            qc.y(args[0])
        elif cmd == 'Z':
            qc.z(args[0])
        elif cmd == 'CX' or cmd == 'CNOT':
            qc.cx(args[0], args[1])
            
    return qc

@router.post("/run")
async def run_circuit(request: CircuitRequest):
    if not CORE_AVAILABLE:
        raise HTTPException(status_code=503, detail="qsim-core module not found")

    start_time = time.time()
    logs = []
    
    try:
        # 1. Parse
        logs.append(f"[{time.strftime('%H:%M:%S')}] PARSING_INSTRUCTION_SET...")
        qc = parse_and_create_circuit(request.code)
        logs.append(f"[{time.strftime('%H:%M:%S')}] CIRCUIT_COMPILED: {qc.num_qubits} QUBITS")

        # 2. Simulate
        sim = StatevectorSimulator()
        result = sim.run(qc)
        
        # 3. Format Result
        # Statevector'ı (karmaşık sayıları) UI için okunabilir hale getir
        # Örn: [0.7+0j, 0.7+0j] -> Genlik ve Faz
        sv_raw = result.statevector
        sv_formatted = []
        for amp in sv_raw:
            sv_formatted.append({
                "real": float(np.real(amp)),
                "imag": float(np.imag(amp)),
                "prob": float(np.abs(amp)**2)
            })
            
        execution_time = (time.time() - start_time) * 1000
        logs.append(f"[{time.strftime('%H:%M:%S')}] EXECUTION_COMPLETE: {execution_time:.2f}ms")
        
        return {
            "status": "success",
            "logs": logs,
            "statevector": sv_formatted,
            "qubits": qc.num_qubits
        }

    except Exception as e:
        return {
            "status": "error",
            "logs": [f"CRITICAL_FAILURE: {str(e)}"]
        }