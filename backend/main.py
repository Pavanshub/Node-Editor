from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict

app = FastAPI()

# Allow CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Node(BaseModel):
    id: str
    # other fields are ignored for DAG check

class Edge(BaseModel):
    id: str
    source: str
    target: str
    # other fields are ignored for DAG check

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
async def parse_pipeline(request: Request):
    data = await request.json()
    nodes = data.get('nodes', [])
    edges = data.get('edges', [])
    num_nodes = len(nodes)
    num_edges = len(edges)

    # Build adjacency list
    adj = {node['id']: [] for node in nodes}
    for edge in edges:
        src = edge.get('source')
        tgt = edge.get('target')
        if src in adj:
            adj[src].append(tgt)

    # Check for DAG using DFS
    def is_dag():
        visited = set()
        rec_stack = set()
        def dfs(v):
            visited.add(v)
            rec_stack.add(v)
            for neighbor in adj.get(v, []):
                if neighbor not in visited:
                    if not dfs(neighbor):
                        return False
                elif neighbor in rec_stack:
                    return False
            rec_stack.remove(v)
            return True
        for node in adj:
            if node not in visited:
                if not dfs(node):
                    return False
        return True

    return {
        'num_nodes': num_nodes,
        'num_edges': num_edges,
        'is_dag': is_dag()
    }
