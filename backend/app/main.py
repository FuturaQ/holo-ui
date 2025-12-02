from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import system, quantum  # <--- quantum eklendi

app = FastAPI(
    title="FuturaQ Holo-UI Gateway",
    description="API Gateway for Quantum Simulation and PQC Labs",
    version="0.1.0"
)

# CORS (Frontend'in Backend'e erişmesi için)
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(system.router)
app.include_router(quantum.router) # <--- Router sisteme dahil edildi

@app.get("/")
def read_root():
    return {"status": "online", "system": "FuturaQ QAHP", "version": "v0.1"}