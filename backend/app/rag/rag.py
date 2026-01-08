from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pathlib import Path
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv
from langchain_qdrant import QdrantVectorStore
from openai import OpenAI
from app.rag.utils.utils import build_context,return_Rag_System_prompt
load_dotenv()

class Rag:

  def __init__(self,
               embedding_model="text-embedding-3-small",
               chat_model="gpt-4.1-mini",
               vector_url=None):
    
    self.embedding=OpenAIEmbeddings(model=embedding_model)
    self.openAI_client=OpenAI()
    self.chat_model=chat_model
    self.vector_url=vector_url
    # self.vector_db=None
    # if vector_url and collection_name:
    #   self.vector_db=QdrantVectorStore.from_existing_collection(
    #     url=vector_url,
    #     collection_name=collection_name,
    #     embedding=self.embedding
    #   )

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
      documents=texts,
      embedding=self.embedding,
      url=self.vector_url,
      collection_name=collection_name
      
      
    )
    return {"status": "success","chunks_indexed": len(texts)}
    

  def retrieve(self,user_query,collection_name):
    vector_db=QdrantVectorStore.from_existing_collection(
      url=self.vector_url,
      embedding=self.embedding,
      collection_name=collection_name
    )
    search_result=vector_db.similarity_search_with_score(query=user_query,k=4)
    if not search_result or search_result[0][1]<0.3:
      return {
            "response_from": "Rag_AI_Agent",
            "response": "The information is not available in the provided document."
        }

    context=build_context(search_result)
    system_prompt=return_Rag_System_prompt(context)
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
    return {
      "response_from":"Rag_AI_Agent",
      "response":response.output_text
    }

    


