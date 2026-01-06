from pydantic import Field,BaseModel

class ChatRequest(BaseModel):
  query:str=Field(...,example="tell me about timeout error?")
  collection_name:str=Field(...,example="incidents")

