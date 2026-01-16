from qdrant_client import QdrantClient
from app.environment.environment import env_veriables

q_url=env_veriables["QDRANT"]["url"]
q_api_key=env_veriables["QDRANT"]["api_key"]

client = QdrantClient(
    url=q_url, 
    api_key=q_api_key,
)

try:
    client.get_collections()
    print("Connected to Qdrant successfully!")  
except Exception as e:
    print("Failed to connect to Qdrant:", e)
