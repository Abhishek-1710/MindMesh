from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from agents.ai_agents import briefing_agent, ask_brain_agent, action_extraction_agent
from models.graph_engine import build_context_graph, graph_to_dict
from models.vector_store import semantic_search

router = APIRouter()


class QuestionRequest(BaseModel):
    question: str


class SearchRequest(BaseModel):
    query: str
    n_results: int = 5


@router.get("/health")
async def health():
    return {"status": "ok", "service": "NeuroSync AI"}


@router.get("/briefing")
async def get_briefing():
    try:
        return briefing_agent()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ask")
async def ask_brain(request: QuestionRequest):
    try:
        return ask_brain_agent(request.question)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/actions")
async def get_actions():
    try:
        return action_extraction_agent()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/graph")
async def get_graph():
    try:
        return graph_to_dict(build_context_graph())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/search")
async def search(request: SearchRequest):
    try:
        return {"query": request.query, "results": semantic_search(request.query, request.n_results)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))