from fastapi import APIRouter
import platform
import os

router = APIRouter(
    prefix="/system",
    tags=["system"],
)

@router.get("/status")
async def get_system_status():
    """Returns current server health and environment info."""
    return {
        "status": "operational",
        "node": platform.node(),
        "os": platform.system(),
        "backend_pid": os.getpid(),
        "quantum_engine": "qsim-core v0.1 (Ready)",
        "crypto_engine": "pqc-lab v0.1 (Ready)"
    }
