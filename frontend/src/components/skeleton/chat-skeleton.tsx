export default function ChatSkeleton() {

    return (
        <div className="flex flex-col h-full min-h-0 rounded-xl border bg-card animate-pulse">
  {/* Error banner skeleton (optional placeholder space) */}
  {/* <div className="p-3">
    <div className="relative rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded-full bg-muted" />
        <div className="h-4 w-48 rounded bg-muted" />
      </div> */}

      {/* Close icon placeholder */}
      {/* <div className="absolute right-2 top-2 h-5 w-5 rounded bg-muted" />
    </div>
  </div> */}

  {/* Messages (ONLY THIS SCROLLS) */}
  <div className="flex-1 min-h-0 overflow-y-auto p-4">
    <div className="flex flex-col gap-3">
      {/* Assistant message */}
      <div className="flex w-full justify-start">
        <div className="flex flex-col max-w-[75%] items-start">
          <div className="rounded-2xl px-4 py-2 shadow-sm bg-muted">
            <div className="space-y-2">
              <div className="h-4 w-48 rounded bg-muted-foreground/40" />
              <div className="h-4 w-40 rounded bg-muted-foreground/40" />
            </div>
          </div>
          <div className="mt-1 h-3 w-16 rounded bg-muted" />
        </div>
      </div>

      {/* User message */}
      <div className="flex w-full justify-end">
        <div className="flex flex-col max-w-[75%] items-end">
          <div className="rounded-2xl px-4 py-2 shadow-sm bg-muted">
            <div className="space-y-2">
              <div className="h-4 w-36 rounded bg-muted-foreground/40" />
            </div>
          </div>
          <div className="mt-1 h-3 w-14 rounded bg-muted" />
        </div>
      </div>

      {/* Assistant message */}
      <div className="flex w-full justify-start">
        <div className="flex flex-col max-w-[75%] items-start">
          <div className="rounded-2xl px-4 py-2 shadow-sm bg-muted">
            <div className="space-y-2">
              <div className="h-4 w-52 rounded bg-muted-foreground/40" />
              <div className="h-4 w-44 rounded bg-muted-foreground/40" />
              <div className="h-4 w-32 rounded bg-muted-foreground/40" />
            </div>
          </div>
          <div className="mt-1 h-3 w-16 rounded bg-muted" />
        </div>
      </div>
    </div>
  </div>

  {/* Input (FIXED AT BOTTOM) */}
  <div className="border-t p-3 shrink-0 mb-7">
    <div className="relative">
      {/* Textarea skeleton */}
      <div
        className="
          w-full min-h-[60px] rounded-md border
          bg-muted
        "
      />

      {/* Send button skeleton */}
      <div
        className="
          absolute bottom-2 right-2
          h-9 w-9 rounded-md bg-muted
        "
      />
    </div>
  </div>
</div>

    )
}