import { FaPenToSquare } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarSkeleton from './skeleton/sidebar-skeleton';
import { api_base } from '@/lib/api';
type SidebarProps = {
  user: string;
  refreshSideBar: boolean;
  setRefreshSideBar: Dispatch<SetStateAction<boolean>>;
  collections: string[];
  setCollections: Dispatch<SetStateAction<string[]>>;
};

export default function Sidebar({
  user,
  refreshSideBar,
  setRefreshSideBar,
  collections,
  setCollections
}: SidebarProps) {

  const navigate = useNavigate()
  const [job_id, setJob_id] = useState<string | null>(null)
  const [fetching, setFetching] = useState(false)
  useEffect(() => {
    if (!refreshSideBar) return;

    const refresh = async () => {
      try {
        setFetching(true);
        const call_collection = await fetch(`${api_base}/collections/${user}`);
        if (call_collection.status !== 200) {
          const errorResponse = await call_collection.json();
          throw new Error(
            `Unable to load /collections ${errorResponse.detail}`
          );
        }
        const result = await call_collection.json();
        setJob_id(result.job_id)
      } catch (err) {
        setFetching(false);
        console.log(err);
      } finally {
        setRefreshSideBar(false);
      }
    };

    refresh();
  }, [refreshSideBar, setRefreshSideBar]);
  useEffect(() => {
    if (!job_id) return;
    const interval = setInterval(async () => {
      try {
        setFetching(true);
        const status_response = await fetch(`${api_base}/collections-result/${job_id}`);
        if (status_response.status !== 200) {
          const errorResponse = await status_response.json();
          throw new Error(
            `Unable to load /collections-result ${errorResponse.detail}`
          );
        }
        const status_result = await status_response.json();
        if (status_result.status === 'finished') {
          setCollections(status_result.result.data);
          setFetching(false);
          setJob_id(null);
          clearInterval(interval);
        } else if (status_result.status === 'failed') {
          console.error('Failed to fetch collections result');
          setJob_id(null);
          setFetching(false);
          clearInterval(interval);
        }
      } catch (err) {
        setFetching(false);
        console.log(err);
        clearInterval(interval);
      }
    }, 3000); // Poll every 2 seconds
    return () => clearInterval(interval);
  }, [job_id, setCollections]);


  if (fetching) {
    return <SidebarSkeleton />;
  }
  return (
    <aside className="w-60 border-r bg-background flex flex-col h-full min-h-0">
      {/* Top: New Chat (FIXED) */}
      <div className="p-3 border-b shrink-0">
        <Button
          variant="ghost"
          onClick={(e) => {
            e.preventDefault()
            navigate('/')
          }}
          className="
            w-full justify-start gap-2
            hover:bg-violet-500/10
            hover:text-violet-400
            transition-colors
          "
        >
          <FaPenToSquare className="h-4 w-4" />
          <span className="text-sm font-medium">New Chat</span>
        </Button>
      </div>

      {/* Collections (ONLY THIS SCROLLS) */}
      <div
        className="flex-1 min-h-0 overflow-y-auto p-3
       scrollbar-thin
  scrollbar-thumb-violet-500/40
  scrollbar-track-transparent
  hover:scrollbar-thumb-violet-500/70
  scroll-smooth
  overscroll-contain
      "
      >
        <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
          Your collections
        </p>

        <ul className="space-y-1">
          {collections.map((name) => (
            <li key={name}>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  navigate(`/chat?collection_name=${name}`)
                }}
                className="
                  w-full text-left px-3 py-2 rounded-md text-sm
                  transition-colors
                  hover:bg-violet-500/10
                  hover:text-violet-400
                "
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
