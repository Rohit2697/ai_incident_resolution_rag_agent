from mem0 import Memory
from app.environment.environment import env_veriables

config={
    "llm": {
        "provider": "openai",
        "config": {
            "api_key": env_veriables["OPENAI"]["api_key"],
            "model":"gpt-4.1-mini",
        }
    },
     "vector_store": {
        "provider": "qdrant",
        "config": {
            "collection_name": "user_memory",
            "url": env_veriables["QDRANT"]["url"],
            "api_key": env_veriables["QDRANT"]["api_key"]
        }
    }
}

memory=Memory.from_config(config)