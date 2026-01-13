from motor.motor_asyncio import AsyncIOMotorClient
DB_URI="mongodb://admin:admin@localhost:27017"
client=AsyncIOMotorClient(DB_URI)
db=client.rag_app
chat_collection=db.chats
collections=db.collections
 