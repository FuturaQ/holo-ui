from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import time

# Ecosystem Imports
try:
    from qai_engine.main import QAIEngine
    # Motoru başlat (Belleğe yükle)
    ai_agent = QAIEngine()
    AI_AVAILABLE = True
except ImportError:
    AI_AVAILABLE = False

router = APIRouter(
    prefix="/ai",
    tags=["ai"],
)

class PromptRequest(BaseModel):
    prompt: str

@router.post("/generate")
async def generate_circuit(request: PromptRequest):
    if not AI_AVAILABLE:
        raise HTTPException(status_code=503, detail="qai-engine module not found")

    # Yapay zeka düşünme süresi simülasyonu (UX için)
    # Gerçek LLM'ler de biraz bekletir.
    time.sleep(0.8) 
    
    try:
        # Motoru çağır
        generated_code = ai_agent.llm.generate_circuit_code(request.prompt)
        
        # Basit bir işlem kaydı döndür
        return {
            "status": "success",
            "generated_code": generated_code,
            "agent_message": "OPTIMAL_CIRCUIT_SYNTHESIZED"
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }