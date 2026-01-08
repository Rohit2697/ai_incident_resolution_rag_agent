import os
from mem0 import Memory
from dotenv import load_dotenv

load_dotenv()
config={
    "llm": {
        "provider": "openai",
        "config": {
            "api_key":os.environ.get("OPENAI_API_KEY"),
            "model":"gpt-4.1-mini",
        }
    },
     "vector_store": {
        "provider": "qdrant",
        "config": {
            "collection_name": "user_memory",
            "host": "localhost",
            "port": 6333,
        }
    }
}

memory=Memory.from_config(config)