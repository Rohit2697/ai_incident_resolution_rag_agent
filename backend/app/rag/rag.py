from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv
from langchain_qdrant import QdrantVectorStore
from openai import OpenAI
from app.rag.utils.utils import build_context,return_Rag_System_prompt,build_memory_context
from app.memory.user_memory import memory as user_memory
from app.environment.environment import env_veriables
load_dotenv()

class Rag:

  def __init__(self,
               embedding_model="text-embedding-3-small",
               chat_model="gpt-4.1-mini"):
    self.embedding=OpenAIEmbeddings(model=embedding_model)
    self.openAI_client=OpenAI()
    self.chat_model=chat_model
    self.qdrant_url=env_veriables["QDRANT"]["url"]
    self.qdrant_api_key=env_veriables["QDRANT"]["api_key"]
  def extract(self,file_path,chunk_size,chunk_overlap):
    # filePath=Path(__file__).parent/"sample.pdf"
    loader=PyPDFLoader(file_path=file_path)
    docs=loader.load()
    for doc in docs:
      doc.metadata.update({"source": file_path.name})
    text_splitter=RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    texts=text_splitter.split_documents(docs)
    return texts
  
  def store(self,texts,collection_name):
    QdrantVectorStore.from_documents(
      url=self.qdrant_url, 
      api_key=self.qdrant_api_key,
      documents=texts,
      embedding=self.embedding,
      collection_name=collection_name
      
      
    )
    return {"status": "success","chunks_indexed": len(texts)}
    

  def retrieve(self,user_query,collection_name,userId:str):

    memory_result=user_memory.search(query=user_query,user_id=userId)

    memory_context=build_memory_context(memory_result)

    vector_db=QdrantVectorStore.from_existing_collection(
      url=self.qdrant_url, 
      api_key=self.qdrant_api_key,
      embedding=self.embedding,
      collection_name=collection_name
      
    )
    search_result=vector_db.similarity_search_with_score(query=user_query,k=4)
    if not search_result or search_result[0][1]<0.3:
      return {
            "response_from": "assistant",
            "response": "The information is not available in the provided document."
        }

    context=build_context(search_result)
    system_prompt=return_Rag_System_prompt(context,memory_context)
    response=self.openAI_client.responses.create(
      model=self.chat_model,
      input=[
        {
          "role":"system","content":system_prompt
        },
        {
          "role":"user","content":user_query
        }
      ]
    )
    ai_response=response.output_text
  
    user_memory.add([
      {"role":"user","content":user_query},
      {"role":"assistant","content":ai_response}
    ],user_id=userId)
    return {
      "response_from":"assistant",
      "response":response.output_text
    }

    


