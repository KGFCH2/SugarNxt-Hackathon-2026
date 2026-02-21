"""
FastAPI application entry point.

- Mounts the API router
- Configures CORS for frontend access
- Serves on port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.routes import router
from dotenv import load_dotenv
import os

# Determine the directory of the current file
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Load environment variables from the .env file in the backend root
env_path = os.path.join(BASE_DIR, ".env")
load_dotenv(env_path)

app = FastAPI(
    title="Smart Flue Gas WHR Intelligence Portal",
    description="Decision-support platform for industrial waste heat recovery analysis",
    version="1.0.0",
)

@app.on_event("startup")
async def startup_event():
    api_key = os.getenv("GROQ_API_KEY")
    print(f"--- Backend Startup ---")
    print(f"ENV Path: {env_path}")
    if api_key and api_key != "your_groq_api_key_here":
        print(f"GROQ_API_KEY: Found ({api_key[:4]}...{api_key[-4:]})")
    else:
        print(f"GROQ_API_KEY: NOT FOUND or default. Chatbot will use mock responses.")
    print(f"-----------------------")

# CORS — allow the frontend (served on any origin during dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/health")
async def health():
    return {"status": "operational", "service": "WHR Intelligence Portal API"}
