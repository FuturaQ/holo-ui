from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import system

app = FastAPI(
    title="FuturaQ Holo-UI Gateway",
    description="API Gateway for Quantum Simulation and PQC Labs",
    version="0.1.0"
)

# CORS Configuration (Allow Frontend to talk to Backend)
origins = [
    "http://localhost:5173", # Vite default port
    "http://localhost:3000", # React default port
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

@app.get("/")
def read_root():
    return {"status": "online", "system": "FuturaQ QAHP", "version": "v0.1"}
