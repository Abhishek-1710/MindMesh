import os
import json
import re
from dotenv import load_dotenv
from groq import Groq
from typing import List, Dict, Any
from models.graph_engine import load_all_data, build_context_graph, get_connected_context
from models.vector_store import semantic_search

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def _chat(system: str, user: str, temperature: float = 0.4) -> str:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        temperature=temperature,
        max_tokens=1000,
    )
    return response.choices[0].message.content


def _parse_json(raw: str):
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        match = re.search(r'[\[{].*[\]}]', raw, re.DOTALL)
        if match:
            return json.loads(match.group())
        return None


def briefing_agent() -> Dict[str, Any]:
    all_data = load_all_data()
    system = """You are MindMesh AI — an intelligent second brain for knowledge workers.
Analyze all provided data and return ONLY this JSON structure (no markdown, no backticks):
{
  "greeting": "Good morning, Abhishek",
  "summary": "One sentence overview of the day",
  "urgent_topics": [
    {"title": "...", "detail": "...", "sources": ["gmail", "slack"], "risk_level": "high|medium|low"}
  ],
  "suggested_actions": [
    {"action": "...", "reason": "...", "priority": 1}
  ],
  "connections_found": [
    {"description": "Insight connecting two or more sources", "sources": ["email_001", "slack_001"]}
  ]
}"""
    raw = _chat(system, f"Data:\n{json.dumps(all_data, indent=2)}", temperature=0.3)
    return _parse_json(raw) or {"error": "Parse failed", "raw": raw}


def ask_brain_agent(question: str) -> Dict[str, Any]:
    search_results = semantic_search(question, n_results=6)
    G = build_context_graph()

    context_items = {r["id"]: r["full"] for r in search_results}
    if search_results:
        for item in get_connected_context(search_results[0]["id"], G):
            context_items.setdefault(item.get("id"), item)

    system = """You are MindMesh AI. Answer questions using the user's work data.
Be specific — name people, reference actual messages and tickets.
Start with 2-3 direct sentences, then bullet points if needed.
Always mention which sources you used (e.g. 'Based on Rahul's Slack message and Jira #231...')."""

    answer = _chat(
        system,
        f"Question: {question}\n\nData:\n{json.dumps(list(context_items.values()), indent=2)}"
    )
    return {
        "question": question,
        "answer": answer,
        "sources_used": [r["source"] for r in search_results],
        "items_found": len(context_items),
    }


def action_extraction_agent() -> List[Dict[str, Any]]:
    all_data = load_all_data()
    system = """Extract all commitments, deadlines, and pending tasks from the messages.
Return ONLY a JSON array (no markdown, no backticks):
[
  {
    "action": "what needs to be done",
    "owner": "person responsible",
    "deadline": "date or timeframe",
    "source_id": "id of source item",
    "source_type": "gmail|slack|jira|calendar",
    "urgency": "high|medium|low",
    "original_text": "the phrase implying this action"
  }
]"""
    raw = _chat(system, f"Data:\n{json.dumps(all_data, indent=2)}", temperature=0.2)
    return _parse_json(raw) or []