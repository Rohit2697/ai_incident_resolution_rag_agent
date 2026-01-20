import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { VscSend } from 'react-icons/vsc';
import { Textarea } from './ui/textarea';
import { Alert, AlertTitle } from './ui/alert';
import { AlertCircleIcon } from 'lucide-react';
import ChatSkeleton from './skeleton/chat-skeleton';
import { cn } from '@/lib/utils';
import { api_base } from '@/lib/api';

type ChatMessage = {
  role: "user" | "assistant",
  content: string,
  timestamp: string
}
export default function Chat({ collectionName }: { collectionName: string }) {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [disableInput, setDisableInput] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const [chat_worker_job_id, setChatWorkerJobId] = useState<string | null>(null);
  const bottomref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading_chat_history, setLoadingChatHistory] = useState(false);


//input should be iso string like "2024-06-25T14:48:00.000Z"
  const getTime = (inputDate: string) =>
  new Date(inputDate).toLocaleString([], {
    day: '2-digit',
    month: 'short',   // Jan, Feb, Mar…
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
  useEffect(() => {
    bottomref.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const fetchChatHostory = async () => {
      try {
        setLoadingChatHistory(true)
        const response = await fetch(`${api_base}/chat-history?userId=${encodeURIComponent('admin')}&collection_name=${encodeURIComponent(collectionName)}`);
        if (response.ok) {
          const result = await response.json();
          setChatWorkerJobId(result.job_id);
        }
      } catch (error) {
        setLoadingChatHistory(false)
        setError("Failed to fetch chat history.");
        console.error("Error fetching chat history:", error);
      } 
    };
    fetchChatHostory()
  }, [collectionName]);


  useEffect(() => {
    if (!chat_worker_job_id) return;
    const fetch_chat_worker_result_interval = setInterval(async () => {
      try {
        const response = await fetch(`${api_base}/chat-worker-result/${encodeURIComponent(chat_worker_job_id)}`);
        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.detail || "Error fetching chat worker result.");
          return;
        }
        const result = await response.json();
        if (result.message === 'finished') {
          setDisableInput(false);
          if (result.context === "chat_history_worker") {
            setLoadingChatHistory(false);
            setMessages(result.result.data as ChatMessage[]);
          }
          else if (result.context === "chat_worker") {
            setIsThinking(false);
            setMessages(prev => {
              const updated = [...prev]
              const newMessage: ChatMessage = {
                role: "assistant",
                content: result.result.data.response,
                timestamp: new Date().toISOString()
              };
              updated[updated.length - 1] = newMessage
              return updated;
            })

          }
          clearInterval(fetch_chat_worker_result_interval);
        }


      } catch (error) {
        setError("Failed to fetch chat worker result.");
        console.error("Error fetching chat worker result:", error);
        clearInterval(fetch_chat_worker_result_interval);
      }

    }, 3000);
    return () => clearInterval(fetch_chat_worker_result_interval);
  }, [chat_worker_job_id]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    const body = {
      "query": message,
      "collection_name": collectionName,
      "userId": "admin"
    }
    try {
      setDisableInput(true);
      setIsThinking(true);
      setMessages(prev => [...prev, {
        role: "user",
        content: message,
        timestamp: new Date().toISOString()
      }, {
        role: "assistant",
        content: "Thinking...",
        timestamp: new Date().toISOString()
      }])
      setMessage('');
      const response = await fetch(`${api_base}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.detail || "Error sending message.");
        setDisableInput(false);
        setIsThinking(false);
        return;
      }
      const result = await response.json();
      setChatWorkerJobId(result.job_id);
    } catch (e) {
      setError("Failed to send message.");
      console.error("Error sending message:", e);
    }
  }

  if(loading_chat_history){
    return <ChatSkeleton />
  }

  return (

    <div className="flex flex-col h-full min-h-0 rounded-xl border bg-card">
      {error && (
        <div>
          <Alert variant="destructive">
            <AlertCircleIcon className="h-4 w-4 mr-2" />

            <AlertTitle>{error}</AlertTitle>

            {/* Close button */}
            <button
              onClick={() => setError(null)}
              className="absolute right-2 top-2 rounded p-1 text-muted-foreground hover:text-foreground"
              aria-label="Close error"
            >
              ✕
            </button>
          </Alert>
        </div>

      )}

      {/* Messages (ONLY THIS SCROLLS) */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4">

        <div className="flex flex-col gap-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={cn(
                'flex w-full',
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {/* Column wrapper */}
              <div
                className={cn(
                  'flex flex-col max-w-[75%]',
                  msg.role === 'user' ? 'items-end' : 'items-start'
                )}
              >
                {/* Message bubble */}
                <div
                  className={cn(
                    'rounded-2xl px-4 py-2 text-sm shadow-sm',
                    msg.role === 'user'
                      ? 'bg-violet-600 text-white'
                      : 'bg-muted text-foreground'
                  )}
                >
                  {msg.content}
                </div>

                {/* Timestamp */}
                <span className="mt-1 text-[11px] text-muted-foreground">
                  {getTime(msg.timestamp)}
                </span>
              </div>
            </div>
          ))}

          <div ref={bottomref} />
        </div>
      </div>



      {/* Input (FIXED AT BOTTOM) */}
      <div className="border-t p-3 shrink-0 mb-7">
        <div className="relative">
          <Textarea
            disabled={disableInput || isThinking}
            placeholder="Enter your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="
              w-full resize-none pr-12 min-h-[60px]
              border border-gray-300 rounded-md
              focus:border-violet-500
              focus:ring-1 focus:ring-violet-500
              transition-colors
            "
          />

          <Button
            size="icon"
            onClick={sendMessage}
            variant="default"
            className="
              absolute bottom-2 right-2
              hover:bg-violet-600 hover:text-white
              transition-colors
            "
            disabled={!message.trim() || disableInput || isThinking}
            aria-label="Send message"
          >
            <VscSend className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div >
  );
}
