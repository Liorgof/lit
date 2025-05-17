from pymongo import MongoClient
import json
from scraper.db import wikipedia_collection


collection = wikipedia_collection()

nodes = set()
links = []

for doc in collection.find():
    source = doc["Query"]
    nodes.add(source)
    for target in doc.get("Links", []):
        nodes.add(target)
        links.append({"source": source, "target": target})

graph_data = {
    "nodes": [{"id": node} for node in nodes],
    "links": links
}

with open("graph_data.json", "w", encoding="utf-8") as f:
    json.dump(graph_data, f, ensure_ascii=False, indent=2)
