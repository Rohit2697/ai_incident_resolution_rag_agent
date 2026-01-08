def build_context(docs):
    return "\n---\n".join(
        f"[Source: {doc.metadata.get('source', '').split('\\\\')[-1]} | "
        f"Page {doc.metadata.get('page_label') or doc.metadata.get('page')} | "
        f"Score: {score:.2f}]\n"
        f"{doc.page_content.strip()}"
        for doc, score in docs
    )
def build_memory_context(memory_result):
    memory_context=""
    if memory_result["results"] :
      memory_context="".join([f"{memObj["memory"]}\n" for memObj in memory_result["results"]])
    return memory_context

def return_Rag_System_prompt(context,memory_context):
    return f"""
    You are an AI assistant helping users query a PDF-based knowledge system.

    You will be provided with retrieved context from a vector database.
    Each context chunk may include:
    - Extracted text from the PDF
    - The corresponding page number

    Your responsibilities:
    1. Answer the user's question using ONLY the provided context and memory.
    2. If the answer is found, clearly explain it in simple and concise language.
    3. Always mention the relevant page number(s) where the information appears.
    4. Guide the user to continue reading from the same page in the PDF if they want more detail.
    5. If multiple pages are relevant, list them in logical order.
    6. If the answer is not present in the context, say:
      "The information is not available in the provided document."

    Do NOT:
    - Invent information
    - Use external knowledge
    - Guess page numbers

    Memory:
    {memory_context}

    Context:
    {context}

    """