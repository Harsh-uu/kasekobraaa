import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="w-full min-h-[400px] flex justify-center items-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
        <h3 className="font-semibold text-xl">Loading order details...</h3>
        <p className="text-sm text-muted-foreground">This won't take long.</p>
      </div>
    </div>
  )
}
