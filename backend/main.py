"""
NeuroSync AI — FastAPI entry point
Run: uvicorn main:app --reload --port 8000
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routers.api import router
from models.vector_store import build_index

load_dotenv()

app = FastAPI(title="NeuroSync AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")


@app.on_event("startup")
async def startup_event():
    print("🧠 MindMesh starting...")
    count = build_index()
    print(f"✅ Indexed {count} items. Ready at http://localhost:8000")
    print("📖 API docs at http://localhost:8000/docs")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # We'll restrict this after deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)