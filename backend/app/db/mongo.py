from urllib.parse import quote_plus
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from app.environment.environment import env_veriables


print("Mongo config check:", {
    "username_present": bool(env_veriables["MONGO_DB"]["username"]),
    "password_present": bool(env_veriables["MONGO_DB"]["password"]),
    "host": env_veriables["MONGO_DB"]["host"],
})

usename=quote_plus(env_veriables["MONGO_DB"]["username"])
password=quote_plus(env_veriables["MONGO_DB"]["password"]) 
host=env_veriables["MONGO_DB"]["host"]
app_name=env_veriables["MONGO_DB"]["app_name"] 
   
uri = f"mongodb+srv://{usename}:{password}@{host}/?appName={app_name}"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
    db=client.rag_app
    chat_collection=db.chats
    collections=db.collections
except Exception as e:
    print(e)
 






