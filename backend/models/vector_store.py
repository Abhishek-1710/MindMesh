"""
Semantic Search using ChromaDB + sentence-transformers.
Runs fully locally — no extra API costs for search.
"""
import chromadb
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Any
from models.graph_engine import load_all_data

EMBED_MODEL = "all-MiniLM-L6-v2"

_collection = None
_embedder = None


def get_embedder():
    global _embedder
    if _embedder is None:
        _embedder = SentenceTransformer(EMBED_MODEL)
    return _embedder


def get_collection():
    global _collection
    if _collection is None:
        client = chromadb.Client()
        _collection = client.get_or_create_collection("neurosync")
    return _collection


def build_index():
    collection = get_collection()
    embedder = get_embedder()
    items = load_all_data()

    texts, ids, metadatas = [], [], []
    for item in items:
        text = " ".join(filter(None, [
            item.get("subject", ""),
            item.get("message", ""),
            item.get("body", ""),
            item.get("title", ""),
            item.get("description", ""),
            " ".join(item.get("tags", [])),
        ]))
        texts.append(text)
        ids.append(item["id"])
        metadatas.append({
            "source": item["source"],
            "timestamp": item.get("timestamp", ""),
            "tags": ",".join(item.get("tags", [])),
        })

    embeddings = embedder.encode(texts).tolist()
    collection.add(documents=texts, embeddings=embeddings, ids=ids, metadatas=metadatas)
    return len(items)


def semantic_search(query: str, n_results: int = 5) -> List[Dict[str, Any]]:
    collection = get_collection()
    embedder = get_embedder()
    query_embedding = embedder.encode([query]).tolist()
    results = collection.query(query_embeddings=query_embedding, n_results=n_results)

    all_data = {item["id"]: item for item in load_all_data()}
    output = []
    for i, doc_id in enumerate(results["ids"][0]):
        item = all_data.get(doc_id, {})
        output.append({
            "id": doc_id,
            "source": results["metadatas"][0][i]["source"],
            "text": results["documents"][0][i][:300],
            "full": item,
        })
    return output