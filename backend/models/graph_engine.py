"""
Context Graph Engine
Builds a relationship graph across all data sources using networkx.
This is the core innovation — links emails, Slack, Jira, Calendar by shared context.
"""
import json
import os
import networkx as nx
from typing import List, Dict, Any

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "mock")


def load_all_data() -> List[Dict[str, Any]]:
    all_items = []
    for filename in ["gmail.json", "slack.json", "jira.json", "calendar.json"]:
        filepath = os.path.join(DATA_DIR, filename)
        with open(filepath, "r") as f:
            all_items.extend(json.load(f))
    return all_items


def build_context_graph() -> nx.Graph:
    G = nx.Graph()
    items = load_all_data()

    for item in items:
        label = (
            item.get("subject")
            or item.get("message", "")[:60]
            or item.get("title")
            or item.get("ticket", item["id"])
        )
        G.add_node(
            item["id"],
            label=label,
            source=item["source"],
            timestamp=item.get("timestamp", ""),
            tags=item.get("tags", []),
            full=item,
        )

    node_list = list(G.nodes(data=True))
    for i, (id1, data1) in enumerate(node_list):
        for id2, data2 in node_list[i + 1 :]:
            shared = set(data1.get("tags", [])) & set(data2.get("tags", []))
            if shared:
                G.add_edge(id1, id2, shared_tags=list(shared), weight=len(shared))

    return G


def graph_to_dict(G: nx.Graph) -> Dict:
    nodes = []
    for node_id, data in G.nodes(data=True):
        nodes.append({
            "id": node_id,
            "label": data.get("label", node_id)[:50],
            "source": data.get("source", "unknown"),
            "tags": data.get("tags", []),
            "timestamp": data.get("timestamp", ""),
        })

    edges = []
    for u, v, data in G.edges(data=True):
        edges.append({
            "source": u,
            "target": v,
            "shared_tags": data.get("shared_tags", []),
            "weight": data.get("weight", 1),
        })

    return {"nodes": nodes, "edges": edges}


def get_connected_context(node_id: str, G: nx.Graph) -> List[Dict]:
    if node_id not in G:
        return []
    return [G.nodes[n].get("full", {}) for n in G.neighbors(node_id)]