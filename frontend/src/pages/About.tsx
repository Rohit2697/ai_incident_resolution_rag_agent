export default function About() {
  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-3xl font-bold">About RAG AI Assistant</h1>

      <p className="text-muted-foreground">
        RAG AI Assistant is a Retrieval-Augmented Generation system designed
        to help users query their own documents using AI.
      </p>

      <p>
        It combines:
      </p>

      <ul className="list-disc pl-6 space-y-1">
        <li>Vector search (Qdrant)</li>
        <li>LLM-based reasoning</li>
        <li>User & collection–wise chat history</li>
        <li>Asynchronous document processing</li>
      </ul>

      <p className="text-sm text-muted-foreground">
        Built with FastAPI, LangChain, Qdrant, MongoDB, and React.
      </p>
    </div>
  )
}
