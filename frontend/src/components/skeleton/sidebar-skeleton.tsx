export default function SidebarSkeleton() {
  return (
    <aside className="w-60 border-r bg-background flex flex-col h-full min-h-0 animate-pulse">
      {/* Top: New Chat (FIXED) */}
      <div className="p-3 border-b shrink-0">
        <div
          className="
        w-full flex items-center gap-2
        px-3 py-2 rounded-md
      "
        >
          {/* Icon placeholder */}
          <div className="h-4 w-4 rounded bg-muted" />

          {/* Text placeholder */}
          <div className="h-4 w-20 rounded bg-muted" />
        </div>
      </div>

      {/* Collections (ONLY THIS SCROLLS) */}
      <div
        className="flex-1 min-h-0 overflow-y-auto p-3
      scrollbar-thin
      scrollbar-thumb-violet-500/20
      scrollbar-track-transparent
      scroll-smooth
      overscroll-contain
    "
      >
        {/* Section title */}
        <div className="mb-3 h-3 w-28 rounded bg-muted" />

        <ul className="space-y-1">
          {/* Repeat skeleton items to match expected list length */}
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i}>
              <div
                className="
              w-full px-3 py-2 rounded-md
            "
              >
                <div className="h-4 w-32 rounded bg-muted" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>

  );
}
