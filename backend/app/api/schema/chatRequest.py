from pydantic import Field,BaseModel

class ChatRequest(BaseModel):
  query:str=Field(...,example="I am getting memory leak error in nodejs")
  collection_name:str=Field(...,example="nodejs")
  userId:str=Field(...,example="test@gmail.com")

