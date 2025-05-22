'use client'

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex h-[60vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">Something went wrong!</h2>
          <p className="text-zinc-500">
            Sorry, something went wrong while loading your design. Please try again.
          </p>
        </div>
        <div className="flex gap-4">
          <Button onClick={reset}>Try again</Button>
          <Button onClick={() => window.history.back()} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back
          </Button>
        </div>
      </div>
    </div>
  )
}
