import { useSearchParams } from 'react-router-dom';
import  Chat  from '@/components/Chat';

export default function ChatPage() {
  const [params] = useSearchParams();
  const collectionName = params.get('collection_name');

  if (!collectionName) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        No collection selected
      </div>
    );
  }

  return (
    <div className="h-full min-h-0">
      <Chat collectionName={collectionName} />
    </div>
  );
}
