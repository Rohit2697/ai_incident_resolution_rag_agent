import { FaPenToSquare } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import { useEffect, type Dispatch, type SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';

type SidebarProps = {
  refreshSideBar: boolean;
  setRefreshSideBar: Dispatch<SetStateAction<boolean>>;
  collections: string[];
  setCollections: Dispatch<SetStateAction<string[]>>;
};

export default function Sidebar({
  refreshSideBar,
  setRefreshSideBar,
  collections,
  setCollections
}: SidebarProps) {
  
  const navigate=useNavigate()

  useEffect(() => {
    if (!refreshSideBar) return;

    const refresh = async () => {
      try {
        const res = await fetch('http://localhost:8080/collections');
        if (res.status !== 200) {
          const errorResponse = await res.json();
          throw new Error(
            `Unable to load /collections ${errorResponse.detail}`
          );
        }
        const result = await res.json();
        setCollections(result.collections);
      } catch (err) {
        console.log(err);
      } finally {
        setRefreshSideBar(false);
      }
    };

    refresh();
  }, [refreshSideBar, setRefreshSideBar]);

  return (
    <aside className="w-60 border-r bg-background flex flex-col h-full min-h-0">
      {/* Top: New Chat (FIXED) */}
      <div className="p-3 border-b shrink-0">
        <Button
          variant="ghost"
          onClick={(e)=>{
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
              onClick={(e)=>{
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
