import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="relative min-h-[60vh] w-full">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          <p className="text-sm text-zinc-500">Loading preview...</p>
        </div>
      </div>
    </div>
  )
}
