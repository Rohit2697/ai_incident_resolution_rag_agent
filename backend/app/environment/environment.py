from dotenv import load_dotenv
import os
load_dotenv()

env_veriables = {
    "OPENAI":{
        "api_key":os.getenv("OPENAI_API_KEY")   
    },
    "MONGO_DB":{
        "username":os.getenv("MONGO_DB_USERNAME"),
        "password":os.getenv("MONGO_DB_PASSWORD"),
        "host":os.getenv("MONGO_DB_HOST"),
        "app_name":os.getenv("MONGO_DB_APP_NAME")
    },
    "QDRANT":{
        "url":os.getenv("QDDRANT_URL"),
        "api_key":os.getenv("QDDRANT_API_KEY")
    },
    "REDIS":{
        "url":os.getenv("REDIS_URL")
    },
    "FRONTEND":{
        "url":os.getenv("FRONTEND_URL")
    }
}