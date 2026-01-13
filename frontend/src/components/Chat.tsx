import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { VscSend } from 'react-icons/vsc';
import { Textarea } from './ui/textarea';

export default function Chat({ collectionName }: { collectionName: string }) {
  const [message, setMessage] = useState('');

  return (
    <div className="flex flex-col h-full min-h-0 rounded-xl border bg-card">
      {/* Messages (ONLY THIS SCROLLS) */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4">{collectionName}</div>

      {/* Input (FIXED AT BOTTOM) */}
      <div className="border-t p-3 shrink-0 mb-7">
        <div className="relative">
          <Textarea
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
            variant="default"
            className="
              absolute bottom-2 right-2
              hover:bg-violet-600 hover:text-white
              transition-colors
            "
            disabled={!message.trim()}
            aria-label="Send message"
          >
            <VscSend className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
