export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-zinc-200">
      <div className="space-y-3 text-center">
        <div className="mx-auto h-1 w-32 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-white/60" />
        </div>
        <p className="text-xs font-mono tracking-[0.3em] text-zinc-500">
          LOADING
        </p>
      </div>
    </div>
  );
}
