from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import system, quantum, ai, crypto  # <--- 'crypto' eklendi

app = FastAPI(
    title="FuturaQ Holo-UI Gateway",
    version="0.3.0"
)

# ... (CORS ayarları aynı kalsın) ...
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

app.include_router(system.router)
app.include_router(quantum.router)
app.include_router(ai.router)
app.include_router(crypto.router)  # <--- Sisteme dahil edildi

@app.get("/")
def read_root():
    return {"status": "online", "system": "FuturaQ QAHP", "version": "v0.3"}