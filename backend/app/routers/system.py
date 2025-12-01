from fastapi import APIRouter
import platform
import os
import sys

# Import Ecosystem Libraries
try:
    import qsim_core
    import pqc_lab
    QSIM_STATUS = "Online (v0.1)"
    PQC_STATUS = "Online (v0.1)"
except ImportError as e:
    QSIM_STATUS = f"Error: {e}"
    PQC_STATUS = "Not Linked"

router = APIRouter(
    prefix="/system",
    tags=["system"],
)

@router.get("/status")
async def get_system_status():
    return {
        "status": "operational",
        "node": platform.node(),
        "backend_pid": os.getpid(),
        "ecosystem": {
            "qsim_core": QSIM_STATUS,
            "pqc_lab": PQC_STATUS,
            "qai_engine": "Ready"
        }
    }
